//Create canvas

var canvas = document.querySelector("canvas");
canvas.width = 500;
canvas.height = 500;

var gl = canvas.getContext("webgl2", {alpha: false});
if (!gl) {
    console.error("WebGL 2 not available");
    document.body.innerHTML = "This example requires WebGL 2 which is unavailable on this system."
}

gl.clearColor(0, 0, 0, 1);

/////////////////////
// SET UP PROGRAM
/////////////////////
import { createShader, createProgram, createVertexArrayAttributes } from './webglHelper';
import fsSource from './fragmentShaderSource.glsl';
import vsSource from './vertexShaderSource.glsl';

let vertexShader = createShader(gl,gl.VERTEX_SHADER,vsSource)
let fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fsSource)

let program = createProgram(gl, vertexShader, fragmentShader)
gl.useProgram(program);

/////////////////////
// SET UP GEOMETRY
/////////////////////
let triangleArray = gl.createVertexArray();
gl.bindVertexArray(triangleArray);

let positionArray = new Float32Array([
    -0.5, -0.5, 0.0,
    0.5, -0.5, 0.0,
    0.0, 0.5, 0.0
]);
createVertexArrayAttributes(gl, "a_position", positionArray, gl.FLOAT)

let colorArray = new Float32Array([
    1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 0.0, 1.0
]);
createVertexArrayAttributes(gl, "a_color", colorArray, gl.FLOAT)


var u_translation = gl.getUniformLocation(gl.program, 'u_translation');
gl.uniform4f(u_translation, 0.5, 0.5, 0, 0.0);

var ANGLE = 90.0;
var radian = Math.PI * ANGLE / 180.0; // Convert to radians
var cosB = Math.cos(radian);
var sinB = Math.sin(radian);

var u_cosB = gl.getUniformLocation(gl.program, 'u_cosB');
var u_sinB = gl.getUniformLocation(gl.program, 'u_sinB');
gl.uniform1f(u_cosB, cosB);
gl.uniform1f(u_sinB, sinB);


////////////////
// DRAW
////////////////
gl.clear(gl.COLOR_BUFFER_BIT);

var offset = 0;
var count = 3;
gl.drawArrays(gl.TRIANGLES, offset, count);