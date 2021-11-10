export function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
   
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
} 

export function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    gl.program = program;
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export function createBuffersFromVertices(gl, vertices) {
    // const buffers = {};
    for (const key in vertices) {
        let target, source;
        if (key === 'indices') {
            target = gl.ELEMENT_ARRAY_BUFFER;
            source = new Uint16Array(vertices[key]);
        } else {
            target = gl.ARRAY_BUFFER;
            source = new Float32Array(vertices[key]);
        }

        const buffer = gl.createBuffer();
        // buffers[key] = buffer;
        gl.bindBuffer(target, buffer);
        gl.bufferData(target, source, gl.STATIC_DRAW);
    }
    // return buffers;
}

export function createPlaneVertices(gridWidth=40, gridDepth=40) {
    const positions = [];
    for (let z = 0; z <= gridDepth; ++z) {
      for (let x = 0; x <= gridWidth; ++x) {
        positions.push(x, 0, z);
      }
    }
    
    const indices = [];
    const rowStride = gridWidth + 1;
    // x lines
    for (let z = 0; z <= gridDepth; ++z) {
      const rowOff = z * rowStride;
      for (let x = 0; x < gridWidth; ++x) {
        indices.push(rowOff + x, rowOff + x + 1);
      }
    }
    // z lines
    for (let x = 0; x <= gridWidth; ++x) {
      for (let z = 0; z < gridDepth; ++z) {
        const rowOff = z * rowStride;
        indices.push(rowOff + x, rowOff + x + rowStride);
      }
    }
    return {positions, indices}
}

