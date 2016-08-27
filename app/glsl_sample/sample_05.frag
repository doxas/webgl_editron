precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// 座標を正規化する
void main(){
	vec2 p = gl_FragCoord.xy / resolution;
	gl_FragColor = vec4(p, 1.0, 1.0);
}
