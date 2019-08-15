
(() => {
    // constant variables
    const WIDTH  = 512;
    const HEIGHT = 512;
    const SCALE  = 2.0;

    // variables
    let run;
    let startTime;
    let nowTime;
    let gl;
    let canvas;
    let canvasWidth;
    let canvasHeight;
    let mainPrg;
    let tfPrg;
    let position;
    let velocity;
    let color;
    let VBOArray;
    let count;

    // glcubic
    let mat4 = gl3.Math.Mat4;
    let qtn  = gl3.Math.Qtn;

    // matrix
    let mMatrix;
    let vMatrix;
    let pMatrix;
    let vpMatrix;

    // mouse
    let mousePosition  = [0.0, 0.0];
    let mouseMovePower = 0.0;
    let mouseIsDown    = false;

    window.addEventListener('load', () => {
        const OPTION = {webgl2Mode: true};
        canvas = document.getElementById('webgl_canvas');
        gl3.init(canvas, null, OPTION);
        if(!gl3.ready){
            console.log('initialize error');
            return;
        }
        gl = gl3.gl;
        window.addEventListener('keydown', (evt) => {
            run = evt.key !== 'Escape';
        }, false);
        window.addEventListener('resize', (evt) => {
            canvas.width  = canvasWidth  = window.innerWidth;
            canvas.height = canvasHeight = window.innerHeight;
        }, false);

        canvas.width  = canvasWidth  = window.innerWidth;
        canvas.height = canvasHeight = window.innerHeight;

        // event
        canvas.addEventListener('mousedown', (evt) => {
            mouseIsDown = true;
            mouseMovePower = 1.0;
        }, false);
        canvas.addEventListener('mouseup', (evt) => {
            mouseIsDown = false;
        }, false);
        canvas.addEventListener('mousemove', (evt) => {
            let bound = canvas.getBoundingClientRect();
            let x = evt.clientX - bound.left;
            let y = evt.clientY - bound.top;
            let aspect = bound.width / bound.height;
            mousePosition = [
                (x / bound.width * 2.0 - 1.0) * aspect,
                -(y / bound.height * 2.0 - 1.0)
            ];
        }, false);

        // load shader
        loadShader();
    }, false);

    function loadShader(){
        mainPrg = gl3.createProgramFromFile(
            './vs1.vert',
            './fs1.frag',
            ['position', 'velocity', 'color'],
            [3, 3, 4],
            [
                'vpMatrix',
                'move'
            ],
            ['matrix4fv', '1f'],
            isLoaded
        );
        let outVaryings = ['vPosition', 'vVelocity', 'vColor'];
        tfPrg = gl3.createProgramFromFileTF(
            './vs2.vert',
            './fs2.frag',
            ['position', 'velocity', 'color'],
            [3, 3, 4],
            [
                'time',
                'mouse',
                'isDown',
                'movePower',
            ],
            ['1f', '2fv', '1i', '1f'],
            outVaryings,
            isLoaded
        );

        function isLoaded(){
            if(mainPrg.prg != null &&
               tfPrg.prg != null &&
               true
            ){initialize();}
        }
    }

    function initialize(){
        // generate vertices
        position = [];
        velocity = [];
        color = [];
        (() => {
            let i, j, k, l, m;
            let x, y;
            for(i = 0; i < HEIGHT; ++i){
                y = i / HEIGHT * 2.0 - 1.0;
                k = i * WIDTH;
                for(j = 0; j < WIDTH; ++j){
                    x = j / WIDTH * 2.0 - 1.0;
                    l = (k + j) * 4;
                    position.push(x * SCALE, -y * SCALE, 0.0);
                    m = Math.sqrt(x * x + y * y);
                    velocity.push(x / m, -y / m, 0.0);
                    color.push(
                        j / WIDTH * 0.5,
                        i / HEIGHT * 0.5,
                        1.0 * 0.5,
                        0.75,
                    );
                }
            }
        })();
        VBOArray = [
            [
                gl3.createVbo(position),
                gl3.createVbo(velocity),
                gl3.createVbo(color)
            ], [
                gl3.createVbo(position),
                gl3.createVbo(velocity),
                gl3.createVbo(color)
            ]
        ];

        mMatrix      = mat4.identity(mat4.create());
        vMatrix      = mat4.identity(mat4.create());
        pMatrix      = mat4.identity(mat4.create());
        vpMatrix     = mat4.identity(mat4.create());
        let aspect = canvasWidth / canvasHeight;
        mat4.lookAt([0.0, 0.0, 5.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0], vMatrix);
        mat4.perspective(60, aspect, 0.1, 20.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

        // flags
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);

        run = true;
        startTime = Date.now();
        nowTime = 0;
        count = 0;

        // rendering
        render();
    }

    function render(){
        nowTime = (Date.now() - startTime) / 1000;
        if(run){requestAnimationFrame(render);}
        canvas.width  = canvasWidth  = window.innerWidth;
        canvas.height = canvasHeight = window.innerHeight;

        if(mouseIsDown !== true){
            mouseMovePower *= 0.95;
        }

        ++count;
        let countIndex = count % 2;
        let invertIndex = 1 - countIndex;

        // transform feedback
        tfPrg.useProgram();
        tfPrg.setAttribute(VBOArray[countIndex]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, VBOArray[invertIndex][0]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, VBOArray[invertIndex][1]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, VBOArray[invertIndex][2]);
        gl.enable(gl.RASTERIZER_DISCARD);
        gl.beginTransformFeedback(gl.POINTS);
        tfPrg.pushShader([
            nowTime,
            mousePosition,
            mouseIsDown,
            mouseMovePower,
        ]);
        gl3.drawArrays(gl.POINTS, WIDTH * HEIGHT);
        gl.disable(gl.RASTERIZER_DISCARD);
        gl.endTransformFeedback();
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, null);

        // draw
        gl3.sceneView(0, 0, canvasWidth, canvasHeight);
        gl3.sceneClear([0.1, 0.1, 0.1, 1.0], 1.0);
        mainPrg.useProgram();
        mainPrg.setAttribute(VBOArray[invertIndex]);
        mainPrg.pushShader([
            vpMatrix,
            mouseMovePower,
        ]);
        gl3.drawArrays(gl.POINTS, WIDTH * HEIGHT);
    }
})();

