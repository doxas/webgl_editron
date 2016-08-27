precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// 強い光のような表現を行う一例
void main(){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution;
	float len = length(p);
	float light = 0.1 / len;
	gl_FragColor = vec4(vec3(light), 1.0);
}

