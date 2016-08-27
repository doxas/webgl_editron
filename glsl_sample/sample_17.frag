precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// タイル模様を生成する
void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	float tile = 1.0;
	if(
		(mod(p.x, 1.0) > 0.5 && mod(p.y, 1.0) < 0.5) ||
		(mod(p.x, 1.0) < 0.5 && mod(p.y, 1.0) > 0.5)
	){
		tile = 0.25;
	}
	gl_FragColor = vec4(vec3(tile), 1.0);
}

