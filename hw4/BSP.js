import {vec3} from "gl-matrix";

// p: vec3 array of len 3, points
// n: vec3 array of len 3, normals
// c: vec3, color
// k: vec3, shading parameters
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
  var p, n, ofs, ts;

  s = [];
  cNeg = cZero = cPos = 0;
  for (i = 0; i < 3; ++i) {
    t = that.plane(this.p[i]);
    if (t < -0.1) {
      s.push(-1);
      ++cNeg;
    } else if (t > 0.1) {
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
    p = []; n = [];
    for (i = 0; i < 3; ++i) {
      p.push(this.p[(ofs + i) % 3]);
      n.push(this.n[(ofs + i) % 3]);
    }
    t = that.intersect(p[1], p[2]);
    p.push(vec3.create());
    vec3.lerp(p[3], p[1], p[2], t);
    n.push(vec3.create());
    vec3.lerp(n[3], n[1], n[2], t);
    vec3.normalize(n[3], n[3]);
    ts = [];
    ts.push(new Triangle([p[0], p[1], p[3]], [n[0], n[1], n[3]], this.c, this.k));
    ts.push(new Triangle([p[0], p[3], p[2]], [n[0], n[3], n[2]], this.c, this.k));
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
    p = []; n = [];
    for (i = 0; i < 3; ++i) {
      p.push(this.p[(ofs + i) % 3]);
      n.push(this.n[(ofs + i) % 3]);
    }
    t = that.intersect(p[0], p[1]);
    p.push(vec3.create());
    vec3.lerp(p[3], p[0], p[1], t);
    n.push(vec3.create());
    vec3.lerp(n[3], n[0], n[1], t);
    vec3.normalize(n[3], n[3]);
    t = that.intersect(p[0], p[2]);
    p.push(vec3.create());
    vec3.lerp(p[4], p[0], p[2], t);
    n.push(vec3.create());
    vec3.lerp(n[4], n[0], n[2], t);
    vec3.normalize(n[4], n[4]);
    ts = [];
    ts.push(new Triangle([p[0], p[3], p[4]], [n[0], n[3], n[4]], this.c, this.k));
    ts.push(new Triangle([p[1], p[2], p[3]], [n[1], n[2], n[3]], this.c, this.k));
    ts.push(new Triangle([p[2], p[4], p[3]], [n[2], n[4], n[3]], this.c, this.k));
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
  var i, j, l, m, r, n;
  i = Math.floor(0.5 * ts.length);
  l = []; m = []; r = [];
  if (ts.length == 33) {
    l = l;
  }
  for (j = 0; j < ts.length; ++j) {
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
  this.a = vec3.create();
  for (i = 0; i < m.length; ++i) {
    vec3.add(this.a, this.a, m[i].a);
  }
  vec3.normalize(this.a, this.a);
};

BSPTree.prototype.depthOrder = function (v) {
  var ts = [];
  this.traversal(v, ts);
  return ts;
};

BSPTree.prototype.traversal = function (v, ts) {
  var l, r;
  if (vec3.dot(this.a, v) < 0) {
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
