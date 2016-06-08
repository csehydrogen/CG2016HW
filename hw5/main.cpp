#include <cstdio>
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
    u = u - floor(u); v = v - floor(v);
    int x0 = h * u, x1 = (x0 + 1) % h;
    int y0 = w * v, y1 = (y0 + 1) % w;
    double dx = h * u - x0, dy = w * v - y0;
    return (getPixel(y0, x0) * (1 - dx) + getPixel(y0, x1) * dx) * (1 - dy)
        + (getPixel(y1, x0) * (1 - dx) + getPixel(y1, x1) * dx) * dy;
  }
};

class Object {
public:
  Vec3 c; // color
  double ka, kd, ks, kn; // phong illumination coefficients
  double a, n; // transparency and index of refraction
  Texture *texture;
  Object(Vec3 _c, double _ka, double _kd, double _ks, double _kn, double _a, double _n,
      Texture *_texture): c(_c), ka(_ka), kd(_kd), ks(_ks), kn(_kn), a(_a),
      n(_n), texture(_texture) {}

  virtual tuple<double, Object*, void*> intersect(Vec3 p, Vec3 u) {
    return make_tuple(DBL_MAX, nullptr, nullptr);
  }
  virtual tuple<Vec3, Vec3> getInfo(void *i) {
    return make_tuple(Vec3(), Vec3());
  }
};

class Sphere: public Object {
  Vec3 o; // center
  double r; // radius
public:
  Sphere(Vec3 _o, double _r, Vec3 _c, double _ka, double _kd, double _ks, double _kn,
      double _a, double _n, Texture *_texture = nullptr): o(_o), r(_r),
      Object(_c, _ka, _kd, _ks, _kn, _a, _n, _texture) {}
  tuple<double, Object*, void*> intersect(Vec3 p, Vec3 u) {
    Vec3 dp = o - p;
    double b = -2 * u.dot(dp);
    double c = dp.sqrlen() - r * r;
    double d2 = b * b - 4 * c;
    if (d2 < 0) return make_tuple(DBL_MAX, nullptr, nullptr);
    double d = sqrt(d2);
    double s;
    if ((-b - d) / 2 < EPS) {
      if ((-b + d) / 2 < EPS) return make_tuple(DBL_MAX, nullptr, nullptr);
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
      c = this->c;
    }
    return make_tuple(n, c);
  }
};

vector<Object*> objs;
vector<Light> lights;

Vec3 trace(Vec3 p, Vec3 u, Light *light = nullptr) {
  double ms = DBL_MAX; Object *mo; void *mi;
  for (Object *obj: objs) {
    double s; Object *o; void *i;
    tie(s, o, i) = obj->intersect(p, u);
    if (ms > s) {
      tie(ms, mo, mi) = tie(s, o, i);
    }
  }

  if (light == nullptr) {
    if (ms == DBL_MAX) return Vec3(0, 0, 0);
  } else {
    if (ms > light->vec2light(p).len()) return light->c;
  }


  Vec3 n, qc;
  tie(n, qc) = mo->getInfo(mi);
  Vec3 v = -u;
  Vec3 q(p + u * ms);
  Vec3 slc(mo->ka, mo->ka, mo->ka);
  for (Light &light: lights) {
    Vec3 l = light.vec2light(q).normalize();
    double a = 1;
    if (n.dot(v) * n.dot(l) < 0) {
      if (mo->a == 1) continue;
      a -= mo->a;
    }
    Vec3 lc = trace(q, l, &light);
    Vec3 r = n * (2 * l.dot(n)) - l;
    slc = slc
        + lc * (a * (mo->kd * abs(n.dot(l)) + mo->ks * pow(max(r.dot(v), 0.0), mo->kn)));
  }
  return slc * qc;
}

void render() {
  int h = 1000, w = 1000;
  double fovy = PI / 2, near = 1;
  double pph = near * tan(fovy / 2) * 2;
  double ppw = pph * w / h;

  BMP img;
  img.SetSize(w, h);
  img.SetBitDepth(24);

  for (int i = 0; i < h; ++i) {
    for (int j = 0; j < w; ++j) {
      Vec3 v(ppw * (-0.5 + (j + 0.5) / w), pph * (0.5 - (i + 0.5) / h), -near);
      Vec3 c = trace(v, v.normalize());
      img(j, i)->Red = (ebmpBYTE)(min(c.x, 1.0) * 255);
      img(j, i)->Green = (ebmpBYTE)(min(c.y, 1.0) * 255);
      img(j, i)->Blue = (ebmpBYTE)(min(c.z, 1.0) * 255);
    }
  }

  img.WriteToFile("output.bmp");
}

int main() {
  Texture *tEarth = new Texture("earth.bmp");
  objs.push_back(new Sphere(Vec3(0, -20, -30), 13, Vec3(1, 1, 1), 0.0, 0.2, 0.8, 4, 1, 1, tEarth));
  objs.push_back(new Sphere(Vec3(0, 0, -30), 5, Vec3(1, 1, 1), 0.0, 0.2, 0.8, 4, 1, 1, tEarth));
  lights.push_back(Light(Vec3(0, 20, -30), Vec3(1, 1, 1)));

  render();

  for (Object *obj: objs) delete obj;
  delete tEarth;
  return 0;
}
