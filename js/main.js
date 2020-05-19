let gl;

function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {}
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}

function getShader(gl, shaderScript, shaderType) {
  let shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderScript);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

let flatShaderProgram;
let gouraudShaderProgram;
let phongShaderProgram;

// phong
function initPhongShader() {
  let fragmentShader = getShader(gl, fsSourcePhong, gl.FRAGMENT_SHADER);
  let vertexShader = getShader(gl, vsSourcePhong, gl.VERTEX_SHADER);

  var shaderProgram = createProgram(gl, vertexShader, fragmentShader);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition",
  );
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexFrontColorAttribute = gl.getAttribLocation(
    shaderProgram,
    "aFrontColor",
  );
  gl.enableVertexAttribArray(shaderProgram.vertexFrontColorAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(
    shaderProgram,
    "aNormal",
  );
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uPMatrix",
  );
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uMVMatrix",
  );
  shaderProgram.samplerUniform = gl.getUniformLocation(
    shaderProgram,
    "uSampler",
  );

  shaderProgram.worldInverseTransposeLocation = gl.getUniformLocation(
    shaderProgram,
    "uWrldInverseTranspose",
  );
  shaderProgram.pointLightWorldPositionLocation = gl.getUniformLocation(
    shaderProgram,
    "uPointLightWorldPosition",
  );
  shaderProgram.worldViewProjectionLocation = gl.getUniformLocation(
    shaderProgram,
    "uViewWorldPosition",
  );
  shaderProgram.shininessLocation = gl.getUniformLocation(
    shaderProgram,
    "uShininess",
  );
  return shaderProgram;
}
// Flat
function initFlatShader() {
  let fragmentShader = getShader(gl, fsSourceFlat, gl.FRAGMENT_SHADER);
  let vertexShader = getShader(gl, vsSourceFlat, gl.VERTEX_SHADER);

  var shaderProgram = createProgram(gl, vertexShader, fragmentShader);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition",
  );
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexFrontColorAttribute = gl.getAttribLocation(
    shaderProgram,
    "aFrontColor",
  );
  gl.enableVertexAttribArray(shaderProgram.vertexFrontColorAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uPMatrix",
  );
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uMVMatrix",
  );
  shaderProgram.samplerUniform = gl.getUniformLocation(
    shaderProgram,
    "uSampler",
  );

  return shaderProgram;
}
// Gouraud
function initGouraudShader() {
  let fragmentShader = getShader(gl, fsSourceGouraud, gl.FRAGMENT_SHADER);
  let vertexShader = getShader(gl, vsSourceGouraud, gl.VERTEX_SHADER);

  var shaderProgram = createProgram(gl, vertexShader, fragmentShader);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    "aVertexPosition",
  );
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexFrontColorAttribute = gl.getAttribLocation(
    shaderProgram,
    "aFrontColor",
  );
  gl.enableVertexAttribArray(shaderProgram.vertexFrontColorAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(
    shaderProgram,
    "aNormal",
  );
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uPMatrix",
  );
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    "uMVMatrix",
  );

  shaderProgram.worldInverseTransposeLocation = gl.getUniformLocation(
    shaderProgram,
    "uWrldInverseTranspose",
  );
  shaderProgram.pointLightWorldPositionLocation = gl.getUniformLocation(
    shaderProgram,
    "uPointLightWorldPosition",
  );

  shaderProgram.samplerUniform = gl.getUniformLocation(
    shaderProgram,
    "uSampler",
  );

  return shaderProgram;
}

function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

let modelBuffer = [];
let currentModelBufferIndex = 1;

function CreateModelBuffer(number) {
  // init the model buffer
  modelBuffer = [];
  for (let i = 0; i < number; ++i) {
    let modelBufferItem = {};
    modelBufferItem.modelVertexNormalBuffer = gl.createBuffer();
    modelBufferItem.modelVertexFrontColorBuffer = gl.createBuffer();
    modelBufferItem.modelVertexBackColorBuffer = gl.createBuffer();
    modelBufferItem.modelVertexPositionBuffer = gl.createBuffer();

    modelBufferItem.transform = {};

    modelBufferItem.transform.translate = {};
    modelBufferItem.transform.translate.x = 0;
    modelBufferItem.transform.translate.y = 0;
    modelBufferItem.transform.translate.z = 0;

    modelBufferItem.transform.scale = {};
    modelBufferItem.transform.scale.x = 10;
    modelBufferItem.transform.scale.y = 10;
    modelBufferItem.transform.scale.z = 10;

    modelBufferItem.transform.rotate = {};
    // 0, 0, 1
    modelBufferItem.transform.rotate.up = 0;
    // 1, 0, 0
    modelBufferItem.transform.rotate.front = 0;
    // 0, 1, 0
    modelBufferItem.transform.rotate.right = 0;

    modelBufferItem.transform.shear = {};
    modelBufferItem.transform.shear.Syx = 0;
    modelBufferItem.transform.shear.Szx = 0;
    modelBufferItem.transform.shear.Sxy = 0;
    modelBufferItem.transform.shear.Szy = 0;
    modelBufferItem.transform.shear.Sxz = 0;
    modelBufferItem.transform.shear.Syz = 0;

    modelBuffer.push(modelBufferItem);
  }
}

