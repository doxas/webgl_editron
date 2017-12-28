precision mediump float;
uniform vec4      globalColor;
uniform sampler2D textureUnit;
varying vec4      vColor;
varying vec2      vTexCoord;
void main(){
    vec4 samplerColor = texture2D(textureUnit, vTexCoord);
    gl_FragColor = vColor * samplerColor * globalColor;
}
