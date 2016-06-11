#include <cstdio>
#include <cstring>
#include <cmath>
#include <cfloat>
#include <vector>
#include <utility>
#include <algorithm>
#include <tuple>
#include "EasyBMP/EasyBMP.h"

using namespace std;

double const PI = atan(1.0) * 4;
double const EPS = 1e-9;

class Vec3 {
public:
  double x, y, z;
  Vec3(double _x = 0, double _y = 0, double _z = 0): x(_x), y(_y), z(_z) {}
  Vec3(Vec3 const &rhs) {
    x = rhs.x; y = rhs.y; z = rhs.z;
  }
  Vec3 normalize() {
    double l = sqrt(x * x + y * y + z * z);
    if (l == 0) return *this;
    return Vec3(x / l, y / l, z / l);
  }
  double sqrlen() {
    return x * x + y * y + z * z;
  }
  double len() {
    return sqrt(x * x + y * y + z * z);
  }
  double dot(Vec3 const &rhs) {
    return x * rhs.x + y * rhs.y + z * rhs.z;
  }
  Vec3 cross(Vec3 const &rhs) {
    return Vec3(y * rhs.z - z * rhs.y, z * rhs.x - x * rhs.z, x * rhs.y - y * rhs.x);
  }
  Vec3 operator-(Vec3 const &rhs) {
    return Vec3(x - rhs.x, y - rhs.y, z - rhs.z);
  }
  Vec3 operator+(Vec3 const &rhs) {
    return Vec3(x + rhs.x, y + rhs.y, z + rhs.z);
  }
  Vec3 operator*(Vec3 const &rhs) {
    return Vec3(x * rhs.x, y * rhs.y, z * rhs.z);
  }
  Vec3 operator*(double rhs) {
    return Vec3(x * rhs, y * rhs, z * rhs);
  }
  Vec3 operator-() {
    return Vec3(-x, -y, -z);
  }
};

class Triangle {
public:
  Vec3 p[3], n[3], t[3], pn;
  double pd;
  Triangle(Vec3 _p[3], Vec3 _n[3]) {
    for (int i = 0; i < 3; ++i) {
      p[i] = _p[i];
      n[i] = _n[i];
    }
    pn = (p[1] - p[0]).cross(p[2] - p[0]).normalize();
    pd = -pn.dot(p[0]);
  }
  Triangle(Vec3 _p[3], Vec3 _n[3], Vec3 _t[3]) {
    for (int i = 0; i < 3; ++i) {
      p[i] = _p[i];
      n[i] = _n[i];
      t[i] = _t[i];
    }
    pn = (p[1] - p[0]).cross(p[2] - p[0]).normalize();
    pd = -pn.dot(p[0]);
  }
  void scaleAndAdd(double scale, Vec3 ofs) {
    for (int i = 0; i < 3; ++i) {
      p[i] = p[i] * scale + ofs;
    }
    pd = -pn.dot(p[0]);
  }
};

class Light {
public:
  Vec3 p, c;
  Light(Vec3 _p, Vec3 _c): p(_p), c(_c) {}
  Vec3 vec2light(Vec3 v) {
    return p - v;
  }
};

class Texture {
public:
  BMP img;
  Texture(char const *fn) {
    img.ReadFromFile(fn);
  }
  Vec3 getPixel(int i, int j) {
    RGBApixel *p = img(i, j);
    return Vec3(p->Red / 255.0, p->Green / 255.0, p->Blue / 255.0);
  }
  Vec3 getColor(double u, double v) {
    int h = img.TellHeight();
    int w = img.TellWidth();
    u = fmod(u, 1); u = u < 1 ? u : u - 1;
    v = fmod(v, 1); v = v < 1 ? v : v - 1;
    int x0 = h * u, x1 = (x0 + 1) % h;
    int y0 = w * v, y1 = (y0 + 1) % w;
    double dx = h * u - x0, dy = w * v - y0;
    return (getPixel(y0, x0) * (1 - dx) + getPixel(y0, x1) * dx) * (1 - dy)
        + (getPixel(y1, x0) * (1 - dx) + getPixel(y1, x1) * dx) * dy;
  }
};

