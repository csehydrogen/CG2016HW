import fragementShaderSource from "./shader.frag";
import vertexShaderSource from "./shader.vert";
import {mat4} from "gl-matrix";
import * as modelData from "./modelData.js";

var gl = null;
var shaderProgram = null;

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

var aVertexPosition = null;
var aVertexColor = null;
var aVertexNormal = null;
var uPMatrix = null;
var uMVMatrix = null;
var uNMatrix = null;
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
  aVertexNormal = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(aVertexNormal);
  uPMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix")
  uMVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix")
  uNMatrix = gl.getUniformLocation(shaderProgram, "uNMatrix")
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

function getModel(modelData, color) {
  const n = modelData.n;
  const positionData = modelData.position;
  const normalData = modelData.normal;
  const index = modelData.index;
  const model = {n : n};
  const position = [];
  const normal = []

  for (var i = 0; i < n; ++i) {
    for (var j = 0; j < 3; ++j) {
      for (var k = 0; k < 3; ++k) {
        position.push(positionData[index[i * 6 + j * 2] * 3 + (k + 1) % 3]);
      }
      for (var k = 0; k < 3; ++k) {
        normal.push(normalData[index[i * 6 + j * 2 + 1] * 3 + (k + 1) % 3]);
      }
    }
  }

  model.position = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, model.position);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

  model.normal = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, model.normal);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);

  model.color = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, model.color);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

  return model;
}

function getConstantColor(n, r, g, b, a) {
  const color = [];
  for (var i = 0; i < n; ++i) {
    for (var j = 0; j < 3; ++j) {
      color.push(r);
      color.push(g);
      color.push(b);
      color.push(a);
    }
  }
  return color;
}

var modelHull = null;
var modelTurret = null;
var modelGun = null;
var modelWheel = null;
var modelTrack = null;
function initBuffers() {
  modelHull = getModel(modelData.hull, getConstantColor(modelData.hull.n, 0.5, 0.7, 0.7, 1));
  modelTurret = getModel(modelData.turret, getConstantColor(modelData.turret.n, 0.7, 0.5, 0.7, 1));
  modelGun = getModel(modelData.gun, getConstantColor(modelData.gun.n, 0.7, 0.7, 0.5, 1));
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

function setUniforms() {
  gl.uniformMatrix4fv(uMVMatrix, false, mvMat);
  var nMat = mat4.create();
  mat4.invert(nMat, mvMat);
  mat4.transpose(nMat, nMat);
  gl.uniformMatrix4fv(uNMatrix, false, nMat);
}

function setModel(model) {
  gl.bindBuffer(gl.ARRAY_BUFFER, model.position);
  gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, model.color);
  gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, model.normal);
  gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 0, 0);
}

function drawModel(model) {
  gl.drawArrays(gl.TRIANGLES, 0, model.n * 3);
}

const keystate = {};
window.addEventListener('keydown', keydownListener);
function keydownListener(e) {
  keystate[e.keyCode] = true;
  console.log(e.keyCode);
}
window.addEventListener('keyup', keyupListener);
function keyupListener(e) {
  keystate[e.keyCode] = false;
  console.log(e.keyCode);
}

var pXangle = 0, pYangle = 0, pXpos = 0, pYpos = 0;
function handleInput() {
  if (keystate[68]) pXpos -= 1 / 60;
  if (keystate[65]) pXpos += 1 / 60;
  if (keystate[87]) pYpos -= 1 / 60;
  if (keystate[83]) pYpos += 1 / 60;
  if (keystate[84]) pXangle -= Math.PI / 2 / 60;
  if (keystate[71]) pXangle += Math.PI / 2 / 60;
  if (keystate[70]) pYangle -= Math.PI / 2 / 60;
  if (keystate[72]) pYangle += Math.PI / 2 / 60;
}

function drawScene() {
  resize();
  handleInput();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const pMat = mat4.create();
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  mat4.perspective(pMat, 45, aspect, 0.1, 100.0);
  mat4.translate(pMat, pMat, [pXpos, pYpos, 0]);
  mat4.rotate(pMat, pMat, pXangle, [1, 0, 0]);
  mat4.rotate(pMat, pMat, pYangle, [0, 1, 0]);
  gl.uniformMatrix4fv(uPMatrix, false, pMat);

  pushMatrix();
  translate([0.0, 0.0, -5.0]);
    pushMatrix();
    setUniforms();
    setModel(modelHull);
    drawModel(modelHull);
    popMatrix();

    translate([0, 0.2, 0.2]);
    setUniforms();
    setModel(modelTurret);
    drawModel(modelTurret);

    translate([0, 0.15, 0.6]);
    setUniforms();
    setModel(modelGun);
    drawModel(modelGun);
  popMatrix();

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
