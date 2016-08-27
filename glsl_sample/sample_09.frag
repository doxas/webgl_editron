precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// 光の玉を出すための明るさ計算用関数
float orb(vec2 position, vec2 offset){
	vec2 q = position - offset;
	float len = length(q);
	return 0.1 / len;
}

// 明るさの計算を外部に切り出し、オフセットで移動させられるようにする
void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	float light = orb(p, vec2(0.5, 0.5));
	gl_FragColor = vec4(vec3(light), 1.0);
}

