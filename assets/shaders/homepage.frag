#define PI 3.14159265359

precision mediump float;

varying vec2 v_texcoord;

uniform vec2 iResolution;
uniform float iTime;

vec3 toLinear(vec3 c) {
    return pow(c, vec3(2.2));
}

vec3 toSRGB(vec3 c) {
    return pow(c, vec3(1.0 / 2.2));
}

vec3 linear_srgb_to_oklab(vec3 c) {
    vec3 lms = mat3(
        0.4122214708, 0.5363325363, 0.0514459929,
        0.2119034982, 0.6806995451, 0.1073969566,
        0.0883024619, 0.2817188376, 0.6299787005
    ) * c;

    lms = pow(lms, vec3(1.0 / 3.0));

    return mat3(
        0.2104542553,  0.7936177850, -0.0040720468,
        1.9779984951, -2.4285922050,  0.4505937099,
        0.0259040371,  0.7827717662, -0.8086757660
    ) * lms;
}

vec3 oklab_to_linear_srgb(vec3 c) {
    vec3 lms = mat3(
        1.0,  0.3963377774,  0.2158037573,
        1.0, -0.1055613458, -0.0638541728,
        1.0, -0.0894841775, -1.2914855480
    ) * c;

    lms = lms * lms * lms;

    return mat3(
        4.0767416621, -3.3077115913,  0.2309699292,
       -1.2684380046,  2.6097574011, -0.3413193965,
       -0.0041960863, -0.7034186147,  1.7076147010
    ) * lms;
}

vec3 mixOklab(vec3 a, vec3 b, float t) {
    vec3 A = linear_srgb_to_oklab(toLinear(a));
    vec3 B = linear_srgb_to_oklab(toLinear(b));
    vec3 mixed = mix(A, B, t);
    return toSRGB(oklab_to_linear_srgb(mixed));
}

void main() {
    vec2 fragCoord = v_texcoord * iResolution;
    vec2 uv = fragCoord / iResolution.xy;
    vec2 fuv = fragCoord / iResolution.yy;

    vec3 col1 = mixOklab(vec3(0.1, 0.25, 0.5), vec3(0.4, 0.0, 0.25), uv.y);
    vec3 col2 = mixOklab(vec3(0.1, 0.3, 0.5), vec3(0.5, 0.1, 0.5), uv.y);

    float angle = radians(45.0);
    mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

    vec2 ruv = (fuv * vec2(20.0, 20.0)) * rotationMatrix;

    float val = abs(sin(ruv.x + (iTime * 0.5)) * sin(ruv.y - (iTime * 0.5)));

    float addVal = 0.5 * sin(fuv.x * 200.0 - (iTime * 2.0)) * sin(fuv.y * 200.0);
    float check = (val - (fuv.y + addVal)) + 0.2;
    check = step(0.5, clamp(check * 3.0, 0.0, 1.0));
    vec3 col = mixOklab(col1, col2, check);

    col = mixOklab(col, vec3(0.2, 0.1, 0.2), sin(fragCoord.y * PI / 3.0) * 0.5);

    gl_FragColor = vec4(col, 1.0);
}