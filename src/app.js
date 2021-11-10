import { createShader, createProgram, createPlaneVertices, createBuffersFromVertices } from './webglHelper';

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
import fsSource from './fragmentShaderSource.glsl';
import vsSource from './vertexShaderSource.glsl';

let vertexShader = createShader(gl,gl.VERTEX_SHADER,vsSource)
let fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fsSource)

let program = createProgram(gl, vertexShader, fragmentShader)
gl.useProgram(program);

/////////////////////
// SET UP GEOMETRY
/////////////////////
let numIndices = 0;

{
    const attributeName = 'a_position';
    var numComponents = 3;  // (x, y, z)
    var type = gl.FLOAT;    // 32bit floating point values
    var normalize = false;  // leave the values as they are
    var offset = 0;         // start at the beginning of the buffer
    var stride = 0;         // how many bytes to move to the next vertex
                            // 0 = use the correct stride for type and numComponents

    const attribute = gl.getAttribLocation(program, attributeName);
    const vertices = createPlaneVertices(40, 40);
    numIndices =+ vertices.indices.length;

    createBuffersFromVertices(gl, vertices);

    // turn on getting data out of a buffer for this attribute
    gl.enableVertexAttribArray(attribute);
    
    gl.vertexAttribPointer(attribute, numComponents, type, normalize, stride, offset);

}
////////////////
// DRAW
////////////////
// gl.clear(gl.COLOR_BUFFER_BIT);

gl.drawElements(
    gl.LINES,           // primitive type
    numIndices,         //
    gl.UNSIGNED_SHORT,  // type of indices
    0,                  // offset
);