class Obj {
public:
  vector<Triangle> ts;
  Obj(char const *fn, bool texture) {
    vector<Vec3> v, vt, vn;
    FILE *f = fopen(fn, "r");
    char buf[1024];
    while (fgets(buf, sizeof(buf), f)) {
      if (buf[0] == 'v') {
        if (buf[1] == ' ') {
          double x, y, z;
          sscanf(buf, "v %lf %lf %lf", &x, &y, &z);
          v.push_back(Vec3(x, y, z));
        } else if (buf[1] == 't') {
          double u, v;
          sscanf(buf, "vt %lf %lf", &u, &v);
          vt.push_back(Vec3(u, v));
        } else if (buf[1] == 'n') {
          double x, y, z;
          sscanf(buf, "vn %lf %lf %lf", &x, &y, &z);
          vn.push_back(Vec3(x, y, z).normalize());
        }
      } else if (buf[0] == 'f') {
        char *s = strtok(buf, " ");
        Vec3 p[3], t[3], n[3];
        for (int i = 0; i < 3; ++i) {
          s = strtok(NULL, " ");
          int x, y, z;
          if (texture) {
            sscanf(s, "%d/%d/%d", &x, &y, &z);
            p[i] = v[x - 1];
            t[i] = vt[y - 1];
            n[i] = vn[z - 1];
          } else {
            sscanf(s, "%d//%d", &x, &z);
            p[i] = v[x - 1];
            n[i] = vn[z - 1];
          }
        }
        if (texture) {
          ts.push_back(Triangle(p, n, t));
        } else {
          ts.push_back(Triangle(p, n));
        }
      }
    }
    fclose(f);
  }
};

class Object {
public:
  Vec3 ka, kd, ks, kr, kt;
  double kn, n;
  Texture *texture;
  Object(Vec3 _ka, Vec3 _kd, Vec3 _ks, double _kn, Vec3 _kr, Vec3 _kt, double _n, Texture *_texture): ka(_ka), kd(_kd), ks(_ks), kn(_kn), kr(_kr), kt(_kt), n(_n), texture(_texture) {}
  virtual tuple<double, Object*, void*> intersect(Vec3 p, Vec3 u) {
    return make_tuple(DBL_MAX, nullptr, nullptr);
  }
  virtual tuple<Vec3, Vec3> getInfo(void *i) {
    return make_tuple(Vec3(), Vec3());
  }
  virtual Vec3 attenuation(Vec3 p, Vec3 u, double dist) {
    return Vec3();
  }
};

class Sphere: public Object {
  Vec3 o; // center
  double r; // radius
public:
  Sphere(Vec3 _o, double _r, Vec3 _ka, Vec3 _kd, Vec3 _ks, double _kn, Vec3 _kr, Vec3 _kt, double _n, Texture *_texture = nullptr): o(_o), r(_r), Object(_ka, _kd, _ks, _kn, _kr, _kt, _n, _texture) {}
  Vec3 attenuation(Vec3 p, Vec3 u, double dist) {
    Vec3 ret(1, 1, 1);
    Vec3 dp = o - p;
    double b = -2 * u.dot(dp);
    double c = dp.sqrlen() - r * r;
    double d2 = b * b - 4 * c;
    if (d2 < 0) return ret;
    double d = sqrt(d2);
    if ((-b - d) / 2 > EPS && (-b - d) / 2 < dist) ret = ret * kt;
    if ((-b + d) / 2 > EPS && (-b + d) / 2 < dist) ret = ret * kt;
    return ret;
  }
  tuple<double, Object*, void*> intersect(Vec3 p, Vec3 u) {
    Vec3 dp = o - p;
    double b = -2 * u.dot(dp);
    double c = dp.sqrlen() - r * r;
    double d2 = b * b - 4 * c;
    if (d2 < 0) return make_tuple(DBL_MAX, nullptr, nullptr);
    double d = sqrt(d2);
    double s;
    if ((-b - d) / 2 <= EPS) {
      if ((-b + d) / 2 <= EPS) return make_tuple(DBL_MAX, nullptr, nullptr);
      s = (-b + d) / 2;
    } else {
      s = (-b - d) / 2;
    }
    return make_tuple(s, this, new Vec3(((p + u * s) - o).normalize()));
  }
  // return normal and color
  tuple<Vec3, Vec3> getInfo(void *i) {
    Vec3 n = *(Vec3*)i;
    delete (Vec3*)i;
    Vec3 c;
    if (texture != nullptr) {
      c = texture->getColor(
          atan2(sqrt(n.x * n.x + n.z * n.z), n.y) / PI,
          (atan2(-n.z, n.x) + PI) / (2 * PI)
      );
    } else {
      c = Vec3(1, 1, 1);
    }
    return make_tuple(n, c);
  }
};

