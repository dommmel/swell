#version 300 es

in vec4 a_position;
uniform mat4 u_modelViewPerspective;  

void main() {
    gl_Position = u_modelViewPerspective * a_position;
}
