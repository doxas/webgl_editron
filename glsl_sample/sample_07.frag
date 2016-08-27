precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// 各ピクセルの原点からの距離を計測し色として出力する
void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	gl_FragColor = vec4(vec3(length(p)), 1.0);
}

