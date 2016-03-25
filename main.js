import fragementShaderSource from "./shader.frag";
import vertexShaderSource from "./shader.vert";
import {mat4} from "gl-matrix";

var gl = null;
var shaderProgram = null;
var aVertexPosition = null;
var uPMatrix = null;
var uMVMatrix = null;
var bufSquareVertices = null;

window.addEventListener("load", start);

function start() {
  initWebGL(document.getElementById("canvas-main"));
  if (!gl) {
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  initShaders();
  initBuffers();

  setInterval(drawScene, 15, gl);
}

function initWebGL(canvas) {
  try {
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  } catch (e) {
  }
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
}

function initShaders() {
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, getShader(fragementShaderSource, gl.FRAGMENT_SHADER));
  gl.attachShader(shaderProgram, getShader(vertexShaderSource, gl.VERTEX_SHADER));
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
    return;
  }
  gl.useProgram(shaderProgram);

  aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(aVertexPosition);
  uPMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix")
  uMVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix")
}

function getShader(source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

function initBuffers() {
  bufSquareVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufSquareVertices);

  var vertices = [
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function resize(gl) {
  var realToCSSPixels = window.devicePixelRatio || 1;
  var width = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
  var height = Math.floor(gl.canvas.clientHeight * realToCSSPixels);
  if (gl.canvas.width !== width || gl.canvas.height !== height) {
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

function drawScene(gl) {
  resize(gl);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const pMat = mat4.create();
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  mat4.perspective(pMat, 45, aspect, 0.1, 100.0);
  gl.uniformMatrix4fv(uPMatrix, false, pMat);

  const mvMat = mat4.create();

  mat4.translate(mvMat, mvMat, [2.0, 0.0, -6.0]);
  gl.uniformMatrix4fv(uMVMatrix, false, mvMat);
  gl.bindBuffer(gl.ARRAY_BUFFER, bufSquareVertices);
  gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  mat4.translate(mvMat, mvMat, [-4.0, 0.0, 0.0]);
  gl.uniformMatrix4fv(uMVMatrix, false, mvMat);
  gl.bindBuffer(gl.ARRAY_BUFFER, bufSquareVertices);
  gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
