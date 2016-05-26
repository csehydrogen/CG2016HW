attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;
attribute vec4 aVertexPhong;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec3 vPosition;
varying vec4 vColor;
varying vec3 vNormal;
varying vec4 vPhong;

void main() {
  vPosition = (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;
  vColor = aVertexColor;
  vNormal = (uNMatrix * vec4(aVertexNormal, 0.0)).xyz;
  vPhong = aVertexPhong;

  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
