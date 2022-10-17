let w = window.innerWidth,
  h = window.innerHeight;

let vertices_amount = 100;
let NOISE_SCALE = 200; // the higher the softer
let Z_SPEED = 0.007; // noise change per frame

let color_x;
let blobArray = [];
let timeArray = [];

let data = [
  {
    name: "netflix",
    net: 266.97,
    people: 220.7,
    length: 294,
  },
  {
    name: "peacock",
    net: 0.778,
    people: 15,
    length: 30,
  },
  {
    name: "appletv",
    net: 17.5,
    people: 20,
    length: 35,
  },
  {
    name: "disney",
    net: 97,
    people: 221,
    length: 35,
  },
  {
    name: "hulu",
    net: 9.6,
    people: 46.2,
    length: 180,
  },
  {
    name: "paramount",
    net: 1.39,
    people: 32.8,
    length: 19,
  },
  {
    name: "crunchyroll",
    net: 0.04,
    people: 4,
    length: 101,
  },
];

function setup() {
  noStroke();
  createCanvas(w, h);
  rectMode(CENTER);
  frameRate(60);
  color_x = 360;
  for (let x = 0; x < data.length; x++) {
    blobArray.push(new Blobby((x + 1) * 200, 400, data[x].net / 2));
  }
  for (let x = 0; x < data.length; x++) {
    timeArray.push(
      new TimeBoi((x + 1) * 100, 200, data[x].length, data[x].people / 10)
    );
  }
}

function draw() {
  colorMode(HSB);
  background(200); // bg color
  for (let x = 0; x < blobArray.length; x++) blobArray[x].render();
  for (let x = 0; x < timeArray.length; x++) timeArray[x].render();
  for (let x = 0; x < data.length; x++) text(data[x].name, (x + 1) * 200, 300);
}

class Blobby {
  constructor(posX, posY, radius) {
    this.x = posX;
    this.y = posY;
    this.xoff = random(800, 1000);
    this.yoff = random(800, 1000);
    this.zoff = random(800, 1000);
    this.r = radius;
    this.amp = this.r / 1.5; // amplitude
    this.color = color(255, 0, 0);
  }
  render() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.color); // color

    beginShape();
    for (var a = 0; a < TWO_PI; a += TWO_PI / vertices_amount) {
      var x = this.r * sin(a);
      var y = this.r * cos(a);
      circle(x, y, 1);
      let n = noise(
        (this.xoff + x) / NOISE_SCALE,
        (this.yoff + y) / NOISE_SCALE,
        this.zoff
      );
      // console.log(n);
      var new_x = x + n * this.amp * sin(a);
      var new_y = y + n * this.amp * cos(a);
      vertex(new_x, new_y);
    }
    endShape();
    pop();

    this.zoff += Z_SPEED;
  }
}
class TimeBoi {
  constructor(posX, posY, time, people) {
    this.x = posX;
    this.y = posY;
    this.time = time;
    this.people = people;
  }
  render() {
    push();
    translate(this.x, this.y);
    fill(198, 243, 174, 0.0);
    stroke(0);
    strokeWeight(this.people);

    circle(this.x, this.y, this.time);
    pop();
  }
}
