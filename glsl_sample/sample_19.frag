precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// タイル模様を生成する
void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;

	// 回転行列を生成する
	float s = sin(time);
	float c = cos(time);
	mat2 m = mat2(c, s, -s, c);

	// 座標を行列で回転させる
	vec2 q = m * (p + sin(time)) * 5.0;

	float tile = 1.0;
	if(
		(mod(q.x, 1.0) > 0.5 && mod(q.y, 1.0) < 0.5) ||
		(mod(q.x, 1.0) < 0.5 && mod(q.y, 1.0) > 0.5)
	){
		tile = 0.25;
	}
	gl_FragColor = vec4(vec3(tile), 1.0);
}

