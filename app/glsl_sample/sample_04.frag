precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// reference style
void darker(inout vec3 color){
	color *= 0.5;
}

void main(){
	vec3 green = vec3(0.1, 1.0, 0.3);
	darker(green);
	gl_FragColor = vec4(green, 1.0);
}
