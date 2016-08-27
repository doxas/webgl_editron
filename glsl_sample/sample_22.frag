precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	// カメラを定義する
	vec3 cPos = vec3(0.0,  0.0,  3.0); // カメラの位置
	vec3 cDir = vec3(0.0,  0.0, -1.0); // カメラの向き(視線)
	vec3 cUp  = vec3(0.0,  1.0,  0.0); // カメラの上方向
	vec3 cSide = cross(cDir, cUp);	 // 外積を使って横方向を算出
	float targetDepth = 0.1;		   // フォーカスする深度

	// カメラの情報からレイを定義する
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

	// レイをそのまま色として出力
	gl_FragColor = vec4(ray.xy, -ray.z, 1.0);
}
