precision mediump float;

uniform sampler2D texture;

varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vTexCoord;

// 平行光源
const vec3 lightDirection = normalize(vec3(0.5, 1.0, 0.5));

void main(){
    // ライトの影響を計算
    float diffuse = max(dot(lightDirection, vNormal), 0.2);

    // テクスチャの色
    vec4 samplerColor = texture2D(texture, vTexCoord);

    // 最終出力カラー
    vec4 destColor = vColor * samplerColor;
    gl_FragColor = vec4(destColor.rgb * diffuse, destColor.a);
}

