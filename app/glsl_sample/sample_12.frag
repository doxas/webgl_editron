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

// 光の玉を出すための明るさ計算用関数
float orb(vec2 position, vec2 offset){
	vec2 q = position - offset;
	float len = length(q);
	return 0.02 / len;
}

// 光の玉をカラフルに色付ける
void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	vec3 light = vec3(0.0);
	for(int i = 1; i <= 20; ++i){
		// HSV 色空間による計算のために Hue を求める
		float hue = (1.0 / 20.0) * float(i);

		// HSV で色を取得
		vec3 color = hsv(hue, 1.0, 1.0);

		// 明るさを計算
		float f = float(i) * 0.25;
		vec2 offset = vec2(cos(time * f), sin(time * f)) * 0.75;

		// 明るさに色を掛け合わせ加算合成する
		light += color * orb(p, offset);
	}
	gl_FragColor = vec4(light, 1.0);
}

