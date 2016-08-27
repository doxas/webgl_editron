precision mediump float;
uniform vec2  resolution;    // resolution (512.0, 512.0)
uniform vec2  mouse;         // mouse      (-1.0 ~ 1.0)
uniform float time;          // time       (1second == 1.0)
uniform sampler2D prevScene; // previous scene texture

void main(){
	// variable
	int   I = 0;
	float F = 0.0;
	float G = float(I);      // cast
	vec2  V = vec2(0.0);
	vec2  W = vec2(0.0, 0.0);
	vec3  X = vec3(V, 0.0);
	vec3  Y = X.xyz;         // swizzle
	vec4  Z = vec4(Y.zz, V);
	
	gl_FragColor = vec4(vec3(0.5), 1.0);
}
