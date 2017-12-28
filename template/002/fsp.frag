precision mediump float;
uniform sampler2D texture;
uniform float     time;
varying vec2      vTexCoord;
float rnd(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
void main(){
    float n = rnd(gl_FragCoord.st + mod(time, 10.0));
    vec4 samplerColor = texture2D(texture, vTexCoord);
    gl_FragColor = samplerColor * vec4(vec3(n * 0.2 + 0.8), 1.0);
}
