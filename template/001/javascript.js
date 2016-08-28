// ============================================================================
//
// school 2016 10. sample.001 : simple scene
//
// ============================================================================
//
// 最もシンプルなマルチシェーダ実装です。
// まずオフスクリーンにテクスチャを貼ったモデルをレンダリングします。
// 本番の canvas には、オフスクリーンのシーンをそのまま描画します。これが全ての
// サンプルのベースになる、最もシンプルな構成です。
//
// ============================================================================
//
// ローカルで開発する場合、変数名 WE となっているオブジェクトの扱いに気をつけて
// ください。変数 WE は、オンラインエディタから値をバイパスするための変数なので
// 単体で実行する場合には未定義になってしまいます。
// また、window のロード完了と同時に動かすべき部分は、addEventListener をコメン
// トアウトしている部分をコメント解除すればいいだけの状態になっています。
//
// ============================================================================

(function(){
    'use strict';
    var gl;
    var qt = gl3.qtn.create();
    gl3.qtn.identity(qt);

    // window.addEventListener('load', function(){ // onload event ------------

    // glcubic の初期化
    var canvas = document.getElementById('canvas');
    gl3.initGL(canvas);
    if(!gl3.ready){console.log('initialize error'); return;}

    // 扱いやすいように gl に WebGL Context オブジェクトを代入しておく
    gl = gl3.gl;

    // canvas のサイズをフレーム内の最大幅に設定
    var canvasSize = Math.min(window.innerWidth, window.innerHeight);
    gl3.canvas.width  = canvasSize;
    gl3.canvas.height = canvasSize;

    // マウスカーソルの動きに応じてカメラを動かすためのイベント登録
    gl3.canvas.addEventListener('mousemove', mouseMove, true);

    // テクスチャをロードしコールバックに init 関数を登録
    // gl3.create_texture('pepper.jpg', 0, init);
    gl3.create_texture_canvas(WE.images['lenna.jpg'], 0);
    init();

    // }, false); // onload event ---------------------------------------------

    function init(){
        // glcubic でプログラムオブジェクトのラッパーを生成（ベースシーン用）
        var prg = gl3.program.create_from_source(
            WE.vs,
            WE.fs,
            ['position', 'normal', 'color', 'texCoord'],
            [3, 3, 4, 2],
            ['mMatrix', 'mvpMatrix', 'normalMatrix', 'texture'],
            ['matrix4fv', 'matrix4fv', 'matrix4fv', '1i']
        );
        if(prg == null){return;}

        // glcubic でプログラムオブジェクトのラッパーを生成（ポストエフェクト用）
        var pPrg = gl3.program.create_from_source(
            WE.vsp,
            WE.fsp,
            ['position'],
            [3],
            ['texture'],
            ['1i']
        );
        if(pPrg == null){return;}

        // 球体のメッシュデータを生成
        var sphereData = gl3.mesh.sphere(64, 64, 1.25, [1.0, 1.0, 1.0, 1,0]);
        var sphereVBO = [
            gl3.create_vbo(sphereData.position),
            gl3.create_vbo(sphereData.normal),
            gl3.create_vbo(sphereData.color),
            gl3.create_vbo(sphereData.texCoord)
        ];
        var sphereIBO = gl3.create_ibo(sphereData.index);

        // トーラスのメッシュデータを生成
        var torusData = gl3.mesh.torus(64, 64, 0.5, 2.0, [1.0, 1.0, 1.0, 1,0]);
        var torusVBO = [
            gl3.create_vbo(torusData.position),
            gl3.create_vbo(torusData.normal),
            gl3.create_vbo(torusData.color),
            gl3.create_vbo(torusData.texCoord)
        ];
        var torusIBO = gl3.create_ibo(torusData.index);

        // プレビュー用の四角形ポリゴンメッシュデータを生成
        var planePosition = [
            -1.0,  1.0,  0.0,
             1.0,  1.0,  0.0,
            -1.0, -1.0,  0.0,
             1.0, -1.0,  0.0
        ];
        var planeNormal = [
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ];
        var planeColor = [
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0
        ];
        var planeTexCoord = [
            0.0, 0.0, 1.0, 0.0,
            0.0, 1.0, 1.0, 1.0
        ];
        var planeIndex = [
            0, 1, 2, 2, 1, 3
        ];
        var planeVBO = [gl3.create_vbo(planePosition)];
        var planeIBO = gl3.create_ibo(planeIndex);
        var floorVBO = [
            gl3.create_vbo(planePosition),
            gl3.create_vbo(planeNormal),
            gl3.create_vbo(planeColor),
            gl3.create_vbo(planeTexCoord)
        ];
        var floorIBO = gl3.create_ibo(planeIndex);

        // 行列関係の初期化
        var mMatrix   = gl3.mat4.identity(gl3.mat4.create());
        var vMatrix   = gl3.mat4.identity(gl3.mat4.create());
        var pMatrix   = gl3.mat4.identity(gl3.mat4.create());
        var vpMatrix  = gl3.mat4.identity(gl3.mat4.create());
        var mvpMatrix = gl3.mat4.identity(gl3.mat4.create());
        var invMatrix = gl3.mat4.identity(gl3.mat4.create());
        var normalMatrix = gl3.mat4.identity(gl3.mat4.create());

        // 深度テストの有効化
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        // フレームバッファを生成
        var bufferSize = 1024;
        var fBuffer = gl3.create_framebuffer(bufferSize, bufferSize, 1);

        // テクスチャのバインド
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, gl3.textures[0].texture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, gl3.textures[1].texture);

        // レンダリング開始前の初期化
        var count = 0;
        var cameraPosition = [];
        var centerPoint = [0.0, 0.0, 0.0];
        var cameraUpDirection = [];

        // レンダリング許可フラグを立ててレンダリング開始
        WE.run = true;
        render();

        // レンダリング関数
        function render(){
            // 回転軸の指定に利用する変数を宣言
            var axis = [];

            // カウンタの値から動的にラジアンを生成
            var radian = gl3.TRI.rad[count % 360];

            // カウンタをインクリメント
            count++;

            // 透視射影変換行列
            gl3.qtn.toVecIII([0.0, 0.0, 10.0], qt, cameraPosition);
            gl3.qtn.toVecIII([0.0, 1.0, 0.0], qt, cameraUpDirection);
            var camera = gl3.camera.create(
                cameraPosition,
                centerPoint,
                cameraUpDirection,
                45, 1.0, 0.1, 30.0
            );
            gl3.mat4.vpFromCamera(camera, vMatrix, pMatrix, vpMatrix);

            // フレームバッファを描画対象に設定し背景をクリア、ビューポートを設定
            gl.bindFramebuffer(gl.FRAMEBUFFER, fBuffer.framebuffer);
            gl3.scene_clear([0.0, 0.7, 0.7, 1.0], 1.0);
            gl3.scene_view(camera, 0, 0, bufferSize, bufferSize);

            // ベースシーン用のプログラムトーラスメッシュをセット
            prg.set_program();

            // 球体の描画 =====================================================
            prg.set_attribute(sphereVBO, sphereIBO);

            // 行列生成
            axis = [0.0, 1.0, 0.0];
            gl3.mat4.identity(mMatrix);
            gl3.mat4.rotate(mMatrix, radian, axis, mMatrix);
            gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
            gl3.mat4.inverse(mMatrix, invMatrix);
            gl3.mat4.transpose(invMatrix, normalMatrix);

            // シェーダにデータをプッシュして描画
            prg.push_shader([mMatrix, mvpMatrix, normalMatrix, 0]);
            gl3.draw_elements(gl.TRIANGLES, sphereData.index.length);

            // トーラスの描画 =================================================
            prg.set_attribute(torusVBO, torusIBO);

            // 行列生成
            axis = [0.0, -1.0, 0.0];
            gl3.mat4.identity(mMatrix);
            gl3.mat4.rotate(mMatrix, radian, axis, mMatrix);
            gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
            gl3.mat4.inverse(mMatrix, invMatrix);
            gl3.mat4.transpose(invMatrix, normalMatrix);

            // シェーダにデータをプッシュして描画
            prg.push_shader([mMatrix, mvpMatrix, normalMatrix, 0]);
            gl3.draw_elements(gl.TRIANGLES, torusData.index.length);

            // 床面の描画 =====================================================
            prg.set_attribute(floorVBO, floorIBO);

            // 行列生成
            axis = [-1.0, 0.0, 0.0];
            gl3.mat4.identity(mMatrix);
            gl3.mat4.translate(mMatrix, [0.0, -2.0, 0.0], mMatrix);
            gl3.mat4.rotate(mMatrix, Math.PI / 2, axis, mMatrix);
            gl3.mat4.scale(mMatrix, [10.0, 10.0, 1.0], mMatrix);
            gl3.mat4.multiply(vpMatrix, mMatrix, mvpMatrix);
            gl3.mat4.inverse(mMatrix, invMatrix);
            gl3.mat4.transpose(invMatrix, normalMatrix);

            // シェーダにデータをプッシュして描画
            prg.push_shader([mMatrix, mvpMatrix, normalMatrix, 0]);
            gl3.draw_elements(gl.TRIANGLES, planeIndex.length);

            // canvas を描画対象にし背景をクリア、ビューポートを設定 ==========
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl3.scene_clear([0.3, 0.3, 0.3, 1.0], 1.0);
            gl3.scene_view(null, 0, 0, gl3.canvas.width, gl3.canvas.height);

            // ポストエフェクト用のプログラムを選択し四角形ポリゴンメッシュをセット
            pPrg.set_program();
            pPrg.set_attribute(planeVBO, planeIBO);

            // シェーダにデータをプッシュして描画
            pPrg.push_shader([1]);
            gl3.draw_elements(gl.TRIANGLES, planeIndex.length);

            // フラグをチェックして再帰
            if(WE.run){requestAnimationFrame(render);}
        }
    }

    // マウスカーソルでカメラを動かすためのイベント処理
    function mouseMove(eve) {
        var cw = gl3.canvas.width;
        var ch = gl3.canvas.height;
        var wh = 1 / Math.sqrt(cw * cw + ch * ch);
        var x = eve.clientX - gl3.canvas.offsetLeft - cw * 0.5;
        var y = eve.clientY - gl3.canvas.offsetTop - ch * 0.5;
        var sq = Math.sqrt(x * x + y * y);
        var r = sq * 2.0 * Math.PI * wh;
        if (sq != 1) {
            sq = 1 / sq;
            x *= sq;
            y *= sq;
        }
        gl3.qtn.rotate(r, [y, x, 0.0], qt);
    }
})();

