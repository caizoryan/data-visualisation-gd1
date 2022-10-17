let vertices_amount = 100;
let NOISE_SCALE = 15; // the higher the softer
let Z_SPEED = 0.007; // noise change per frame

let color_x;
let blobArray = [];
let timeArray = [];

let data = [
  {
    name: "Netflix",
    net: 266.97,
    people: 220.7,
    length: 294,
  },
  {
    name: "Peacock",
    net: 0.778,
    people: 15,
    length: 30,
  },
  {
    name: "Apple Tv+",
    net: 17.5,
    people: 20,
    length: 35,
  },
  {
    name: "Disney+",
    net: 97,
    people: 221,
    length: 35,
  },
  {
    name: "Hulu",
    net: 9.6,
    people: 46.2,
    length: 180,
  },
  {
    name: "Paramount",
    net: 1.39,
    people: 32.8,
    length: 19,
  },
  // {
  //   name: "Crunchyroll",
  //   net: 0.04,
  //   people: 4,
  //   length: 101,
  // },
];
function setup() {
  noStroke();
  createCanvas(window.innerWidth, window.innerHeight);
  rectMode(CENTER);

  for (let x = 0; x < data.length; x++) {
    blobArray.push(
      new Corporation(
        (x + 1) * 200,
        350,
        data[x].name,
        data[x].length,
        data[x].net,
        data[x].people
      )
    );
  }
}

function draw() {
  background(255);
  // ob.render();
  for (let x = 0; x < blobArray.length; x++) blobArray[x].render();
}

class Blobby {
  constructor(posX, posY, radius) {
    this.x = posX;
    this.y = posY;
    this.xoff = random(800, 1000);
    this.yoff = random(800, 1000);
    this.zoff = random(800, 1000);
    this.r = radius;
    this.amp = this.r * 1.5; // amplitude
    this.color = color(random(150, 255), 0, 0);
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
      var new_x = x + n * this.amp * sin(a);
      var new_y = y + n * this.amp * cos(a);
      vertex(new_x, new_y);
    }
    endShape();
    pop();

    this.zoff += Z_SPEED;
  }
}
class Corporation {
  constructor(posX, posY, name, time, money, people) {
    this.posX = posX;
    if (money > 9)
      this.money = new MoreBlobby(posX, posY - money, money, 10, 15);
    else this.money = new Blobby(posX, posY, money);
    this.time = new TimeRing(posX / 2, posY / 2, time);
    this.people = new MultiPeople(posX, posY, people, time);
    this.name = name;
  }
  render() {
    this.money.render();
    this.time.render();
    this.people.render();
    text(this.name, this.posX, 50);
    stroke(0);
    strokeWeight(0.1);
    line(this.posX, 0, this.posX, height);
  }
}
class TimeRing {
  constructor(posX, posY, time) {
    this.x = posX;
    this.y = posY;
    this.time = time;
  }
  render() {
    push();
    translate(this.x, this.y);
    fill(198, 243, 174, 0.0);
    stroke(227, 207);
    strokeWeight(10);

    circle(this.x, this.y, this.time);

    pop();
  }
}
class MoreBlobby {
  constructor(posX, posY, money, length, margin) {
    this.length = length;
    this.margin = margin;
    this.posX = posX;
    this.posY = posY;
    this.money = money;
    this.arr = [];
    this.generate();
  }
  generate() {
    let tempMoney = this.money;
    let count = 0;
    while (tempMoney > 1) {
      let amount;
      if (tempMoney > 10) amount = random(3, 10);
      else amount = 3;
      this.arr.push(
        new Blobby(
          this.posX + count * this.margin,
          this.posY + random(-10, 10),
          amount
        )
      );
      tempMoney -= amount;
      count++;
      if (count * this.margin > this.length) {
        count = 0;
        this.posY += this.margin;
      }
    }
  }
  render() {
    for (const x of this.arr) x.render();
  }
}
class People {
  constructor(posX, posY, people, time) {
    this.xoff = 0;
    this.yoff = 2;
    this.phase = 0.1;
    this.noiseSin = 0.01;
    this.noiseMax = 0.01;

    this.people = people;
    this.posX = posX;
    this.posY = posY;
    this.time = time;
  }
  render() {
    push();
    translate(this.posX, this.posY);
    noStroke();
    fill(0);

    for (let i = 0; i < TWO_PI; i += this.people / 120) {
      this.xoff = map(cos(i + this.phase), -1, 1, 0, this.noiseMax);
      this.yoff = map(sin(i + this.phase), -1, 1, 0, this.noiseMax);
      let r = map(
        noise(this.xoff, this.yoff),
        0,
        1,
        this.time - this.people,
        this.time
      );
      let x = r * cos(i);
      let y = r * sin(i);
      circle(x, y, 1.3);
      this.xoff += 0.01;
    }

    this.noiseSin += 0.001;
    this.noiseMax = sin(this.noiseSin) * 5;
    pop();
  }
}

class MultiPeople {
  constructor(posX, posY, people, time) {
    this.people = people;
    this.posX = posX;
    this.posY = posY;
    this.time = time;
    this.arr = [];
    this.generate();
  }
  generate() {
    let temp = this.people;

    let count = 0;
    while (temp > 10) {
      let amount = random(10, 15);
      if (this.people > 30) {
        this.arr.push(new People(this.posX, this.posY, amount, 50 + count * 5));
        temp -= amount;
        count++;
      } else {
        this.arr.push(new People(this.posX, this.posY, temp, 50 + count * 5));
        temp = 0;
      }
    }
  }
  render() {
    for (const x of this.arr) x.render();
  }
}
