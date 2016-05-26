uniform highp vec3 uView;
uniform highp float uRadius;

varying highp vec3 vPosition;
varying highp vec4 vColor;
varying highp vec3 vNormal;
varying highp vec4 vPhong;

struct Light {
  highp vec3 position;
  highp vec3 color;
};

const int nLight = 5;

Light light[nLight];

void main() {
  highp float d = uRadius * 3.0;
  light[0] = Light(vec3(0, 0, d), vec3(1, 1, 1));
  light[1] = Light(vec3(d, d, -d), vec3(1, 1, 0));
  light[2] = Light(vec3(-d, d, -d), vec3(1, 0, 0));
  light[3] = Light(vec3(-d, -d, -d), vec3(0, 1, 0));
  light[4] = Light(vec3(d, -d, -d), vec3(0, 0, 1));
  highp vec3 N = normalize(vNormal);
  highp vec3 V = normalize(uView - vPosition);
  highp vec3 I = vPhong.x * vec3(1, 1, 1);
  for (int i = 0; i < nLight; ++i) {
    highp vec3 L = normalize(light[i].position - vPosition);
    highp vec3 R = 2.0 * dot(L, N) * N - L;
    I += (
      vPhong.y * max(dot(N, L), 0.0) +
      vPhong.z * pow(max(dot(R, V), 0.0), vPhong.w)
    ) * light[i].color;
  }
  gl_FragColor = vec4(I * vColor.xyz, vColor.a);
}
