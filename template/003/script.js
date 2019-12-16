
(() => {
    // variables
    let run;
    let startTime;
    let nowTime;
    let gl;
    let ext;
    let canvas;
    let canvasWidth;
    let canvasHeight;
    let mainPrg;
    let position;
    let VBO;

    // glcubic
    let mat4 = gl3.Math.Mat4;
    let qtn  = gl3.Math.Qtn;

    // mouse
    let mousePosition  = [0.0, 0.0];

    window.addEventListener('DOMContentLoaded', () => {
        const OPTION = {webgl2Mode: true};
        canvas = document.getElementById('webgl_canvas');
        gl3.init(canvas, null, OPTION);
        if(!gl3.ready){
            console.log('initialize error');
            return;
        }
        gl = gl3.gl;
        ext = gl.getExtension('OES_standard_derivatives');
        window.addEventListener('keydown', (evt) => {
            run = evt.key !== 'Escape';
        }, false);
        window.addEventListener('resize', (evt) => {
            canvas.width  = canvasWidth  = window.innerWidth;
            canvas.height = canvasHeight = window.innerHeight;
        }, false);

        canvas.width  = canvasWidth  = window.innerWidth;
        canvas.height = canvasHeight = window.innerHeight;

        canvas.addEventListener('mousemove', (evt) => {
            let bound = canvas.getBoundingClientRect();
            let x = evt.clientX - bound.left;
            let y = evt.clientY - bound.top;
            mousePosition = [
                 x / bound.width,
                -y / bound.height
            ];
        }, false);

        // load shader
        loadShader();
    }, false);

    function loadShader(){
        mainPrg = gl3.createProgramFromFile(
            './vs1.vert',
            './fs1.frag',
            ['position'],
            [3],
            [
                'time',
                'mouse',
                'resolution',
            ],
            ['1f', '2fv', '2fv'],
            initialize
        );
    }

    function initialize(){
        // generate vertices
        position = [
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0,
        ];
        VBO = [gl3.createVbo(position)];

        run = true;
        startTime = Date.now();
        nowTime = 0;

        mainPrg.useProgram();
        mainPrg.setAttribute(VBO);
        render();
    }

    function render(){
        nowTime = (Date.now() - startTime) / 1000;
        if(run){requestAnimationFrame(render);}
        canvas.width  = canvasWidth  = window.innerWidth;
        canvas.height = canvasHeight = window.innerHeight;

        // draw
        gl3.sceneView(0, 0, canvasWidth, canvasHeight);
        gl3.sceneClear([0.0, 0.0, 0.0, 1.0]);
        mainPrg.pushShader([
            nowTime,
            mousePosition,
            [canvasWidth, canvasHeight],
        ]);
        gl3.drawArrays(gl.TRIANGLE_STRIP, position.length / 3);
    }
})();

