#version 300 es
precision highp float;
in vec3 v_color;
in vec4 v_position;
out vec4 fragColor;


void main() {
    fragColor = vec4(v_color,1);
}