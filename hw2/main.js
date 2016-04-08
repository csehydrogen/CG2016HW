import fragementShaderSource from "./shader.frag";
import vertexShaderSource from "./shader.vert";
import {vec3, vec4, mat4} from "gl-matrix";
import * as modelData from "./modelData.js";

var gl = null;
var shaderProgram = null;
var canvas = null;

window.addEventListener("load", start);
function start() {
  canvas = document.getElementById("canvas-main");
  canvas.addEventListener('mousedown', mousedownListener);
  canvas.addEventListener('mouseup', mouseupListener);
  canvas.addEventListener('mousemove', mousemoveListener);

  initWebGL();
  if (!gl) {
    return;
  }

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  initShaders();
  initBuffers();

  setInterval(drawScene, 15);
}

function initWebGL() {
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
  modelTurret = getModel(modelData.turret, getConstantColor(modelData.turret.n, 1, 0.4, 0.7, 1));
  modelGun = getModel(modelData.gun, getConstantColor(modelData.gun.n, 1, 0, 0, 1));
  const wheelColor = [];
  for (var i = 0; i < modelData.wheel.n; ++i) {
    for (var j = 0; j < 3; ++j) {
      wheelColor.push(1);
      wheelColor.push(i / 64);
      wheelColor.push(i / 64);
      wheelColor.push(1);
      wheelColor.push(i / 64);
      wheelColor.push(1);
      wheelColor.push(i / 64);
      wheelColor.push(1);
      wheelColor.push(i / 64);
      wheelColor.push(i / 64);
      wheelColor.push(1);
      wheelColor.push(1);
    }
  }
  modelWheel = getModel(modelData.wheel, wheelColor);
  modelTrack = getModel(modelData.track, getConstantColor(modelData.track.n, 0.25, 0.25, 0.25, 1));
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

function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
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
  const rect = canvas.getBoundingClientRect();
  const a = canvas.clientHeight / 2;
  var x = (event.clientX - rect.left - canvas.clientWidth / 2) / a;
  var y = -(event.clientY - rect.top - canvas.clientHeight / 2) / a;
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
  console.log(vec3.str(mouseStart) + " " + vec3.str(mouseCur));
  console.log(vec3.str(axis3) + " " + angle);
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

var lastTime = null;
var pPos = 10, wOfs = 0;
var tAngle = 0, gAngle = 0, auto = false;
const wRadius = 0.2;
function pTranslate(v) {
    const t = mat4.create();
    mat4.translate(t, t, v);
    mat4.mul(pMatCur, t, pMatCur);
}
function animate() {
  const currentTime = Date.now();
  if (lastTime) {
    const delta = (currentTime - lastTime) / 1000;
    if (keystate[84]/*t*/) pTranslate([0, -2 * delta, 0]);
    if (keystate[71]/*g*/) pTranslate([0, 2 * delta, 0]);
    if (keystate[70]/*f*/) pTranslate([2 * delta, 0, 0]);
    if (keystate[72]/*h*/) pTranslate([-2 * delta, 0, 0]);
    if (keystate[82]/*r*/) pPos -= 5 * delta;
    if (keystate[89]/*y*/) pPos += 5 * delta;
    if (keystate[65]/*a*/) tAngle += Math.PI / 2 * delta;
    if (keystate[68]/*d*/) tAngle -= Math.PI / 2 * delta;
    if (keystate[83]/*s*/) gAngle += Math.PI / 9 * delta;
    if (keystate[87]/*w*/) gAngle -= Math.PI / 9 * delta;
    if (keystate[90]/*z*/) auto = true;
    if (keystate[88]/*x*/) auto = false;
    if (keystate[67]/*c*/) wOfs += 0.5 * delta;
    if (auto) {
      const amp = Math.PI / 18, w = Math.PI * 2;
      tAngle += amp * w * Math.cos(w * currentTime / 1000) * delta;
      gAngle += amp * w * Math.sin(w * currentTime / 1000) * delta;
      wOfs += 0.5 * delta;
    }
    if (gAngle > Math.PI / 18) gAngle = Math.PI / 18;
    if (gAngle < -Math.PI / 9) gAngle = -Math.PI / 9;
  }
  lastTime = currentTime;
}

function drawScene() {
  resize();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const pMat = mat4.create();
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  mat4.perspective(pMat, 45, aspect, 0.1, 100.0);
  mat4.translate(pMat, pMat, [0, 0, -pPos]);
  mat4.mul(pMat, pMat, pMatCur);
  gl.uniformMatrix4fv(uPMatrix, false, pMat);

  function drawTank() {
    setModel(modelHull);
    setUniforms();
    drawModel(modelHull);

    pushMatrix();
    translate([0, 0.2, 0.3]);
    rotate(tAngle, [0, 1, 0]);
    setModel(modelTurret);
    setUniforms();
    drawModel(modelTurret);
    translate([0, 0.15, 0.5]);
    rotate(gAngle, [1, 0, 0]);
    setModel(modelGun);
    setUniforms();
    drawModel(modelGun);
    popMatrix();

    pushMatrix();
    translate([-0.6, -0.25, -0.9]);
    setModel(modelWheel);
    for (var i = 0; i < 2; ++i) {
      for (var j = 0; j < 6; ++j) {
        pushMatrix();
        rotate(wOfs / 0.4 * 2.0 / wRadius, [1, 0, 0]);
        setUniforms();
        drawModel(modelWheel);
        popMatrix();
        translate([0, 0, 0.4]);
      }
      translate([1.2, 0, -2.4]);
    }
    popMatrix();

    pushMatrix();
    translate([-0.6, 0, 0]);
    setModel(modelTrack);
    for (var i = 0; i < 2; ++i) {
      for (var j = 0; j < 34; ++j) {
        var ofs = (wOfs + j / 34) % 1;
        pushMatrix();
        if (ofs <= 0.4) {
          translate([0, -0.25 + wRadius, -0.9 + ofs / 0.4 * 2.0]);
        } else if (ofs <= 0.5) {
          const rad = Math.PI * (ofs - 0.4) / 0.1;
          translate([
            0,
            -0.25 + wRadius * Math.cos(rad),
            1.1 + wRadius * Math.sin(rad)
          ]);
          rotate(rad, [1, 0, 0]);
        } else if (ofs <= 0.9) {
          translate([0, -0.25 - wRadius, 1.1 - (ofs - 0.5) / 0.4 * 2.0]);
        } else {
          const rad = Math.PI * (ofs - 0.9) / 0.1;
          translate([
            0,
            -0.25 - wRadius * Math.cos(rad),
            -0.9 - wRadius * Math.sin(rad)
          ]);
          rotate(rad, [1, 0, 0]);
        }
        setUniforms();
        drawModel(modelTrack);
        popMatrix();
      }
      translate([1.2, 0, 0]);
    }
    popMatrix();
  }

  pushMatrix();
  for (var i = 0; i < 4; ++i) {
    rotate(Math.PI / 2, [0, 1, 0]);
    pushMatrix();
    translate([3, 0, 0]);
    drawTank();
    popMatrix();
  }
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
