
let curves = [];

const BACKGROUND_COLOR = 245;
let currentCurve = null;
let lastDelCurve = null;
let color = 0;
let size = 10;
let undoStack = [];

var canvas;
var socket;

function setup() {
  canvas = createCanvas(windowWidth * 0.5, windowHeight * 0.5);
  socket = new WebSocket("wss://drawing-game-g8gh.onrender.com");

  socket.onopen = ()=>{
    console.log("Connected to server");
  };

  socket.onmessage = (event)=>{
    if (typeof(event.data) == "string" && event.data == "clear"){
      console.log(event.data);
      curves = [];
    }
    
    if (typeof(event.data) == "string" && event.data == "undo"){
      console.log(event.data);
      let lastDelCurve = curves.pop();
      undoStack.push(lastDelCurve);
    }

    if (typeof(event.data) == "string" && event.data == "redo"){
      console.log(event.data);
      curve = undoStack.pop();
      curves.push(curve);
    }

    if (typeof(event.data) == "string"){
      console.log(event.data);
    }
    if (typeof(event.data) == "object") {
      console.log("Received a curve");
      let curve = event.data.text();
      curve.then((data)=>{
        let receivedCurve = new Curve();
        const curveData = JSON.parse(data);
        receivedCurve.type = curveData.type;
        receivedCurve.color = curveData.color;
        receivedCurve.weight = curveData.weight;
        receivedCurve.points = curveData.points;
        curves.push(receivedCurve);
      })
    }
  }

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
    socket.send("clear");
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
      socket.send("undo");
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
      socket.send("redo");
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
  const senddata = (data)=>{
    socket.send(data);
  }

  console.log(currentCurve);
  data = JSON.stringify(currentCurve);
  senddata(data);
  if (currentCurve != null) {
    console.log("Released");
    curves.push(currentCurve);
    currentCurve = null;
  }
}
