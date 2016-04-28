attribute highp vec3 aVertexPosition;

uniform highp mat4 uMVMatrix;
uniform highp mat4 uPMatrix;

void main() {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
