attribute vec3 position;
attribute vec3 velocity;
attribute vec4 color;

uniform float time;
uniform vec2  mouse;
uniform bool  isDown;
uniform float movePower;

varying vec3 vPosition;
varying vec3 vVelocity;
varying vec4 vColor;

void main(){
    vPosition = position + velocity * 0.1 * movePower;
    vec3 p = vec3(mouse, sin(time) * 0.25) - position;
    vVelocity = velocity;
    if(isDown == true){
        vVelocity = normalize(velocity + p * 0.1 * movePower);
    }
    vColor = color;
}