class Polyhedron: public Object {
  vector<Triangle> ts;
public:
  Polyhedron(Obj *obj, Vec3 ofs, double scale, Vec3 _ka, Vec3 _kd, Vec3 _ks, double _kn, Vec3 _kr, Vec3 _kt, double _n, Texture *_texture = nullptr): Object(_ka, _kd, _ks, _kn, _kr, _kt, _n, _texture) {
    for (Triangle &t: obj->ts) {
      ts.push_back(t);
    }
    for (Triangle &t: ts) {
      t.scaleAndAdd(scale, ofs);
    }
  }
  Vec3 attenuation(Vec3 p, Vec3 u, double dist) {
    Vec3 ret(1, 1, 1);
    double denom;
    for (Triangle &triangle: ts) {
      denom = triangle.pn.dot(u);
      if (denom == 0) continue;
      double r = -(triangle.pd + triangle.pn.dot(p)) / denom;
      if (r <= EPS || r >= dist) continue;
      Vec3 w = p + u * r - triangle.p[0];
      Vec3 u = triangle.p[1] - triangle.p[0];
      Vec3 v = triangle.p[2] - triangle.p[0];
      double uv = u.dot(v), uu = u.sqrlen(), vv = v.sqrlen();
      double wv = w.dot(v), wu = w.dot(u);
      denom = uv * uv - uu * vv;
      double s = (uv * wv - vv * wu) / denom;
      double t = (uv * wu - uu * wv) / denom;
      if (s < 0 || t < 0 || s + t > 1) continue;
      ret = ret * kt;
      if (ret.sqrlen() < 1.0 / 65536) break;
    }
    return ret;
  }
  tuple<double, Object*, void*> intersect(Vec3 p, Vec3 u) {
    double mr = DBL_MAX; Triangle *mt; Vec3 mbc;
    double denom;
    for (Triangle &triangle: ts) {
      denom = triangle.pn.dot(u);
      if (denom == 0) continue;
      double r = -(triangle.pd + triangle.pn.dot(p)) / denom;
      if (r <= EPS) continue;
      Vec3 w = p + u * r - triangle.p[0];
      Vec3 u = triangle.p[1] - triangle.p[0];
      Vec3 v = triangle.p[2] - triangle.p[0];
      double uv = u.dot(v), uu = u.sqrlen(), vv = v.sqrlen();
      double wv = w.dot(v), wu = w.dot(u);
      denom = uv * uv - uu * vv;
      double s = (uv * wv - vv * wu) / denom;
      double t = (uv * wu - uu * wv) / denom;
      if (s < 0 || t < 0 || s + t > 1) continue;
      if (mr > r) {
        mr = r; mt = &triangle; mbc = Vec3(1 - s - t, s, t);
      }
    }
    if (mr == DBL_MAX) return make_tuple(DBL_MAX, nullptr, nullptr);
    return make_tuple(mr, this, new tuple<Triangle*, Vec3>(mt, mbc));
  }
  // return normal and color
  tuple<Vec3, Vec3> getInfo(void *i) {
    tuple<Triangle*, Vec3> *p = (tuple<Triangle*, Vec3>*)i;
    Triangle *t; Vec3 bc;
    tie(t, bc) = *p;
    delete p;

    Vec3 n = (t->n[0] * bc.x + t->n[1] * bc.y + t->n[2] * bc.z).normalize();
    Vec3 c;
    if (texture != nullptr) {
      Vec3 tp = t->t[0] * bc.x + t->t[1] * bc.y + t->t[2] * bc.z;
      c = texture->getColor(tp.x, tp.y);
    } else {
      c = Vec3(1, 1, 1);
    }
    return make_tuple(n, c);
  }
};

vector<Object*> objs;
vector<Light> lights;

Vec3 cast(Vec3 p, Vec3 u, Light *light) {
  double d = light->vec2light(p).len();
  Vec3 atten(1, 1, 1);
  for (Object *obj: objs) {
    atten = atten * obj->attenuation(p, u, d);
    if (atten.len() < EPS) break;
  }
  return light->c * atten;
}

