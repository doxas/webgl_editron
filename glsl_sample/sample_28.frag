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

// repetition
vec3 trans(vec3 p){
	return mod(p, 4.0) - 2.0;
}

// distance function
float sphere(vec3 p){
	return length(trans(p)) - 1.0;
}

// normal
vec3 getNormal(vec3 p){
	float d = 0.001;
	return normalize(vec3(
		sphere(p + vec3(  d, 0.0, 0.0)) - sphere(p + vec3( -d, 0.0, 0.0)),
		sphere(p + vec3(0.0,   d, 0.0)) - sphere(p + vec3(0.0,  -d, 0.0)),
		sphere(p + vec3(0.0, 0.0,   d)) - sphere(p + vec3(0.0, 0.0,  -d))
	));
}

void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	// カメラを定義する
	vec3 cPos = vec3(0.0,  0.0,  3.0); // カメラの位置
	cPos += vec3(cos(time) * 1.25, sin(time) * 0.75, sin(time * 0.5));
	vec3 cDir = vec3(0.0,  0.0, -1.0); // カメラの向き(視線)
	vec3 cUp  = vec3(0.0,  1.0,  0.0); // カメラの上方向
	vec3 cSide = cross(cDir, cUp);     // 外積を使って横方向を算出
	float targetDepth = 1.0;           // フォーカスする深度

	// カメラの情報からレイを定義する
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

	// マーチングループを組む
	float dist = 0.0;  // レイとオブジェクト間の最短距離
	float rLen = 0.0;  // レイに継ぎ足す長さ
	vec3  rPos = cPos; // レイの先端位置(初期位置)
	for(int i = 0; i < 128; ++i){
		dist = sphere(rPos);
		rLen += dist;
		rPos = cPos + ray * rLen;
	}

	// レイとオブジェクトの距離を確認
	if(abs(dist) < 0.001){
		// 法線を算出
		vec3 normal = getNormal(rPos);

		// 法線からノイズを生成
		float n = snoise(normal.xy + time) * 5.0;
		vec4 fire = vec4(fireColor * n, 1.0);

		// ライトベクトルとの内積を取る
		float diff = max(dot(normal, normalize(vec3(1.0))), 0.1);

		// カメラからオブジェクトのまでの距離に応じて暗くする
		float dark = min(10.0 / length(rPos), 1.0);

		// 最終的に出力する色に炎の色を乗算する
		gl_FragColor = vec4(vec3(diff) * dark, 1.0) * fire;
	}else{
		gl_FragColor = vec4(vec3(0.0), 1.0);
	}
}

