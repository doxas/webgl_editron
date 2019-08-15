precision mediump float;
uniform vec2      mouse;
uniform sampler2D colorTexture;
uniform sampler2D heightTexture;
varying vec2      vTexCoord;
const   float     focus = 0.5;

void main(){
    float height = texture2D(heightTexture, vTexCoord).r - focus;
    vec2 mouseVec = -mouse * 0.025 * height;
    gl_FragColor = texture2D(colorTexture, vTexCoord + mouseVec);
}
