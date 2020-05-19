// Translate
let translateDegree = 0.1;
function translate(axis, direction) {
  modelBuffer[currentModelBufferIndex].transform.translate[axis] += direction * translateDegree;
  document.getElementById(axis).textContent = Math.round(modelBuffer[currentModelBufferIndex].transform.translate[axis] * 100) / 100;
}

// Rotate
let rotateDegree = 10;
function rotate(axis, direction) {
  modelBuffer[currentModelBufferIndex].transform.rotate[axis] += direction * rotateDegree;
  document.getElementById(axis).textContent = Math.round(modelBuffer[currentModelBufferIndex].transform.rotate[axis] * 100) / 100;
}

// Scale
let scaleDegree = 0.5;
function scale(axis, direction) {
  modelBuffer[currentModelBufferIndex].transform.scale[axis] += scaleDegree; 
}

// Shear
let shearDegree = 0.5;
function shear(key, direction) {
  modelBuffer[currentModelBufferIndex].transform.shear[key] += direction * shearDegree;
}

// Shininess
let shininessDegree = 10;
function modifyShininess(direction) {
  shininess += direction * shininessDegree;
}

function changeCurrentModelBufferIndex(value) {
  currentModelBufferIndex = value;
}