precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// hsv 色空間による色の生成
vec3 hsv(float h, float s, float v){
	vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
	return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

// サイン波生成用
float sineLine(vec2 position, float speed, float offset){
	return 0.005 / abs(position.y + sin(((position.x - offset * time * 0.2) - time * speed) * 5.0) * 0.75);
}

// サイン波で光の網目を描く
void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	vec3 light = vec3(0.0);
	for(int i = 0; i < 16; ++i){
		vec3 color = hsv(float(i) / 16.0, 1.0, 1.0);
		light += color * sineLine(p, 0.5, 6.28 / 16.0 * float(i));
	}
	gl_FragColor = vec4(vec3(light), 1.0);
}

