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
// Create canvas
var canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 500;
var gl = canvas.getContext("webgl2", {alpha: true, antialias: true});
gl.clearColor(0, 0, 0, 1);

// Settings
const GRID_SIZE = 500;
const GRID_RESOLUTION= 256;
let WAVEPARAMS = [7 ,0.06, 0.0015];
let FOVY_ANGLE = 17;
let CAMERA_X = -231;
let CAMERA_Z = 133;
let CAMERA_HEIGHT = 10;
let DRAW_MODE = gl.TRIANGLES;
let TARGET_X = 100;
let TARGET_Y = 1;
let TARGET_Z = 23;
let ASPECT_MULTIPLIER = 1;

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
    const vertices = createPlaneVertices(GRID_SIZE,GRID_RESOLUTION);
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
    const height = a1*Math.sin(a2 + a3*u_time);
    const projection = m4perspective(
        FOVY_ANGLE * Math.PI / 180,   // field of view, zoom
        gl.canvas.clientWidth / gl.canvas.clientHeight * ASPECT_MULTIPLIER, // aspect
        0.1,  // near
        1000,  // far
    );
    const cameraPosition = [CAMERA_X, height+CAMERA_HEIGHT, CAMERA_Z];
    const target = [TARGET_X , TARGET_Y, TARGET_Z];
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
        DRAW_MODE,           // primitive type
        numIndices,         //
        gl.UNSIGNED_SHORT,  // type of indices
        0,                  // offset
    );  
    requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);


////////////////////////////////////////////////////////////////////////////////////////
/// #if DEBUG
//  This code blocks gets only included when webpack mode = "development"
////////////////////////////////////////////////////////////////////////////////////////
import {GUI} from 'dat.gui';
const gui = new GUI();
let settings = {
    wave: {
        height: WAVEPARAMS[0],
        length: WAVEPARAMS[1],
        speed: WAVEPARAMS[2],
    },
    wireframe: false,
    camera: {
        fovy: FOVY_ANGLE,
        x: CAMERA_X,
        z: CAMERA_Z,
        height: CAMERA_HEIGHT,
        aspect: ASPECT_MULTIPLIER,
        target_x: TARGET_X,
        target_y: TARGET_Y,
        target_z: TARGET_Z,
    },
}
function setValues() {
    WAVEPARAMS=Object.values(settings.wave);
    FOVY_ANGLE=settings.camera.fovy;
    CAMERA_X=settings.camera.x;
    CAMERA_Z=settings.camera.z;
    TARGET_X=settings.camera.target_x;
    TARGET_Y=settings.camera.target_y;
    TARGET_Z=settings.camera.target_z;
    ASPECT_MULTIPLIER=settings.camera.aspect;
    CAMERA_HEIGHT=settings.camera.height;
    DRAW_MODE = (settings.wireframe) ? gl.LINES : gl.TRIANGLES;
}
const f1 = gui.addFolder("Wave");
f1.add(settings.wave, 'height', 0, 50).onChange(setValues);
f1.add(settings.wave, 'length',0, 1).onChange(setValues);
f1.add(settings.wave, 'speed',0.00001, 0.02).onChange(setValues);
f1.add(settings, 'wireframe').onChange(setValues);
f1.open();

const f2 = gui.addFolder("Camera");
f2.add(settings.camera, 'fovy', 0, 180).onChange(setValues)
f2.add(settings.camera, 'x', -GRID_SIZE, GRID_SIZE).onChange(setValues)
f2.add(settings.camera, 'z', -GRID_SIZE, GRID_SIZE).onChange(setValues)
f2.add(settings.camera, 'height', 0, 200).onChange(setValues)
f2.add(settings.camera, 'target_x', -GRID_SIZE*4, GRID_SIZE*4).onChange(setValues)
f2.add(settings.camera, 'target_y', -GRID_SIZE, GRID_SIZE).onChange(setValues)
f2.add(settings.camera, 'target_z', -GRID_SIZE, GRID_SIZE).onChange(setValues)
f2.add(settings.camera, 'aspect', 0.1, 10).onChange(setValues)
f2.open();
/// #endif