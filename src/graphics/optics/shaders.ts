/** All coordinates are CSS pixels or top-origin glyph UVs.
 * u_rect: cached glyph box in viewport pixels; u_resolution: viewport CSS size.
 * u_energy: damped physical input; u_front: bounded traveling-front progress.
 * u_pointer/u_velocity: local pointer UV and normalized viewport velocity.
 * u_mode: geometry law, not just color; u_refraction: environment contribution.
 * u_texel: glyph texel size, used to derive its actual silhouette normal.
 */
export const opticalVertex = `
precision mediump float;
attribute vec2 a_position;
uniform vec4 u_rect;
uniform vec2 u_resolution;
varying vec2 v_uv;
varying vec2 v_screen;
void main() {
  v_uv = a_position;
  vec2 pixel = u_rect.xy + a_position * u_rect.zw;
  v_screen = pixel / u_resolution;
  gl_Position = vec4(v_screen.x * 2.0 - 1.0, 1.0 - v_screen.y * 2.0, 0.0, 1.0);
}`;

export const opticalFragment = `
precision mediump float;
uniform sampler2D u_glyph;
uniform sampler2D u_environment;
uniform vec2 u_texel;
uniform vec2 u_pointer;
uniform vec2 u_velocity;
uniform vec2 u_resolution;
uniform vec4 u_rect;
uniform float u_energy;
uniform float u_front;
uniform float u_mode;
uniform float u_refraction;
uniform float u_environmentReady;
varying vec2 v_uv;
varying vec2 v_screen;

float glyph(vec2 uv) {
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return 0.0;
  return texture2D(u_glyph, uv).a;
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  float travel = clamp(u_front, 0.0, 1.0);
  float envelope = sin(travel * 3.14159265);
  float frontX = mix(-0.2, 1.2, travel);
  float front = exp(-pow((v_uv.x - frontX) / 0.14, 2.0)) * envelope;
  float proximity = exp(-dot((v_uv - u_pointer) * vec2(1.0, 0.7), (v_uv - u_pointer) * vec2(1.0, 0.7)) * 12.0);
  float energy = clamp(u_energy + front * 0.72, 0.0, 1.0);
  float local = energy * (0.24 + proximity * 0.45 + front * 0.8);
  vec2 direction = normalize(u_velocity + vec2(0.48, 0.16));
  vec2 offset;
  float yWave = sin(v_uv.y * 16.0 + frontX * 6.0);

  // Home: smooth lens. Brain: traveling memory smear. Work: rigid compression.
  // Now: elastic state. Codex: quantized logic. About: viscous ink. Contact: scan dissolution.
  if (u_mode < 0.5) {
    offset = direction * local * 0.025 + (v_uv - u_pointer) * proximity * energy * 0.06;
  } else if (u_mode < 1.5) {
    offset = vec2(front * 0.13 + yWave * local * 0.018, sin(v_uv.x * 19.0) * local * 0.024);
  } else if (u_mode < 2.5) {
    offset = vec2((v_uv.x - 0.5) * local * 0.095, direction.y * local * 0.005);
  } else if (u_mode < 3.5) {
    offset = (v_uv - u_pointer) * proximity * energy * 0.15 + direction * front * 0.05;
  } else if (u_mode < 4.5) {
    float row = floor(v_uv.y * 28.0);
    offset = vec2((hash(vec2(row, floor(frontX * 15.0))) - 0.5) * local * 0.1, floor(front * 4.0) * 0.008);
  } else if (u_mode < 5.5) {
    offset = vec2(yWave * local * 0.016, sin(v_uv.x * 13.0 + frontX * 5.0) * local * 0.018 + front * 0.025);
  } else {
    offset = vec2(front * 0.12 + direction.x * local * 0.028, sin(v_uv.y * 48.0) * front * 0.012);
  }

  // Warp the source glyph first. Spectral samples therefore follow changing geometry.
  vec2 uv = v_uv - offset;
  vec2 sampleStep = u_texel * 1.5;
  vec2 gradient = vec2(glyph(uv + vec2(sampleStep.x, 0.0)) - glyph(uv - vec2(sampleStep.x, 0.0)),
                       glyph(uv + vec2(0.0, sampleStep.y)) - glyph(uv - vec2(0.0, sampleStep.y)));
  vec2 normal = gradient / max(length(gradient), 0.05);
  vec2 dispersion = (normal * 0.68 + direction * 0.32) * local * (u_mode > 1.5 && u_mode < 2.5 ? 3.0 : 8.0) / u_rect.zw;
  float red = glyph(uv - dispersion * 1.45);
  float green = glyph(uv + dispersion * 0.25);
  float blue = glyph(uv + dispersion * 1.45);
  float alpha = max(red, max(green, blue));
  vec4 original = texture2D(u_glyph, clamp(uv, 0.0, 1.0));
  float core = min(red, min(green, blue));

  // The front removes/reassembles small portions rather than keeping a fixed text silhouette.
  float dissolution = 0.0;
  if ((u_mode > 0.5 && u_mode < 1.5) || u_mode > 5.5) {
    float cell = hash(floor(uv * vec2(90.0, 36.0)));
    dissolution = smoothstep(0.46, 0.95, front) * smoothstep(0.35, 0.8, cell) * 0.7;
  }
  alpha *= 1.0 - dissolution;
  if (alpha < 0.002) discard;

  vec3 spectral = vec3(red, green, blue) / max(alpha, 0.001);
  vec2 environmentUv = clamp(v_screen + (normal * local * 12.0 + offset * u_rect.zw * 0.6) / u_resolution, 0.0, 1.0);
  vec3 environment = texture2D(u_environment, environmentUv).rgb;
  float lens = u_refraction * energy * u_environmentReady;
  vec3 denseCore = mix(original.rgb, environment * 1.8 + vec3(0.16, 0.18, 0.21), lens);
  // Color is generated at wavelength-separated boundaries; quiet interiors retain their ink.
  float edge = clamp((alpha - core) * 3.0, 0.0, 1.0);
  vec3 color = mix(denseCore, spectral, edge);
  if (u_mode > 4.5 && u_mode < 5.5) color *= 1.0 - hash(floor(uv * 900.0)) * energy * 0.13;
  gl_FragColor = vec4(color * alpha, alpha);
}`;
