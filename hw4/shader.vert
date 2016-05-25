attribute highp vec3 aVertexPosition;
attribute highp vec4 aVertexColor;
attribute highp vec3 aVertexNormal;

uniform highp mat4 uMVMatrix;
uniform highp mat4 uPMatrix;
uniform highp mat4 uNMatrix;

varying highp vec4 vColor;
varying highp vec3 vLighting;

void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vColor = aVertexColor;

  highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);
  highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);
  highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);

  highp vec4 transformedNormal = uNMatrix * vec4(aVertexNormal, 1.0);

  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
}
