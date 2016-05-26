import {vec3, vec4} from "gl-matrix";

var eps = 1e-2;

// p: vec3 array of len 3, points
// n: vec3 array of len 3, normals
// c: vec4 array of len 3, color
// k: vec4 array of len 3, shading parameters
// ax+b represent plane including triangle
var Triangle = function (p, n, c, k) {
  var i, t;
  this.p = p;
  this.n = n;
  this.c = c;
  this.k = k;
  this.a = vec3.create();
  t = vec3.create();
  vec3.sub(this.a, p[1], p[0]);
  vec3.sub(t, p[2], p[0]);
  vec3.cross(this.a, this.a, t);
  vec3.normalize(this.a, this.a);
  this.b = -vec3.dot(this.a, this.p[0]);
};

Triangle.prototype.area = function () {
  var a = vec3.create(), b = vec3.create();
  vec3.sub(a, this.p[1], this.p[0]);
  vec3.sub(b, this.p[2], this.p[0]);
  vec3.cross(a, a, b);
  return vec3.len(a) / 2;
};

// return ax+b for given vec3 x
Triangle.prototype.plane = function (x) {
  return vec3.dot(this.a, x) + this.b;
};

// this as plane, return weight of intersection point in line p0 - p1
Triangle.prototype.intersect = function (p0, p1) {
  var dp = vec3.create();
  return -(vec3.dot(this.a, p0) + this.b) / (vec3.dot(vec3.sub(dp, p1, p0), this.a));
};

// given triangle that as plane, divide this into triangles, and push to l, m, and r
Triangle.prototype.divide = function (that, l, m, r) {
  var s, cNeg, cZero, cPos, i, t;
  var p, n, c, k, ofs, ts;

  s = [];
  cNeg = cZero = cPos = 0;
  for (i = 0; i < 3; ++i) {
    t = that.plane(this.p[i]);
    if (t < -eps) {
      s.push(-1);
      ++cNeg;
    } else if (t > eps) {
      s.push(1);
      ++cPos;
    } else {
      s.push(0)
      ++cZero;
    }
  }

  if (cZero == 3) {
    m.push(this);
  } else if (cPos == 0) {
    l.push(this);
  } else if (cNeg == 0) {
    r.push(this);
  } else if (cZero == 1) {
    for (i = 0; i < 3; ++i) {
      if (s[i] == 0) {
        ofs = i;
        break;
      }
    }
    p = []; n = []; c = []; k = [];
    for (i = 0; i < 3; ++i) {
      p.push(this.p[(ofs + i) % 3]);
      n.push(this.n[(ofs + i) % 3]);
      c.push(this.c[(ofs + i) % 3]);
      k.push(this.k[(ofs + i) % 3]);
    }
    t = that.intersect(p[1], p[2]);
    p.push(vec3.create());
    vec3.lerp(p[3], p[1], p[2], t);
    n.push(vec3.create());
    vec3.lerp(n[3], n[1], n[2], t);
    vec3.normalize(n[3], n[3]);
    c.push(vec4.create());
    vec4.lerp(c[3], c[1], c[2], t);
    k.push(vec4.create());
    vec4.lerp(k[3], k[1], k[2], t);
    ts = [];
    ts.push(new Triangle([p[0], p[1], p[3]], [n[0], n[1], n[3]], [c[0], c[1], c[3]], [k[0], k[1], k[3]]));
    ts.push(new Triangle([p[0], p[3], p[2]], [n[0], n[3], n[2]], [c[0], c[3], c[2]], [k[0], k[3], k[2]]));
    if (s[(ofs + 1) % 3] < 0) {
      l.push(ts[0]);
      r.push(ts[1]);
    } else {
      r.push(ts[0]);
      l.push(ts[1]);
    }
  } else {
    for (i = 0; i < 3; ++i) {
      if (s[(i + 1) % 3] * s[(i + 2) % 3] > 0) {
        ofs = i;
        break;
      }
    }
    p = []; n = []; c = []; k = [];
    for (i = 0; i < 3; ++i) {
      p.push(this.p[(ofs + i) % 3]);
      n.push(this.n[(ofs + i) % 3]);
      c.push(this.c[(ofs + i) % 3]);
      k.push(this.k[(ofs + i) % 3]);
    }
    t = that.intersect(p[0], p[1]);
    p.push(vec3.create());
    vec3.lerp(p[3], p[0], p[1], t);
    n.push(vec3.create());
    vec3.lerp(n[3], n[0], n[1], t);
    vec3.normalize(n[3], n[3]);
    c.push(vec4.create());
    vec4.lerp(c[3], c[0], c[1], t);
    k.push(vec4.create());
    vec4.lerp(k[3], k[0], k[1], t);
    t = that.intersect(p[0], p[2]);
    p.push(vec3.create());
    vec3.lerp(p[4], p[0], p[2], t);
    n.push(vec3.create());
    vec3.lerp(n[4], n[0], n[2], t);
    vec3.normalize(n[4], n[4]);
    c.push(vec4.create());
    vec4.lerp(c[4], c[0], c[2], t);
    k.push(vec4.create());
    vec4.lerp(k[4], k[0], k[2], t);
    ts = [];
    ts.push(new Triangle([p[0], p[3], p[4]], [n[0], n[3], n[4]], [c[0], c[3], c[4]], [k[0], k[3], k[4]]));
    ts.push(new Triangle([p[1], p[2], p[3]], [n[1], n[2], n[3]], [c[1], c[2], c[3]], [k[1], k[2], k[3]]));
    ts.push(new Triangle([p[2], p[4], p[3]], [n[2], n[4], n[3]], [c[2], c[4], c[3]], [k[2], k[4], k[3]]));
    if (s[ofs] < 0) {
      l.push(ts[0]);
      r.push(ts[1]);
      r.push(ts[2]);
    } else {
      r.push(ts[0]);
      l.push(ts[1]);
      l.push(ts[2]);
    }
  }
};

var BSPTree = function (ts) {
  var i, j, l, m, r, n, ts0, area, maxArea;

  ts0 = [];
  maxArea = Number.MIN_VALUE;
  for (j = 0; j < ts.length; ++j) {
    if (vec3.len(ts[j].a) < eps) continue;
    area = ts[j].area();
    if (maxArea < area) {
      maxArea = area;
      i = ts0.length;
    }
    ts0.push(ts[j]);
  }
  ts = ts0;

  l = []; m = [ts[i]]; r = [];
  for (j = 0; j < ts.length; ++j) {
    if (i == j) continue;
    ts[j].divide(ts[i], l, m, r);
  }
  this.m = m;
  this.l = this.r = null;
  if (l.length > 0) {
    this.l = new BSPTree(l);
  }
  if (r.length > 0) {
    this.r = new BSPTree(r);
  }
};

BSPTree.prototype.depthOrder = function (v) {
  var ts = [];
  this.traversal(v, ts);
  return ts;
};

BSPTree.prototype.traversal = function (v, ts) {
  var l, r;
  if (this.m[0].plane(v) > 0) {
    l = this.l;
    r = this.r;
  } else {
    l = this.r;
    r = this.l;
  }
  if (l != null) {
    l.traversal(v, ts);
  }
  Array.prototype.push.apply(ts, this.m);
  if (r != null) {
    r.traversal(v, ts);
  }
};

exports.Triangle = Triangle;
exports.BSPTree = BSPTree;
