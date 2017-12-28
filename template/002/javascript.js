
(() => {
    let canvas, canvasWidth, canvasHeight;
    let gl, ext, mat, qtn, camera;
    let startTime, nowTime;
    let scenePrg, postPrg;

    function main(){
        canvas        = document.getElementById('canvas');
        canvasWidth   = window.innerWidth;
        canvasHeight  = window.innerHeight;
        canvas.width  = canvasWidth;
        canvas.height = canvasHeight;
        gl = canvas.getContext('webgl');
        if(gl == null){
            console.log('webgl unsupported');
            return;
        }
        ext = getWebGLExtensions();
        mat = new matIV();
        qtn = new qtnIV();
        camera = new InteractionCamera();
        camera.update();
        canvas.addEventListener('mousedown', camera.startEvent, false);
        canvas.addEventListener('mousemove', camera.moveEvent, false);
        canvas.addEventListener('mouseup', camera.endEvent, false);
        canvas.addEventListener('wheel', camera.wheelEvent, false);

        let vs = createShader(WE.vs, gl.VERTEX_SHADER);
        let fs = createShader(WE.fs, gl.FRAGMENT_SHADER);
        let prg = createProgram(vs, fs);
        if(prg == null){return;}
        scenePrg = new ProgramParameter(prg);
        vs = createShader(WE.vsp, gl.VERTEX_SHADER);
        fs = createShader(WE.fsp, gl.FRAGMENT_SHADER);
        prg = createProgram(vs, fs);
        if(prg == null){return;}
        postPrg = new ProgramParameter(prg);
        init();
    }

    function init(texture){
        scenePrg.attLocation[0] = gl.getAttribLocation(scenePrg.program, 'position');
        scenePrg.attLocation[1] = gl.getAttribLocation(scenePrg.program, 'color');
        scenePrg.attStride[0]   = 3;
        scenePrg.attStride[1]   = 4;
        scenePrg.uniLocation[0] = gl.getUniformLocation(scenePrg.program, 'mvpMatrix');
        scenePrg.uniType[0]     = 'uniformMatrix4fv';
        postPrg.attLocation[0] = gl.getAttribLocation(postPrg.program, 'position');
        postPrg.attStride[0]   = 3;
        postPrg.uniLocation[0] = gl.getUniformLocation(postPrg.program, 'texture');
        postPrg.uniLocation[1] = gl.getUniformLocation(postPrg.program, 'time');
        postPrg.uniType[0]     = 'uniform1i';
        postPrg.uniType[1]     = 'uniform1f';
        let position = [
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        let color = [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0
        ];
        let VBO = [
            createVbo(position),
            createVbo(color)
        ];
        let postVBO = [
            createVbo(position)
        ];
        let index = [
            0, 2, 1, 1, 2, 3
        ];
        let IBO = createIbo(index);

        let fBuffer = createFramebuffer(canvasWidth, canvasHeight);
        gl.bindTexture(gl.TEXTURE_2D, fBuffer.texture);

        let mMatrix   = mat.identity(mat.create());
        let vMatrix   = mat.identity(mat.create());
        let pMatrix   = mat.identity(mat.create());
        let vpMatrix  = mat.identity(mat.create());
        let mvpMatrix = mat.identity(mat.create());
        let qtnMatrix = mat.identity(mat.create());

        gl.clearColor(0.7, 0.7, 1.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);

        startTime = Date.now();
        nowTime = 0;
        WE.run = true;

        render();

        function render(){
            nowTime = (Date.now() - startTime) / 1000;
            canvasWidth   = window.innerWidth;
            canvasHeight  = window.innerHeight;
            canvas.width  = canvasWidth;
            canvas.height = canvasHeight;

            gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer.framebuffer);
            gl.useProgram(scenePrg.program);
            gl.viewport(0, 0, canvasWidth, canvasHeight);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            let cameraPosition    = [0.0, 0.0, 3.0];
            let centerPoint       = [0.0, 0.0, 0.0];
            let cameraUpDirection = [0.0, 1.0, 0.0];
            let fovy   = 60 * camera.scale;
            let aspect = canvasWidth / canvasHeight;
            let near   = 0.1;
            let far    = 10.0;

            mat.lookAt(cameraPosition, centerPoint, cameraUpDirection, vMatrix);
            mat.perspective(fovy, aspect, near, far, pMatrix);
            mat.multiply(pMatrix, vMatrix, vpMatrix);
            camera.update();
            mat.identity(qtnMatrix);
            qtn.toMatIV(camera.qtn, qtnMatrix);
            mat.multiply(vpMatrix, qtnMatrix, vpMatrix);

            setAttribute(VBO, scenePrg.attLocation, scenePrg.attStride, IBO);
            mat.identity(mMatrix);
            mat.rotate(mMatrix, nowTime * 0.1, [0.0, 1.0, 0.0], mMatrix);
            mat.multiply(vpMatrix, mMatrix, mvpMatrix);
            gl[scenePrg.uniType[0]](scenePrg.uniLocation[0], false, mvpMatrix);
            gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.useProgram(postPrg.program);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            setAttribute(postVBO, postPrg.attLocation, postPrg.attStride, IBO);
            gl[postPrg.uniType[0]](postPrg.uniLocation[0], 0);
            gl[postPrg.uniType[1]](postPrg.uniLocation[1], nowTime);
            gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);
            gl.flush();

            if(WE.run){requestAnimationFrame(render);}
        }
    }

    // utility ================================================================
    class InteractionCamera {
        constructor(){
            this.qtn               = qtn.identity(qtn.create());
            this.dragging          = false;
            this.prevMouse         = [0, 0];
            this.rotationScale     = Math.min(window.innerWidth, window.innerHeight);
            this.rotation          = 0.0;
            this.rotateAxis        = [0.0, 0.0, 0.0];
            this.rotatePower       = 1.5;
            this.rotateAttenuation = 0.9;
            this.scale             = 1.0;
            this.scalePower        = 0.0;
            this.scaleAttenuation  = 0.8;
            this.scaleMin          = 0.5;
            this.scaleMax          = 1.5;
            this.startEvent        = this.startEvent.bind(this);
            this.moveEvent         = this.moveEvent.bind(this);
            this.endEvent          = this.endEvent.bind(this);
            this.wheelEvent        = this.wheelEvent.bind(this);
        }
        startEvent(eve){
            this.dragging = true;
            this.prevMouse = [eve.clientX, eve.clientY];
        }
        moveEvent(eve){
            if(this.dragging !== true){return;}
            let x = this.prevMouse[0] - eve.clientX;
            let y = this.prevMouse[1] - eve.clientY;
            this.rotation = Math.sqrt(x * x + y * y) / this.rotationScale * this.rotatePower;
            this.rotateAxis[0] = y;
            this.rotateAxis[1] = x;
            this.prevMouse = [eve.clientX, eve.clientY];
        }
        endEvent(){
            this.dragging = false;
        }
        wheelEvent(eve){
            let w = eve.wheelDelta;
            if(w > 0){
                this.scalePower = -0.05;
            }else if(w < 0){
                this.scalePower =  0.05;
            }
        }
        update(){
            this.scalePower *= this.scaleAttenuation;
            this.scale = Math.max(this.scaleMin, Math.min(this.scaleMax, this.scale + this.scalePower));
            if(this.rotation === 0.0){return;}
            this.rotation *= this.rotateAttenuation;
            let q = qtn.identity(qtn.create());
            qtn.rotate(this.rotation, this.rotateAxis, q);
            qtn.multiply(this.qtn, q, this.qtn);
        }
    }

    class ProgramParameter {
        constructor(program){
            this.program = program;
            this.attLocation = [];
            this.attStride = [];
            this.uniLocation = [];
            this.uniType = [];
        }
    }

    function createShader(source, type){
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            return shader;
        }else{
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
    }

    function createProgram(vs, fs){
        if(vs == null || fs == null){return;}
        let program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if(gl.getProgramParameter(program, gl.LINK_STATUS)){
            gl.useProgram(program);
            return program;
        }else{
            alert(gl.getProgramInfoLog(program));
            return null;
        }
    }

    function createVbo(data){
        let vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }

    function createIbo(data){
        let ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return ibo;
    }

    function createIboInt(data){
        let ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return ibo;
    }

    function setAttribute(vbo, attL, attS, ibo){
        for(let i in vbo){
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
            gl.enableVertexAttribArray(attL[i]);
            gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
        }
        if(ibo != null){
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        }
    }

    function createFramebuffer(width, height){
        let frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        let depthRenderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
        let fTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, fTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return {framebuffer: frameBuffer, renderbuffer: depthRenderBuffer, texture: fTexture};
    }

    function getWebGLExtensions(){
        return {
            elementIndexUint: gl.getExtension('OES_element_index_uint'),
            textureFloat:     gl.getExtension('OES_texture_float'),
            textureHalfFloat: gl.getExtension('OES_texture_half_float')
        };
    }

    main();
})();