Vec3 trace(Vec3 p, Vec3 u, int depth = 0, Vec3 w = Vec3(1, 1, 1)) {
  if (depth > 9 || w.len() < 1.0 / 256) {
    return Vec3(0, 0, 0);
  }
  double ms = DBL_MAX; Object *mo; void *mi;
  for (Object *obj: objs) {
    double s; Object *o; void *i;
    tie(s, o, i) = obj->intersect(p, u);
    if (ms > s) {
      tie(ms, mo, mi) = tie(s, o, i);
    }
  }

  if (ms == DBL_MAX) return Vec3(0, 0, 0);

  Vec3 n, qc;
  tie(n, qc) = mo->getInfo(mi);
  Vec3 v = -u;
  Vec3 q(p + u * ms);
  Vec3 slc(mo->ka);

  // shadow rays
  for (Light &light: lights) {
    Vec3 l = light.vec2light(q).normalize();
    if (n.dot(v) * n.dot(l) < 0) { // refraction
      double ni = 1, nr = 1;
      Vec3 nn;
      if (n.dot(l) > 0) {
        nr = mo->n;
        nn = n;
      } else {
        ni = mo->n;
        nn = -n;
      }
      double ci = nn.dot(l);
      double cr2 = 1 - (ni / nr) * (ni / nr) * (1 - ci * ci);
      if (cr2 < 0) continue;
      double cr = sqrt(cr2);
      Vec3 r = nn * (ni / nr * ci - cr) - l * (ni / nr);
      Vec3 lc = cast(q, l, &light);
      slc = slc + qc * lc * mo->kt * (mo->kd * abs(n.dot(l)) + mo->ks * pow(max(r.dot(v), 0.0), mo->kn));
    } else { // reflection
      Vec3 r = n * (2 * l.dot(n)) - l;
      Vec3 lc = cast(q, l, &light);
      slc = slc + qc * lc * mo->kr * (mo->kd * abs(n.dot(l)) + mo->ks * pow(max(r.dot(v), 0.0), mo->kn));
    }
  }

  // reflection
  do {
    Vec3 l = n * (2 * v.dot(n)) - v;
    Vec3 lc = trace(q, l, depth + 1, w * mo->kr);
    slc = slc + lc * mo->kr;
  } while (false);

  // refraction
  do {
    double ni = 1, nr = 1;
    Vec3 nn;
    if (n.dot(v) > 0) {
      nr = mo->n;
      nn = n;
    } else {
      ni = mo->n;
      nn = -n;
    }
    double ci = nn.dot(v);
    double cr2 = 1 - (ni / nr) * (ni / nr) * (1 - ci * ci);
    if (cr2 < 0) continue;
    double cr = sqrt(cr2);
    Vec3 l = nn * (ni / nr * ci - cr) - v * (ni / nr);
    Vec3 lc = trace(q, l, depth + 1, w * mo->kt);
    slc = slc + lc * mo->kt;
  } while (false);

  return slc;
}

void render() {
  int h = 512, w = 512;
  double fovy = PI / 2, near = 1;
  double pph = near * tan(fovy / 2) * 2;
  double ppw = pph * w / h;

  BMP img;
  img.SetSize(w, h);
  img.SetBitDepth(24);

  for (int i = 0; i < h; ++i) {
    for (int j = 0; j < w; ++j) {
      if (i == 256 && j == 256) {
        i = 256;
      }
      Vec3 v(ppw * (-0.5 + (j + 0.5) / w), pph * (0.5 - (i + 0.5) / h), -near);
      Vec3 c = trace(v, v.normalize());
      if (c.x > 0) {
        c.x = c.x;
      }
      img(j, i)->Red = (ebmpBYTE)(min(c.x, 1.0) * 255);
      img(j, i)->Green = (ebmpBYTE)(min(c.y, 1.0) * 255);
      img(j, i)->Blue = (ebmpBYTE)(min(c.z, 1.0) * 255);
    }
  }

  img.WriteToFile("output.bmp");
}

int main() {
  Texture *tEarth = new Texture("earth.bmp");
  Obj *oCube = new Obj("cube_textured.obj", true);
  Obj *oMirror = new Obj("mirror.obj", false);

  //objs.push_back(new Sphere(Vec3(0, -20, -30), 13, Vec3(1, 1, 1), 0.0, 0.2, 0.8, 4, 1, 1, tEarth));
  //objs.push_back(new Sphere(Vec3(0, -10, -30), 5, Vec3(1, 1, 1), 0.0, 0.2, 0.8, 4, 1, 1, tEarth));
  //objs.push_back(new Polyhedron(oCube, Vec3(0, -20, -30), 20, Vec3(1, 1, 1), 0.0, 0.2, 0.8, 4, 1, 1, tEarth));
  //objs.push_back(new Polyhedron(oMirror, Vec3(0, -10, -60), 100, Vec3(1, 1, 1), 0.0, 0.0, 1.0, 128, 1, 1));
  objs.push_back(new Polyhedron(oCube, Vec3(0, -10, -50), 20, Vec3(0, 0, 0), Vec3(1, 1, 1), Vec3(0, 0, 0), 128, Vec3(1, 1, 1), Vec3(0, 0, 0), 1, tEarth));
  objs.push_back(new Sphere(Vec3(0, -10, -30), 5, Vec3(0, 0, 0), Vec3(0, 0, 0), Vec3(0, 0, 0), 1, Vec3(0, 0, 0), Vec3(1, 1, 1), 1.33));
  lights.push_back(Light(Vec3(0, 0, 0), Vec3(1, 1, 1)));
  //lights.push_back(Light(Vec3(0, 20, -30), Vec3(1, 1, 1)));
  //lights.push_back(Light(Vec3(20, -30, -30), Vec3(1, 1, 1)));
  //Object(Vec3 _ka, Vec3 _kd, Vec3 _ks, double _kn, Vec3 _kr, Vec3 _kt, double _n, Texture *_texture): ka(_ka), kd(_kd), ks(_ks), kn(_kn), kr(_kr), kt(_kt), n(_n), texture(_texture) {}

  render();

  for (Object *obj: objs) delete obj;
  delete tEarth;
  delete oCube;
  return 0;
}
