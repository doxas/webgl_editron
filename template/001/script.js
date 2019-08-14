(() => {
    const WIDTH  = 256;
    const HEIGHT = 256;

    // variables
    let run;          // 実行フラグ
    let startTime;    // ループ開始時間
    let nowTime;      // 現在までの経過時間
    let gl;           // WebGL Rendering Context
    let canvas;       // canvas エレメントへの参照
    let canvasWidth;  // canvas の横幅
    let canvasHeight; // canvas の高さ
    let mainPrg;      // メインシーン用プログラムオブジェクト
    let tfPrg;        // トランスフォーム・フィードバック用プログラムオブジェクト
    let position;     // 頂点座標
    let velocity;     // 頂点の進行方向
    let color;        // 頂点カラー
    let VBOArray;     // VBO を格納した配列（の配列）
    let count;        // スワップ判定するためのカウンタ

    // glcubic
    let mat4 = gl3.Math.Mat4; // 行列処理
    let qtn  = gl3.Math.Qtn;  // クォータニオン処理

    // matrix
    let mMatrix;   // モデル座標変換行列
    let vMatrix;   // ビュー座標変換行列
    let pMatrix;   // プロジェクション座標変換行列
    let vpMatrix;  // ビュー x プロジェクション

    // mouse
    let mousePosition  = [0.0, 0.0]; // マウスカーソルの位置
    let mouseMovePower = 0.0;        // マウス由来の移動係数
    let mouseIsDown    = false;      // マウスボタンが押下されているか

    window.addEventListener('load', () => {
        // WebGL 2.0 を利用する
        const OPTION = {
            webgl2Mode: true
        };

        // glcubic の初期化
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

        // キャンバスの大きさをウィンドウサイズにあわせる
        canvas.width  = canvasWidth  = window.innerWidth;
        canvas.height = canvasHeight = window.innerHeight;

        // イベントの登録
        canvas.addEventListener('mousedown', (evt) => {
            // マウスボタンが押下された
            mouseIsDown = true;
            mouseMovePower = 1.0;
        }, false);
        canvas.addEventListener('mouseup', (evt) => {
            // マウスボタンが離された
            mouseIsDown = false;
        }, false);
        canvas.addEventListener('mousemove', (evt) => {
            // マウスカーソルが移動した
            let bound = canvas.getBoundingClientRect();
            let x = evt.clientX - bound.left;
            let y = evt.clientY - bound.top;
            let aspect = bound.width / bound.height;
            mousePosition = [
                (x / bound.width * 2.0 - 1.0) * aspect,
                -(y / bound.height * 2.0 - 1.0)
            ];
        }, false);

        // シェーダロードへ移行
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
        // transform feedback からの出力を受ける変数名の配列
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
        // VBO に格納する頂点データを生成
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
                    position.push(x, -y, 0.0);
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
        // VBO をスワップしながら更新するため、２つセットにしておく
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

        // 行列の初期化
        mMatrix      = mat4.identity(mat4.create());
        vMatrix      = mat4.identity(mat4.create());
        pMatrix      = mat4.identity(mat4.create());
        vpMatrix     = mat4.identity(mat4.create());
        let aspect = canvasWidth / canvasHeight;
        mat4.lookAt([0.0, 0.0, 5.0], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0], vMatrix);
        mat4.perspective(60, aspect, 0.1, 20.0, pMatrix);
        mat4.multiply(pMatrix, vMatrix, vpMatrix);

        // ブレンドのフラグを設定する
        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);

        // 汎用変数の初期化
        run = true;
        startTime = Date.now();
        nowTime = 0;
        count = 0;

        // レンダリング関数を呼ぶ
        render();
    }

    function render(){
        // 時間を更新
        nowTime = (Date.now() - startTime) / 1000;

        // 再帰呼び出し
        if(run){requestAnimationFrame(render);}

        // キャンバスの大きさをウィンドウサイズにあわせる
        canvas.width  = canvasWidth  = window.innerWidth;
        canvas.height = canvasHeight = window.innerHeight;

        // マウスの押下状況によって減衰を掛ける
        if(mouseIsDown !== true){
            mouseMovePower *= 0.95;
        }

        // カウンタをインクリメントする
        ++count;
        let countIndex = count % 2;
        let invertIndex = 1 - countIndex;

        // トランスフォーム・フィードバックの開始 =============================
        tfPrg.useProgram();
        tfPrg.setAttribute(VBOArray[countIndex]);
        // VBO の設定
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, VBOArray[invertIndex][0]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, VBOArray[invertIndex][1]);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, VBOArray[invertIndex][2]);
        // ラスタライズを無効化しトランスフォーム・フィードバックを開始
        gl.enable(gl.RASTERIZER_DISCARD);
        gl.beginTransformFeedback(gl.POINTS);
        // シェーダに uniform 変数の状態をプッシュ
        tfPrg.pushShader([
            nowTime,
            mousePosition,
            mouseIsDown,
            mouseMovePower,
        ]);
        // 実行
        gl3.drawArrays(gl.POINTS, WIDTH * HEIGHT);
        // トランスフォーム・フィードバックの終了処理
        gl.disable(gl.RASTERIZER_DISCARD);
        gl.endTransformFeedback();
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, null);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, null);
        // ====================================================================

        // シーンのクリア
        gl3.sceneView(0, 0, canvasWidth, canvasHeight);
        gl3.sceneClear([0.1, 0.1, 0.1, 1.0], 1.0);
        // 更新した VBO を canvas 上に描画
        mainPrg.useProgram();
        mainPrg.setAttribute(VBOArray[invertIndex]);
        mainPrg.pushShader([
            vpMatrix,
            mouseMovePower,
        ]);
        gl3.drawArrays(gl.POINTS, WIDTH * HEIGHT);
    }
})();

