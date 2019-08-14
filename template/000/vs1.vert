attribute vec3 position;
attribute vec3 velocity;
attribute vec4 color;

uniform mat4  vpMatrix;
uniform float move;

varying vec4 vColor;

void main(){
    vColor = color + vec4(velocity, 0.0);
    gl_Position = vpMatrix * vec4(position, 1.0);
    gl_PointSize = 1.0 * (1.0 + move);
}
