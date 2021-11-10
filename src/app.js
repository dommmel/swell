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

/// #if DEBUG
import {GUI} from 'dat.gui';
const gui = new GUI();
/// #endif

// Settings
const GRIDWIDTH = 500;
const GRIDDEPTH = 100;
const WAVEPARAMS = [8 ,0.2, 0.0015];

// Create canvas
var canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 500;

var gl = canvas.getContext("webgl2", {alpha: false});
gl.clearColor(0, 0, 0, 1);

////////////////////////////////////////////////////////////////////////////////////////
// SET UP PROGRAM
////////////////////////////////////////////////////////////////////////////////////////
import fsSource from './fragmentShaderSource.glsl';
import vsSource from './vertexShaderSource.glsl';

let vertexShader = createShader(gl,gl.VERTEX_SHADER,vsSource)
let fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fsSource)

let program = createProgram(gl, vertexShader, fragmentShader)
gl.useProgram(program);

////////////////////////////////////////////////////////////////////////////////////////
// SET UP GEOMETRY
////////////////////////////////////////////////////////////////////////////////////////
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
    const vertices = createPlaneVertices(GRIDWIDTH, GRIDDEPTH);
    numIndices =+ vertices.indices.length;

    createBuffersFromVertices(gl, vertices);

    // turn on getting data out of a buffer for this attribute
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, numComponents, type, normalize, stride, offset);
}

////////////////////////////////////////////////////////////////////////////////////////
// SET UP CAMERA
////////////////////////////////////////////////////////////////////////////////////////
function createViewPerspectiveMatrix(u_time, a1, a2, a3) {
    const height = a1*Math.sin(a2 + a3*u_time) + 2;
    const projection = m4perspective(
        60 * Math.PI / 180,   // field of view, zoom
        gl.canvas.clientWidth / gl.canvas.clientHeight / 4, // aspect
        0.1,  // near
        1000,  // far
    );
    const cameraPosition = [0, height+12, 20];
    const target = [GRIDWIDTH/1 , -1, GRIDDEPTH / 1.5];
    const up = [0.1, 1, 0.1*Math.sin(0.1 + a3*u_time)];
    const camera = m4lookAt(cameraPosition, target, up);
    const view = invertMatrix(camera);
    const mat = multiplyMatrix(projection, view);
    return mat;
}

////////////////////////////////////////////////////////////////////////////////////////
// DRAW
////////////////////////////////////////////////////////////////////////////////////////
let u_time = 0;
let then = 0;

const viewPerspectiveMatrixLoc = gl.getUniformLocation(program, 'u_viewPerspective');
const waveParameterLoc = gl.getUniformLocation(program, "u_waveParameter"); 
const timeLoc = gl.getUniformLocation(program, "u_time"); 

// Draw the scene repeatedly
function renderLoop(now) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    const deltaTime = now - then;
    then = now;
    u_time += deltaTime

    // set time uniform
    gl.uniform1f(timeLoc, u_time);
    const viewPerspectiveMatrix = createViewPerspectiveMatrix(u_time, ...WAVEPARAMS)
    gl.uniformMatrix4fv(viewPerspectiveMatrixLoc, false, viewPerspectiveMatrix);
    gl.uniform3fv(waveParameterLoc, WAVEPARAMS);
    
    gl.drawElements(
        gl.LINES,           // primitive type
        numIndices,         //
        gl.UNSIGNED_SHORT,  // type of indices
        0,                  // offset
    );  
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

