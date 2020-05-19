const vsSourceFlat = `
attribute vec3 aVertexPosition;
attribute vec3 aFrontColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 fragcolor;
uniform sampler2D uSampler;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    fragcolor = vec4(aFrontColor.rgb, 1.0);;
}
`;
const fsSourceFlat = `
precision mediump float;
varying vec4 fragcolor;
void main(void) {
    gl_FragColor = fragcolor;
}
`;