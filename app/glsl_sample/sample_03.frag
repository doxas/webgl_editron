precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

// function
vec3 purple(float dark){
	return vec3(1.0, 0.3, 1.0) * dark;
}

void main(){
	gl_FragColor = vec4(purple(0.75), 1.0);
}
