class Curve {
  constructor() {
    this.points = [];
    this.color = "black";
    this.weight = 10;
  }

  addPoint(X, Y) {
    this.point = { x: X, y: Y };
    this.points.push(this.point);
  }

  drawCurve() {
    noFill();
    stroke(this.color);
    strokeWeight(this.weight);
    beginShape();
    if (this.points.length == 1) {
      point(this.points[0].x, this.points[0].y);
    } else {
      this.points.forEach((p) => {
        curveVertex(p.x, p.y);
      });
    }
    endShape();
  }
}
