import fragementShaderSource from "./shader.frag";
import vertexShaderSource from "./shader.vert";
import {vec3, vec4, mat4} from "gl-matrix";

var gl = null;

window.addEventListener("load", init);
function init() {
  const canvas = document.getElementById("canvas-main");

  gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
    return;
  }

  canvas.addEventListener("mousedown", mousedownListener);
  canvas.addEventListener("mouseup", mouseupListener);
  canvas.addEventListener("mousemove", mousemoveListener);
  window.addEventListener("keydown", keydownListener);
  window.addEventListener("keyup", keyupListener);

  document.getElementById("apply").addEventListener("click", parseModel);

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  initShaders();
  initBuffers();

  setInterval(drawScene, 15);
}

var aVertexPosition = null;
var uPMatrix = null;
var uMVMatrix = null;
function initShaders() {
  const shaderProgram = gl.createProgram();
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

var bufVertexPosition = null;
function initBuffers() {
  bufVertexPosition = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufVertexPosition);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,0,1,0,0,1,1,0,0,1,0]), gl.STATIC_DRAW);
}

var model = {};
function parseModel() {
  var raw = document.getElementById("model").value;
  raw = raw.replace(/#.*/g, "").trim().split(/\s*\n\s*/);
  var i = 0;
  if (raw[i++] === "BSPLINE") {
    model.type = 0;
  } else { // "CATMULL_ROM"
    model.type = 1;
  }
  model.n = parseInt(raw[i++]); // number of cross sections
  model.m = parseInt(raw[i++]); // number of control points per cross section
  model.c = []; // control points, c[i][j][k] = ith section, jth point, kth dimension
  model.s = []; // scale
  model.r = []; // rotation
  model.p = []; // position
  function parseLine(line) { return line.split(" ").map(parseFloat); }
  for (var j = 0; j < model.n; ++j) {
    var t = [];
    for (var k = 0; k < model.m; ++k) {
      t.push(parseLine(raw[i++]));
    }
    model.c.push(t);
    model.s.push(parseLine(raw[i++]));
    model.r.push(parseLine(raw[i++]));
    model.p.push(parseLine(raw[i++]));
  }
}

var isMouseDown = false;
const mouseStart = vec3.create(), mouseCur = vec3.create();
const pMatBase = mat4.create(), pMatCur = mat4.create();
function mousedownListener(e) {
  isMouseDown = true;
  getMouseCoord(mouseStart);
  getMouseCoord(mouseCur);
  mat4.copy(pMatBase, pMatCur);
}
function mouseupListener(e) {
  isMouseDown = false;
}
function mousemoveListener(e) {
  if (isMouseDown) {
    getMouseCoord(mouseCur);
    setpMatCur();
  }
}
function getMouseCoord(c) {
  const rect = gl.canvas.getBoundingClientRect();
  const a = gl.canvas.clientHeight / 2;
  var x = (event.clientX - rect.left - gl.canvas.clientWidth / 2) / a;
  var y = -(event.clientY - rect.top - gl.canvas.clientHeight / 2) / a;
  const r = Math.max(1, Math.sqrt(x * x + y * y));
  x /= r; y /= r;
  const z = Math.sqrt(1 - Math.min(1, x * x + y * y));
  vec3.set(c, x, y, z);
}
function setpMatCur() {
  const axis3 = vec3.create();
  vec3.cross(axis3, mouseStart, mouseCur);
  var angle = Math.atan(vec3.len(axis3) / vec3.dot(mouseStart, mouseCur));
  if (angle < 0) angle += Math.PI;
  const r = mat4.create();
  mat4.rotate(r, r, angle, axis3);
  mat4.mul(pMatCur, r, pMatBase);
}

const keystate = {};
function keydownListener(e) {
  if (!e.metaKey) {
    keystate[e.keyCode] = true;
  }
}
function keyupListener(e) {
  keystate[e.keyCode] = false;
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
var pRadius = 10, fovy = Math.PI / 4;
function animate() {
  const currentTime = Date.now();
  if (lastTime) {
    const delta = (currentTime - lastTime) / 1000;
    if (keystate[87]/*w*/) pTranslate([0, -2 * delta, 0]);
    if (keystate[83]/*s*/) pTranslate([0, 2 * delta, 0]);
    if (keystate[65]/*a*/) pTranslate([2 * delta, 0, 0]);
    if (keystate[68]/*d*/) pTranslate([-2 * delta, 0, 0]);
    if (keystate[82]/*r*/) pRadius -= 5 * delta;
    if (keystate[84]/*t*/) pRadius += 5 * delta;
    if (keystate[70]/*f*/) fovy -= Math.PI / 16 * delta;
    if (keystate[71]/*g*/) fovy += Math.PI / 16 * delta;
  }
  lastTime = currentTime;
}
function pTranslate(v) {
  const t = mat4.create();
  mat4.translate(t, t, v);
  mat4.mul(pMatCur, t, pMatCur);
}

function drawScene() {
  resize();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const pMat = mat4.create();
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  mat4.perspective(pMat, fovy, aspect, 0.1, 100.0);
  mat4.translate(pMat, pMat, [0, 0, -pRadius]);
  mat4.mul(pMat, pMat, pMatCur);
  gl.uniformMatrix4fv(uPMatrix, false, pMat);

  gl.uniformMatrix4fv(uMVMatrix, false, mvMat);
  gl.bindBuffer(gl.ARRAY_BUFFER, bufVertexPosition);
  gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.LINE_STRIP, 0, 4);

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
