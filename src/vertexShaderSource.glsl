#version 300 es

in vec4 a_position;
uniform mat4 u_modelViewPerspective;  
uniform float u_time;



void main() {
    float s_contrib = 1.0*sin(a_position.x*0.5 + 0.001*u_time);
	// float t_contrib = 0.8*cos(a_position.y*4.1 + 1.0*u_time);
    float height = s_contrib;

    vec4 new_position = vec4(a_position.x, height, a_position.z, 1.0);
    gl_Position = u_modelViewPerspective * new_position;
}
