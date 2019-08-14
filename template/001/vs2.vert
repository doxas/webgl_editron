attribute vec3 position;
attribute vec3 velocity;
attribute vec4 color;

uniform float time;      // 時間の経過
uniform vec2  mouse;     // マウスカーソルの位置を正規化した座標
uniform bool  isDown;    // マウスボタンの押下状態
uniform float movePower; // 動く力の強さ（0.0 ~ 1.0）

varying vec3 vPosition; // 出力する頂点座標
varying vec3 vVelocity; // 出力する頂点の向き
varying vec4 vColor;    // 出力する頂点の色

void main(){
    // 頂点の位置を、指定された頂点の向きと力の強さで更新する
    vPosition = position + velocity * 0.1 * movePower;
    // 頂点が移動する向きを更新するため、移動先の座標をマウスカーソル由来で求める
    vec3 p = vec3(mouse, sin(time) * 0.25) - position;
    // マウスボタンの押下状態に応じて、曲げるか、そのままか分岐
    vVelocity = velocity;
    if(isDown == true){
        // 小さくしたベクトル（移動先）を足しこんでから正規化する
        vVelocity = normalize(velocity + p * 0.1 * movePower);
    }
    // ここでは色に対しては特になにもしない
    vColor = color;
}