function AddDataToBuffer(modelData, modelBufferIndex) {
  /*
    vertexBackcolors
    vertexFrontcolors
    vertexNormals
    vertexPositions
    */
  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    modelBuffer[modelBufferIndex].modelVertexNormalBuffer,
  );
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(modelData.vertexNormals),
    gl.STATIC_DRAW,
  );
  modelBuffer[modelBufferIndex].modelVertexNormalBuffer.itemSize = 3;
  modelBuffer[modelBufferIndex].modelVertexNormalBuffer.numItems =
    modelData.vertexNormals.length / 3;

  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    modelBuffer[modelBufferIndex].modelVertexFrontColorBuffer,
  );
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(modelData.vertexFrontcolors),
    gl.STATIC_DRAW,
  );
  modelBuffer[modelBufferIndex].modelVertexFrontColorBuffer.itemSize = 3;
  modelBuffer[modelBufferIndex].modelVertexFrontColorBuffer.numItems =
    modelData.vertexFrontcolors.length / 3;

  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    modelBuffer[modelBufferIndex].modelVertexBackColorBuffer,
  );
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(modelData.vertexBackcolors),
    gl.STATIC_DRAW,
  );
  modelBuffer[modelBufferIndex].modelVertexBackColorBuffer.itemSize = 3;
  modelBuffer[modelBufferIndex].modelVertexBackColorBuffer.numItems =
    modelData.vertexBackcolors.length / 3;

  gl.bindBuffer(
    gl.ARRAY_BUFFER,
    modelBuffer[modelBufferIndex].modelVertexPositionBuffer,
  );
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(modelData.vertexPositions),
    gl.STATIC_DRAW,
  );
  modelBuffer[modelBufferIndex].modelVertexPositionBuffer.itemSize = 3;
  modelBuffer[modelBufferIndex].modelVertexPositionBuffer.numItems =
    modelData.vertexPositions.length / 3;
}

function LoadModel(modelname) {
  for (let i = 0, l = modelname.length; i < l; ++i) {
    let request = new XMLHttpRequest();
    request.open("GET", "models/" + modelname[i] + ".json");
    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        AddDataToBuffer(JSON.parse(request.responseText), i);
      }
    };
    request.send();
  }
}

function setMatrixUniforms(transform, shaderProgram) {
  let mvMatrix = mat4.create();
  let pMatrix = mat4.create();

  mat4.perspective(
    45,
    gl.viewportWidth / gl.viewportHeight,
    0.1,
    100.0,
    pMatrix,
  );

  mat4.identity(mvMatrix);

  mat4.scale(mvMatrix, [
    transform.scale.x,
    transform.scale.y,
    transform.scale.z,
  ]);

  mat4.multiply(mvMatrix, [
    1,
    transform.shear.Syx,
    transform.shear.Szx,
    0,
    transform.shear.Sxy,
    1,
    transform.shear.Szy,
    0,
    transform.shear.Sxz,
    transform.shear.Syz,
    1,
    0,
    0,
    0,
    0,
    1,
  ]);

  mat4.translate(mvMatrix, [
    transform.translate.x,
    transform.translate.y,
    transform.translate.z,
  ]);

  mat4.rotate(mvMatrix, degToRad(transform.rotate.up), [0, 1, 0]);
  mat4.rotate(mvMatrix, degToRad(transform.rotate.front), [0, 0, 1]);
  mat4.rotate(mvMatrix, degToRad(transform.rotate.right), [1, 0, 0]);

  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

  let worldInverseMatrix = mat4.inverse(mvMatrix);
  let worldInverseTransposeMatrix = mat4.transpose(worldInverseMatrix);
  gl.uniformMatrix4fv(
    shaderProgram.worldInverseTransposeLocation,
    false,
    worldInverseTransposeMatrix,
  );
  // Compute the camera's matrix
  var camera = [10, 10, 10];
  var target = [0, 0, 0];
  var up = [0, 1, 0];
  var cameraMatrix = mat4.lookAt(camera, target, up);

  // Make a view matrix from the camera matrix.
  var viewMatrix = mat4.inverse(cameraMatrix);

  // Compute a view projection matrix
  var viewProjectionMatrix = mat4.multiply(pMatrix, viewMatrix);
  var worldViewProjectionMatrix = mat4.multiply(viewProjectionMatrix, mvMatrix);

  gl.uniformMatrix4fv(
    shaderProgram.worldViewProjectionLocation,
    false,
    worldViewProjectionMatrix,
  );
  // set the light position
  gl.uniform3fv(shaderProgram.pointLightWorldPositionLocation, [
    lightX,
    lightY,
    lightZ,
  ]);
  // set the shininess
  gl.uniform1f(shaderProgram.shininessLocation, shininess);
}

