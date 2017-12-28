attribute vec3 position;
varying   vec2 vTexCoord;
void main(){
    gl_Position = vec4(position, 1.0);
    vTexCoord = (position.xy + 1.0) * 0.5;
}
