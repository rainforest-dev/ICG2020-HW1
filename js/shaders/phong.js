const vsSourcePhong = `
attribute vec3 aVertexPosition;
attribute vec3 aFrontColor;
attribute vec3 aNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uWrldInverseTranspose;

uniform vec3 uViewWorldPosition;
uniform vec3 uPointLightWorldPosition;

varying vec3 vSurfaceToLight;
varying vec3 vSurfaceToView;

varying vec3 vSurfaceToLight2;
varying vec3 vSurfaceToLight3;

varying vec4 fragcolor;
varying vec3 vNormal;

uniform sampler2D uSampler;

void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    
    fragcolor = vec4(aFrontColor.rgb, 1.0);
    vNormal = mat3(uWrldInverseTranspose) * aNormal;

    vec3 surfaceWorldPosition = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;
    
    vSurfaceToLight = uPointLightWorldPosition - surfaceWorldPosition;
    vSurfaceToLight2 = uPointLightWorldPosition - surfaceWorldPosition + vec3(20, 0, 0);
    vSurfaceToLight3 = uPointLightWorldPosition - surfaceWorldPosition + vec3(10, -20, 0);
    vSurfaceToView = uViewWorldPosition - surfaceWorldPosition;
}
`;
const fsSourcePhong = `
precision mediump float;

varying vec3 vSurfaceToLight;
varying vec3 vSurfaceToView;
varying vec4 fragcolor;
varying vec3 vNormal;

varying vec3 vSurfaceToLight2;
varying vec3 vSurfaceToLight3;

uniform float uShininess;

void main(void) {
    vec3 normal = normalize(vNormal);

    vec3 surfaceToLightDirection = normalize(vSurfaceToLight);
    vec3 surfaceToViewDirection = normalize(vSurfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    float light = dot(normal, surfaceToLightDirection);
    float specular = 0.0;
    if (light > 0.0) {
        specular = pow(dot(normal, halfVector), uShininess);
    }

    vec3 surfaceToLightDirection2 = normalize(vSurfaceToLight2);
    vec3 surfaceToViewDirection2 = normalize(vSurfaceToView);
    vec3 halfVector2 = normalize(surfaceToLightDirection2 + surfaceToViewDirection2);

    float light2 = dot(normal, surfaceToLightDirection2);
    float specular2 = 0.0;
    if (light2 > 0.0) {
        specular2 = pow(dot(normal, halfVector2), uShininess);
    }

    vec3 surfaceToLightDirection3 = normalize(vSurfaceToLight3);
    vec3 surfaceToViewDirection3 = normalize(vSurfaceToView);
    vec3 halfVector3 = normalize(surfaceToLightDirection3 + surfaceToViewDirection3);

    float light3 = dot(normal, surfaceToLightDirection3);
    float specular3 = 0.0;
    if (light3 > 0.0) {
        specular3 = pow(dot(normal, halfVector3), uShininess);
    }

    gl_FragColor = fragcolor;

    gl_FragColor.rgb *= light;
    gl_FragColor.rgb += specular;

    gl_FragColor.rgb *= light2;
    gl_FragColor.rgb += specular2;

    gl_FragColor.rgb *= light3;
    gl_FragColor.rgb += specular3;
}
`;