precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// 光のラインをサイン波を動かす
void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	float l = 0.01 / abs(p.y + sin((p.x - time) * 5.0) * 0.5);
	gl_FragColor = vec4(vec3(l), 1.0);
}

