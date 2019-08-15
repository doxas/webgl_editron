attribute vec3  position;
attribute vec2  texCoord;
uniform   mat4  mvpMatrix;
varying   vec2  vTexCoord;

void main(){
    vTexCoord = texCoord;
    gl_Position = mvpMatrix * vec4(position, 1.0);
}
