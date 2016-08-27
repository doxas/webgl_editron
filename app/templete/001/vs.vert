attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
attribute vec2 texCoord;

uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
uniform mat4 normalMatrix;

varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vTexCoord;

void main(){
    // 参照されない uniform 変数はコンパイル時に最適化される
    mat4 dummy = mMatrix;

    // 法線を行列で変換する
    vNormal = (normalMatrix * vec4(normal, 0.0)).xyz;

    // 頂点を行列で変換する
    gl_Position = mvpMatrix * vec4(position, 1.0);

    // 頂点カラーとテクスチャ座標はそのままフラグメントシェーダへ
    vColor = color;
    vTexCoord = texCoord;
}

