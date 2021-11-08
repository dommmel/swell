#version 300 es

in vec4 a_position;
in vec3 a_color;
uniform vec4 u_translation;
uniform float u_cosB, u_sinB;

out vec3 vColor;

void main() {

    vColor = a_color;
    gl_Position.x = a_position.x * u_cosB - a_position.y * u_sinB ;
    gl_Position.y = a_position.y * u_cosB + a_position.x * u_sinB ;
    gl_Position.z = a_position.z;
    gl_Position.w = a_position.w;
    gl_Position = gl_Position + u_translation;
}
