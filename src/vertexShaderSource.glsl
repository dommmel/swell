#version 300 es

uniform mat4 u_viewPerspective;  
uniform float u_time;
uniform vec3 u_waveParameter;
in vec4 a_position;
out vec4 v_position;

void main() {
    float s_contrib = u_waveParameter[0]*sin(a_position.x*u_waveParameter[1] + u_waveParameter[2]*u_time);
	// float t_contrib = 0.8*cos(a_position.y*4.1 + 1.0*u_time);
    float height = s_contrib;
    vec4 new_position = vec4(a_position.x, height, a_position.z, 1.0);
    gl_Position = u_viewPerspective * new_position;
    v_position = a_position;
}
