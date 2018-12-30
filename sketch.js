/** Class representing a single segment of Koch curve
* @param {p5.Vector} start
* @param {p5.Vector} end
* @param {number} depth
*/
class Segment {
  constructor(start, end, depth = 0) {
    this.a = start
    this.e = end
    let dist = p5.Vector.sub(end, start),
      quarter = p5.Vector.div(dist, 4),
      third = p5.Vector.div(dist, 3),
      half = p5.Vector.div(dist, 2)
    this.b0 = p5.Vector.add(quarter, start)
    this.b1 = p5.Vector.add(third, start)
    this.c0 = p5.Vector.add(half, start)
    this.c1 = p5.Vector.add(half, start).add(third.copy().rotate(-HALF_PI))
    this.d0 = p5.Vector.sub(end, quarter)
    this.d1 = p5.Vector.sub(end, third)
    this.innerSegments = []
    this.depth = depth
  }

  fillInnerSegments() {
    this.innerSegments.push(
      new Segment(this.a, this.b1, this.depth - 1),
      new Segment(this.b1, this.c1, this.depth - 1),
      new Segment(this.c1, this.d1, this.depth - 1),
      new Segment(this.d1, this.e, this.depth - 1)
    )
  }

  draw () {
    if (this.depth === 0) {
      line(this.a.x, this.a.y, this.e.x, this.e.y)
    } else if (this.depth < 1) {
      let b = p5.Vector.lerp(this.b0, this.b1, this.depth),
        c = p5.Vector.lerp(this.c0, this.c1, this.depth),
        d = p5.Vector.lerp(this.d0, this.d1, this.depth)
      stroke(255, 200, 200)
      line(this.a.x, this.a.y, b.x, b.y)
      stroke(200, 255, 240)
      line(b.x, b.y, c.x, c.y)
      stroke(255, 240, 200)
      line(c.x, c.y, d.x, d.y)
      stroke(200, 240, 255)
      line(d.x, d.y, this.e.x, this.e.y)
    } else {
      this.innerSegments.forEach(s => s.draw())
    }
  }
  get depth () {
    return this._depth
  }
  set depth (d) {
    this._depth = Math.max(0, d)
    if (d >= 1) {
      if (this.innerSegments.length === 0) {
        this.fillInnerSegments()
      }
      this.innerSegments.forEach(s => s.depth = d - 1)
    }
  }
}

let segments = []
let speedSlider
let depthSlider

function setup () {
  createCanvas(windowWidth / 2, windowHeight/2)
  stroke(0)
  let offset = createVector(1, 0).mult(windowHeight/5).rotate(TAU/4)
    centre = createVector(windowWidth / 4, windowHeight / 4)

  for (let i = 0; i < 3; i++) {
    segments.push(
      new Segment(
        p5.Vector.add(centre, offset),
        p5.Vector.add(centre, offset.rotate(TAU / 3))))
  }

  createDiv('Speed')
  speedSlider = createSlider(100, 865, 300)
  createDiv('Depth')
  depthSlider = createSlider(0, Math.E, 1.5, 0.01)
  createA('https://github.com/stellartux/CC129', 'Source Code')

}

function draw () {
  clear()
  let d = (1 + sin(millis() / (1001 - speedSlider.value()))) * depthSlider.value()
  setDepth(d)
  segments.forEach(s => s.draw())
}

function setDepth (d) {
  segments.forEach(s => s.depth = d)
}
