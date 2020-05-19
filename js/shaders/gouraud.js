var vsSourceGouraud = `
attribute vec3 aVertexPosition;
attribute vec3 aFrontColor;
attribute vec3 aNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uWrldInverseTranspose;

uniform vec3 uPointLightWorldPosition;

varying vec3 vSurfaceToLight;
varying vec4 fragcolor;
varying vec3 vNormal;

uniform sampler2D uSampler;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    
    fragcolor = vec4(aFrontColor.rgb, 1.0);
    vNormal = mat3(uWrldInverseTranspose) * aNormal;

    vec3 surfaceWorldPosition = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;
    vSurfaceToLight = uPointLightWorldPosition - surfaceWorldPosition;
}
`;
var fsSourceGouraud = `
precision mediump float;

varying vec3 vSurfaceToLight;
varying vec4 fragcolor;
varying vec3 vNormal;

void main(void) {
    vec3 normal = normalize(vNormal);
    vec3 surfaceToLightDirection = normalize(vSurfaceToLight);

    float light = dot(normal, surfaceToLightDirection);

    gl_FragColor = fragcolor;
    
}
`;