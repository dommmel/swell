precision highp float;

// use it like so:
//   vec4 color = ContourLines(0.1, 0.1, vec3(0.,v_position.y,.0));
//   fragColor = color * vec4(v_color,1.0);

vec4 ContourLines(float gsize, float gwidth, vec3 position) {
    vec3 f = abs(fract(position * gsize) - 0.5);
    vec3 df = fwidth(position * gsize);
    float mi = max(0.0, gwidth - 1.0), ma = max(1.0, gwidth);
    //should be uniforms
    vec3 g = clamp((f - df * mi) / (df * (ma - mi)), max(0.0, 1.0 - gwidth), 1.0);
    //max(0.0,1.0-gwidth) should also be sent as uniform
    float c = g.x * g.y * g.z;
    vec4 color = vec4(c, c, c, 1.0);
    return(color);
}

#pragma glslify: export(ContourLines)