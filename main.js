const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const bcr = canvas.getBoundingClientRect()

function Point(x,y) {
  this.x = x
  this.y = y
}

function angle(points) {
 let dx = map
}

function Line(points) {
  this.points = points
  this.draw = function() {
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y)
    ctx.lineTo(this.points[1].x, this.points[1].y)
    ctx.stroke()
    ctx.closePath()
  }
  this.d = [this.points[1].x-this.points[0].x,this.points[1].y-this.points[0].y]
  this.len = Math.sqrt(this.d.map(l => l*l).reduce((a,x)=>a+x))
  this.sin = function(other) {
   return (this.d[0]*other.d[1] - this.d[1] * other.d[0])/this.len/other.len
  }
  this.cos = function(other) {
   return (this.d[0]*other.d[0] + this.d[1] * other.d[1])/this.len/other.len
  }
  this.rotate = function(angle) {
    const newDirection = [this.d[0]*Math.cos(angle) + this.d[1]*Math.sin(angle),
    this.d[1]*Math.cos(angle) + this.d[0]*Math.sin(angle)]
    const newPoint = new Point(this.points[0].x + newDirection[0],
                               this.points[0].y + newDirection[1])
    return new Line([this.points[0], newPoint])
  }
  this.reverse = function() {
    return new Line(this.points.reverse())
  }
}

function Triangle(points, color="#C0C080") {
  this.points = points
  this.color = color
  this.draw = function() {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.moveTo(this.points[0].x, this.points[0].y)
    ctx.lineTo(this.points[1].x, this.points[1].y)
    ctx.lineTo(this.points[2].x, this.points[2].y)
    ctx.lineTo(this.points[0].x, this.points[0].y)
    ctx.stroke()
    ctx.fill()
  }
  this.sides = [new Line([this.points[0],this.points[1]]),
                new Line([this.points[1],this.points[2]]),
                new Line([this.points[2],this.points[0]])]

  this.drawHalfAngle = function() {
    const sin = new Line(this.points.slice(0,2).reverse()).sin(new Line(this.points.slice(1,3)))
    const cos = new Line(this.points.slice(0,2).reverse()).cos(new Line(this.points.slice(1,3)))
    const angle = Math.atan2(sin,cos)
    this.sides[0].reverse().rotate(Math.abs(angle)/2).draw()
  }
}

function Angle(points, color="#80C0C0") {
  this.points = points
  this.color = color
  this.draw = function() {
    ctx.fillStyle = this.color
    ctx.beginPath()
    let x1 = this.points[1].x + (this.points[2].x-this.points[1].x)*10
    let y1 = this.points[1].y + (this.points[2].y-this.points[1].y)*10
    let x2 = this.points[1].x + (this.points[0].x-this.points[1].x)*10
    let y2 = this.points[1].y + (this.points[0].y-this.points[1].y)*10
    ctx.moveTo(x1,y1)
    ctx.lineTo(this.points[1].x, this.points[1].y)
    ctx.lineTo(x2,y2)
    ctx.lineTo(x1,y1)
    ctx.fill()
  }
}

let points = []
let elems = []
let lastPos = Point(0,0)
function addPoint(point) {
  points.push(point)
  if (points.length == 2)
   elems.push(new Line(points))
  if (points.length >= 3) {
   elems.pop()
   elems.push(new Triangle(points))
   points = []
  }
}

function redraw() {
  ctx.fillStyle = "#C0C0F0"
  ctx.fillRect(0,0,800,800)
  for (elem of elems)
    elem.draw()
}

function canvasClick(e) {
  let x = e.clientX - bcr.left
  let y = e.clientY - bcr.top
  lastPos = new Point(x, y)
  addPoint(lastPos)
  redraw()
}

function canvasMove(e) {
  redraw()
  let x = e.clientX - bcr.left
  let y = e.clientY - bcr.top
  if (points.length == 1)
    new Line([points[0], new Point(x, y)]).draw()
  if (points.length == 2)
    new Triangle([...points, new Point(x, y)], '#D0D0FF').draw()
}

function init() {
  canvas.onclick = canvasClick
  canvas.addEventListener('mousemove', canvasMove)
  ctx.strokeStyle = "#000000"
  elems = []
  redraw()
}

init()

// canvas.addEventListener('mousedown',canvasClick)
// mousedown, mouseup, mousemove


