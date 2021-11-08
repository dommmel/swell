#version 300 es

in vec4 a_position;
in vec3 a_color;
uniform vec4 u_translation;

out vec3 vColor;

void main() {

    vColor = a_color;
    gl_Position = a_position;
    gl_Position = a_position + u_translation;
}
