attribute vec3  position;
attribute vec4  color;
attribute vec2  texCoord;
uniform   mat4  mvpMatrix;
varying   vec4  vColor;
varying   vec2  vTexCoord;
void main(){
    vColor = color;
    vTexCoord = texCoord;
    gl_Position = mvpMatrix * vec4(position, 1.0);
    gl_PointSize = 8.0;
}

