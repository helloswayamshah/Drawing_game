let curves = [];

const BACKGROUND_COLOR = 245;
let currentCurve = null;
let lastDelCurve = null;
let color = 0;
let size = 10;
let undoStack = [];

var canvas;

function setup() {
  canvas = createCanvas(windowWidth * 0.5, windowHeight * 0.5);

  let socket = new WebSocket("ws://localhost:8080");

  document.oncontextmenu = function () {
    if (mouseX < width && mouseY < height) return false;
  };

  const buttonsDiv = document.createElement("div");
  buttonsDiv.id = "buttons";
  document.body.appendChild(buttonsDiv);

  const clearButton = document.createElement("button");
  clearButton.textContent = "clear";
  buttonsDiv.appendChild(clearButton);
  clearButton.id = "clear";
  clearButton.onclick = () => {
    curves = [];
  };

  const undoButton = document.createElement("button");
  undoButton.textContent = "undo";
  undoButton.id = "undo";
  buttonsDiv.appendChild(undoButton);

  undoButton.onclick = () => {
    if (curves.length > 0) {
      console.log(curves);
      let lastDelCurve = curves.pop();
      console.log(lastDelCurve);
      console.log(curves);
      console.log(undoStack);
      undoStack.push(lastDelCurve);
    }
  };

  const redoButton = document.createElement("button");
  redoButton.textContent = "redo";
  redoButton.id = "redo";
  buttonsDiv.appendChild(redoButton);
  redoButton.onclick = () => {
    if (undoStack.length > 0) {
      undoedCurve = undoStack.pop();
      curves.push(undoedCurve);
    }
  };

  const BrushDiv = document.createElement("div");
  BrushDiv.id = "Brush";
  document.body.appendChild(BrushDiv);

  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = "#000000";
  colorPicker.addEventListener("input", () => {
    color = colorPicker.value;
  });
  colorPicker.addEventListener("change", () => {
    color = colorPicker.value;
  });
  BrushDiv.appendChild(colorPicker);

  const BrushSizeDiv = document.createElement("div");
  BrushSizeDiv.id = "BrushSize";
  BrushDiv.appendChild(BrushSizeDiv);

  const sizeDisplay = document.createElement("h2");
  sizeDisplay.textContent = size.toString();
  BrushSizeDiv.appendChild(sizeDisplay);

  const brushSizeSlider = document.createElement("input");
  brushSizeSlider.type = "range";
  brushSizeSlider.min = "1";
  brushSizeSlider.max = "50";
  brushSizeSlider.value = size.toString;
  brushSizeSlider.step = "1";
  brushSizeSlider.addEventListener("input", (event) => {
    size = event.target.value;
    sizeDisplay.textContent = size.toString();
  });
  BrushSizeDiv.appendChild(brushSizeSlider);
}

function draw() {
  background(BACKGROUND_COLOR);
  curves.forEach((curve) => {
    curve.drawCurve();
  });
  if (currentCurve != null) currentCurve.drawCurve();
  strokeWeight(size);
  stroke(color);
  point(mouseX, mouseY);
}

function windowResized() {
  resizeCanvas(windowWidth * 0.5, windowHeight * 0.5);
}

let isErase = false;

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    // check if right click or left
    if (mouseButton === RIGHT) {
      isErase = true;
      currentCurve = new Curve();
      currentCurve.color = BACKGROUND_COLOR;
      currentCurve.weight = size;
      currentCurve.addPoint(mouseX, mouseY);
      console.log("Erase");
    } else {
      currentCurve = new Curve();
      currentCurve.color = color;
      currentCurve.weight = size;
      currentCurve.addPoint(mouseX, mouseY);
      console.log("Draw");
    }
  }
}

function mouseDragged() {
  if (currentCurve != null) currentCurve.addPoint(mouseX, mouseY);
}

function mouseReleased() {
  // check if curve is not empty
  console.log(currentCurve);
  if (currentCurve != null) {
    console.log("Released");
    curves.push(currentCurve);
    currentCurve = null;
  }
}
