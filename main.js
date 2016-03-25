import fragementShaderSource from "./shader.frag";
import vertexShaderSource from "./shader.vert";
import {mat4} from "gl-matrix";

var gl = null;
var shaderProgram = null;
var aVertexPosition = null;
var aVertexColor = null;
var uPMatrix = null;
var uMVMatrix = null;
var bufSquarePosition = null;
var bufSquareColor = null;

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

  setInterval(drawScene, 15);
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
  aVertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(aVertexColor);
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
  bufSquarePosition = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufSquarePosition);
  const positions = [
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  bufSquareColor = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufSquareColor);
  const colors = [
    1.0, 1.0, 1.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
}

function resize() {
  const realToCSSPixels = window.devicePixelRatio || 1;
  const width = Math.floor(gl.canvas.clientWidth * realToCSSPixels);
  const height = Math.floor(gl.canvas.clientHeight * realToCSSPixels);
  if (gl.canvas.width !== width || gl.canvas.height !== height) {
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

function pp(f) {
  pushMatrix();
  f();
  popMatrix();
}

var lastTime = null;
var angle = 0.0;
function animate() {
  const currentTime = Date.now();
  if (lastTime) {
    const delta = currentTime - lastTime;
    angle += Math.PI * delta / 1000;
    if (angle > Math.PI * 2) {
      angle -= Math.PI * 2;
    }
  }
  lastTime = currentTime;
}

function drawScene() {
  resize();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const pMat = mat4.create();
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  mat4.perspective(pMat, 45, aspect, 0.1, 100.0);
  gl.uniformMatrix4fv(uPMatrix, false, pMat);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufSquarePosition);
  gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, bufSquareColor);
  gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);

  pp(() => {
    translate([0.0, 0.0, -6.0]);
    for (var i = -2; i <= 2; i += 2) {
      for (var j = -2; j <= 2; j += 2) {
        pp(() => {
          translate([i, j, 0.0]);
          rotate(angle, [i, j, 0,0]);
          gl.uniformMatrix4fv(uMVMatrix, false, mvMat);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        });
      }
    }
  });

  animate();
}

var mvMat = mat4.create();
const mvStack = [];
function pushMatrix() {
  mvStack.push(mat4.clone(mvMat));
}
function popMatrix() {
  mvMat = mvStack.pop();
}
function translate(v) {
  mat4.translate(mvMat, mvMat, v);
}
function rotate(rad, axis) {
  mat4.rotate(mvMat, mvMat, rad, axis);
}
