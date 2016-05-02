import fragementShaderSource from "./shader.frag";
import vertexShaderSource from "./shader.vert";
import {vec3, mat4, quat} from "gl-matrix";

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
var aVertexColor = null;
var aVertexNormal = null;
var uPMatrix = null;
var uMVMatrix = null;
var uNMatrix = null;
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

const model = {
  n: 0, m: 0,
  bufVertexPosition: null,
  bufVertexColor: null,
  bufVertexNormal: null,
  bufIndex: null
};
function initBuffers() {
  model.bufVertexPosition = gl.createBuffer();
  model.bufVertexColor = gl.createBuffer();
  model.bufVertexNormal = gl.createBuffer();
  model.bufIndex = gl.createBuffer();
}

function parseModel() {
  var raw = document.getElementById("model").value, i, j, k, t;
  var type, n, m, c, s, r, p
  raw = raw.replace(/#.*/g, "").trim().split(/\s*\n\s*/);
  i = 0;
  if (raw[i++] === "BSPLINE") {
    type = 0;
  } else { // "CATMULL_ROM"
    type = 1;
  }
  n = parseInt(raw[i++]); // number of cross sections
  m = parseInt(raw[i++]); // number of control points per cross section
  c = []; // control points, c[i][j][k] = ith section, jth point, kth dimension
  s = []; // scale
  r = []; // rotation
  p = []; // position
  function parseLine(line) { return line.split(" ").map(parseFloat); }
  for (j = 0; j < n; ++j) {
    t = [];
    for (k = 0; k < m; ++k) {
      t.push(parseLine(raw[i++]));
    }
    c.push(t);
    s.push(parseLine(raw[i++]));
    r.push(parseLine(raw[i++]));
    p.push(parseLine(raw[i++]));
  }

  // get position of point at v [0,1) of u ~ u+3 th cross section
  var getPointsOnCrossSection;
  if (type == 0) {
    getPointsOnCrossSection = function(u, v) {
      v *= m;
      const b = Math.floor(v), o = v - b, o2 = o * o, o3 = o2 * o,
            c0 = (1 - 3 * o + 3 * o2 -     o3) / 6,
            c1 = (4         - 6 * o2 + 3 * o3) / 6,
            c2 = (1 + 3 * o + 3 * o2 - 3 * o3) / 6,
            c3 = (                         o3) / 6,
            xs = [], zs = [];
      for (var ui = u; ui < u + 4; ++ui) {
        const p = c[ui], p0 = p[b], p1 = p[(b + 1) % m],
              p2 = p[(b + 2) % m], p3 = p[(b + 3) % m];
        xs.push(c0 * p0[0] + c1 * p1[0] + c2 * p2[0] + c3 * p3[0]);
        zs.push(c0 * p0[1] + c1 * p1[1] + c2 * p2[1] + c3 * p3[1]);
      }
      return [xs, zs];
    }
  } else {
    getPointsOnCrossSection = function(u, v) {
      v *= m;
      const b = Math.floor(v), o = v - b, oi = 1 - o,
            c0 = oi * oi * oi, c1 = 3 * o * oi * oi,
            c2 = 3 * o * o * oi, c3 = o * o * o,
            xs = [], zs = [];
      for (var ui = u; ui < u + 4; ++ui) {
        const p = c[ui], p0 = p[b], p1 = p[(b + 1) % m],
              p2 = p[(b + 2) % m], p3 = p[(b + 3) % m];
        xs.push(c0 * p1[0] + c1 * (p1[0] + (p2[0] - p0[0]) / 6)
                + c2 * (p2[0] + (p1[0] - p3[0]) / 6) + c3 * p2[0]);
        zs.push(c0 * p1[1] + c1 * (p1[1] + (p2[1] - p0[1]) / 6)
                + c2 * (p2[1] + (p1[1] - p3[1]) / 6) + c3 * p2[1]);
      }
      return [xs, zs];
    }
  }

  // get position of point at (u, v) (both [0, 1)) on surface
  function getPointOnSurface(u, v) {
    u *= n - 3;
    const ub = Math.floor(u), uo = u - ub,
          a = getPointsOnCrossSection(ub, v);
    // a will contain x z s px py pz
    a.push([]); a.push([]); a.push([]); a.push([]);
    for (var ui = ub; ui < ub + 4; ++ui) {
      a[2].push(s[ui][0]);
      a[3].push(p[ui][0]);
      a[4].push(p[ui][1]);
      a[5].push(p[ui][2]);
    }
    const uoi = 1 - uo,
          c0 = uoi * uoi * uoi, c1 = 3 * uo * uoi * uoi,
          c2 = 3 * uo * uo * uoi, c3 = uo * uo * uo;
    const b = a.map(function(p) {
      const p0 = p[1], p1 = p[1] + (p[2] - p[0]) / 6,
            p2 = p[2] + (p[1] - p[3]) / 6, p3 = p[2];
      return c0 * p0 + c1 * p1 + c2 * p2 + c3 * p3;
    });

    const qs = [];
    for (var ui = ub; ui < ub + 4; ++ui) {
      const q = quat.create();
      quat.setAxisAngle(q, vec3.fromValues(r[ui][1], r[ui][2], r[ui][3]), r[ui][0]);
      qs.push(q);
    }

    function quatCM(x, y, z) {
      const dq = quat.create();
      quat.invert(dq, qs[x]);
      quat.mul(dq, dq, qs[z]);
      const axis = vec3.create();
      const angle = quat.getAxisAngle(axis, dq);
      quat.setAxisAngle(dq, axis, angle / 6);
      quat.mul(dq, qs[y], dq);
      return dq;
    }

    const qs1 = quatCM(0, 1, 2);
    const qs2 = quatCM(3, 2, 1);
    qs[0] = qs[1]; qs[1] = qs1;
    qs[3] = qs[2]; qs[2] = qs2;
    for (var i = 0; i < 3; ++i) {
      for (var j = 0; j < 3 - i; ++j) {
        quat.slerp(qs[j], qs[j], qs[j + 1], uo);
      }
    }

    const ret = vec3.fromValues(b[0] * b[2], 0, b[1] * b[2]);
    vec3.transformQuat(ret, ret, qs[0]);
    vec3.add(ret, ret, vec3.fromValues(b[3], b[4], b[5]));
    return ret;
  }

  const density = parseInt(document.getElementById("density").value);
  const ci = (n - 3) * density, cj = m * density;

  const vertices = [];
  var radius = 10;
  for (var i = 0; i < ci; ++i) {
    var t = [];
    for (var j = 0; j < cj; ++j) {
      const v = getPointOnSurface(i / ci, j / cj);
      radius = Math.max(radius, vec3.len(v));
      t.push(v);
    }
    vertices.push(t);
  }

  var arrVertexPosition = [];
  var arrVertexColor = [];
  var arrVertexNormal = [];
  var arrIndex = [];
  function pushVec3(arr, v) {
    for (var k = 0; k < 3; ++k) {
      arr.push(v[k]);
    }
  }
  const t0 = vec3.create(), t1 = vec3.create();
  var idx = 0;
  for (var i = 1; i < ci; ++i) {
    for (var j = 0; j < cj; ++j) {
      const x0 = i - 1, x1 = i, y0 = j, y1 = (j + 1) % cj;
      pushVec3(arrVertexPosition, vertices[x0][y0]);
      pushVec3(arrVertexPosition, vertices[x0][y1]);
      pushVec3(arrVertexPosition, vertices[x1][y0]);
      pushVec3(arrVertexPosition, vertices[x1][y1]);
      for (var k = 0; k < 4; ++k) {
        pushVec3(arrVertexColor, vec3.fromValues(i / ci, j / cj, 0.5));
      }
      vec3.sub(t0, vertices[x0][y1], vertices[x0][y0]);
      vec3.sub(t1, vertices[x1][y0], vertices[x0][y0]);
      vec3.cross(t0, t0, t1);
      vec3.normalize(t0, t0);
      for (var k = 0; k < 4; ++k) {
        pushVec3(arrVertexNormal, t0);
      }
      arrIndex.push(idx + 0);
      arrIndex.push(idx + 1);
      arrIndex.push(idx + 2);
      arrIndex.push(idx + 1);
      arrIndex.push(idx + 2);
      arrIndex.push(idx + 3);
      idx += 4;
    }
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, model.bufVertexPosition);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVertexPosition), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, model.bufVertexColor);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVertexColor), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, model.bufVertexNormal);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVertexNormal), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.bufIndex);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrIndex), gl.STATIC_DRAW);
  model.n = ci - 1; model.m = cj;
  model.radius = radius;
  pRadius = radius * 2;
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
    if (keystate[87]/*w*/) pTranslate([0, -model.radius / 1 * delta, 0]);
    if (keystate[83]/*s*/) pTranslate([0, model.radius / 1 * delta, 0]);
    if (keystate[65]/*a*/) pTranslate([model.radius / 1 * delta, 0, 0]);
    if (keystate[68]/*d*/) pTranslate([-model.radius / 1 * delta, 0, 0]);
    if (keystate[82]/*r*/) pRadius -= model.radius / 1 * delta;
    if (keystate[84]/*t*/) pRadius += model.radius / 1 * delta;
    if (keystate[70]/*f*/) fovy -= Math.PI / 8 * delta;
    if (keystate[71]/*g*/) fovy += Math.PI / 8 * delta;
  }
  lastTime = currentTime;
}
function pTranslate(v) {
  const t = mat4.create();
  mat4.translate(t, t, v);
  mat4.mul(pMatCur, t, pMatCur);
}

function setUniforms() {
  gl.uniformMatrix4fv(uMVMatrix, false, mvMat);
  const nMat = mat4.create();
  mat4.invert(nMat, mvMat);
  mat4.transpose(nMat, nMat);
  gl.uniformMatrix4fv(uNMatrix, false, nMat);
}

function drawScene() {
  resize();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const pMat = mat4.create();
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  mat4.perspective(pMat, fovy, aspect, 0.1, 1000.0);
  mat4.translate(pMat, pMat, [0, 0, -pRadius]);
  mat4.mul(pMat, pMat, pMatCur);
  gl.uniformMatrix4fv(uPMatrix, false, pMat);

  gl.bindBuffer(gl.ARRAY_BUFFER, model.bufVertexPosition);
  gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, model.bufVertexColor);
  gl.vertexAttribPointer(aVertexColor, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, model.bufVertexNormal);
  gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 0, 0);
  const n = model.n * model.m * 6;
  if (n > 0) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.bufIndex);
    setUniforms();
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
  }

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