let shininess = 500;
let lightX = -10;
let lightY = 0;
let lightZ = 0;

function degToRad(degrees) {
  return (degrees * Math.PI) / 180;
}

let teapotAngle = 180;

function drawScene(modelBuffer, shaderProgram) {
  gl.useProgram(shaderProgram);

  if (
    modelBuffer.modelVertexPositionBuffer == null ||
    modelBuffer.modelVertexNormalBuffer == null ||
    modelBuffer.modelVertexFrontColorBuffer == null ||
    modelBuffer.modelVertexBackColorBuffer == null
  ) {
    return;
  }

  //gl.uniform1i(shaderProgram.samplerUniform, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer.modelVertexPositionBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    modelBuffer.modelVertexPositionBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0,
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer.modelVertexFrontColorBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexFrontColorAttribute,
    modelBuffer.modelVertexFrontColorBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0,
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer.modelVertexNormalBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexNormalAttribute,
    modelBuffer.modelVertexNormalBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0,
  );

  setMatrixUniforms(modelBuffer.transform, shaderProgram);

  gl.drawArrays(
    gl.TRIANGLES,
    0,
    modelBuffer.modelVertexPositionBuffer.numItems,
  );
}

function NormalizeMatrix(v, dst) {
  dst = dst || new Float32Array(3);
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    dst[0] = v[0] / length;
    dst[1] = v[1] / length;
    dst[2] = v[2] / length;
  }
  return dst;
}

let lastTime = 0;

function animate() {
  let timeNow = new Date().getTime();
  if (lastTime != 0) {
    let elapsed = timeNow - lastTime;
    teapotAngle += 0.03 * elapsed;
  }
  lastTime = timeNow;
}

function tick() {
  requestAnimFrame(tick);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

  drawScene(modelBuffer[0], flatShaderProgram);
  drawScene(modelBuffer[1], gouraudShaderProgram);
  drawScene(modelBuffer[2], phongShaderProgram);
  animate();
}

function SetModelTransform() {
  modelBuffer[0].transform.rotate.up = 180;
  modelBuffer[0].transform.rotate.front = 0;
  modelBuffer[0].transform.rotate.right = -90;
  modelBuffer[0].transform.translate.x = -0.6;
  modelBuffer[0].transform.translate.y = -0.6;
  modelBuffer[0].transform.translate.z = -5;

  modelBuffer[1].transform.rotate.front = 0;
  modelBuffer[1].transform.rotate.right = -85;
  modelBuffer[1].transform.rotate.up = 0;
  modelBuffer[1].transform.translate.x = 1;
  modelBuffer[1].transform.translate.y = -0.7;
  modelBuffer[1].transform.translate.z = -5;

  modelBuffer[2].transform.rotate.right = -95;
  modelBuffer[2].transform.rotate.up = 10;
  modelBuffer[2].transform.translate.x = -1.6;
  modelBuffer[2].transform.translate.z = -5;
}

let models = ["Plant", "Csie", "Kangaroo"];

function webGLStart() {
  let canvas = document.getElementById("ICG-canvas");
  initGL(canvas);
  flatShaderProgram = initFlatShader();
  gouraudShaderProgram = initGouraudShader();
  phongShaderProgram = initPhongShader();

  CreateModelBuffer(3);
  LoadModel(models);
  const modelsSelect = document.getElementById("models-select");
  models.forEach((e, index) => {
    const option = document.createElement("option");
    option.setAttribute("value", index);
    if (index === currentModelBufferIndex)
      option.setAttribute("selected", "selected");
    text = document.createTextNode(e);
    option.appendChild(text);
    modelsSelect.appendChild(option);
  });

  SetModelTransform();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  tick();
}
