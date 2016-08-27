precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// noise =========================================================
float rnd(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float noise(vec2 p){
	vec2 v = floor(p);
	vec2 u = fract(p);
	u = u * u * (3.0 - 2.0 * u);
	float r = mix(
		mix(rnd(v), rnd(v + vec2(1.0, 0.0)), u.x),
		mix(rnd(v + vec2(0.0, 1.0)), rnd(v + vec2(1.0, 1.0)), u.x),
		u.y
	);
	return r * r;
}
float snoise(vec2 p){
	float n = 0.0;
	for(float i = 0.0; i < 6.0; ++i){
		float v = pow(2.0, 2.0 + i);
		float w = pow(2.0, -1.0 - i);
		n += noise(p * v) * w;
	}
	return n;
}
// ===============================================================

// 炎の色
const vec3 fireColor = vec3(0.9, 0.3, 0.1);

// ノイズで模様を描画する
void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	
	// アークタンジェントを使って座標を歪める
	vec2 q = atan(p);
	
	// 歪めた座標を移動させながらノイズを生成
	float n = snoise(q + time * 2.0) * 5.0;

	gl_FragColor = vec4(fireColor * n, 1.0);
}

