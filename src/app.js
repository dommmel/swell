import { 
    m4perspective,
    m4lookAt,
    createShader,
    createProgram,
    createPlaneVertices,
    createBuffersFromVertices,
    multiplyMatrix,
    invertMatrix,
} from './webglHelper';

//Create canvas

var canvas = document.querySelector("canvas");
canvas.width = 800;
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
const gridWidth = 30;
const gridDepth = 30;


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
    const vertices = createPlaneVertices(gridWidth, gridDepth);
    numIndices =+ vertices.indices.length;

    createBuffersFromVertices(gl, vertices);

    // turn on getting data out of a buffer for this attribute
    gl.enableVertexAttribArray(attribute);
    
    gl.vertexAttribPointer(attribute, numComponents, type, normalize, stride, offset);

}

/////////////////////
// SET UP VIEW & PERSPECTIVE
/////////////////////

const projection = m4perspective(
    60 * Math.PI / 180,   // field of view, zoom
    gl.canvas.clientWidth / gl.canvas.clientHeight, // aspect
    0.1,  // near
    gridWidth * gridDepth,  // far
);
const cameraPosition = [-gridWidth / 8, 10, -gridDepth / 8];
const target = [gridWidth / 2, -10, gridDepth / 2];
const up = [0, 1, 0];
const camera = m4lookAt(cameraPosition, target, up);
const view = invertMatrix(camera);
const mat = multiplyMatrix(projection, view);

{
    const uniform = gl.getUniformLocation(program, 'u_modelViewPerspective');
    gl.uniformMatrix4fv(uniform, false, mat);
}

const timeLocation = gl.getUniformLocation(program, "u_time"); 
////////////////
// DRAW
////////////////
let u_time = 0;
let then = 0;

// Draw the scene repeatedly
function render(now) {
    const deltaTime = now - then;
    then = now;

    // set time uniform
    gl.uniform1f(timeLocation, u_time += deltaTime);
    
    gl.drawElements(
        gl.LINES,           // primitive type
        numIndices,         //
        gl.UNSIGNED_SHORT,  // type of indices
        0,                  // offset
    );  
    requestAnimationFrame(render);
}
requestAnimationFrame(render);

