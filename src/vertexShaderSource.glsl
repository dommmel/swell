#version 300 es

in vec4 position;
in vec3 color;

out vec3 vColor;

void main() {

    vColor = color;
    gl_Position = position;
}
