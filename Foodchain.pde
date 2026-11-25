let weedEaterArray = [];
let weedArray = [];

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  frameRate(60);

  weedEaterArray.push(new Herbivore(100, 100, 10, 10, 1));
  weedEaterArray.push(new Herbivore(120, 200, 10, 10, 1));

  weedArray.push(new Herb(random(0, 400), random(0, 400), 10));
}

function draw() {
  background(255);

  let targetHerb = weedArray[0];
  

  for (i = 0; i < weedEaterArray.length; i++) {
    weedEaterArray[i].spawn();
  }

  if (weedArray.length > 0) {
    for (i = 0; i < weedEaterArray.length; i++) {

      let eater = weedEaterArray[i];
      weedEaterArray[i].moveToTarget(targetHerb.x, targetHerb.y);

      weedArray[0].spawn();

      if (checkCollision(targetHerb.x, targetHerb.y, eater.x, eater.y)) {
      weedArray.splice(0, 1);
      console.log("eaten");
      weedArray.push(new Herb(random(0, 400), random(0, 400), 10));
    }
    }

    
  }
}

class Herbivore {
  constructor(startX, startY, r1, r2, speed) {
    this.x = startX;
    this.y = startY;
    this.r1 = r1;
    this.r2 = r2;
    this.speed = speed;
    this.age = 0;
  }

  spawn() {
    ellipse(this.x, this.y, this.r1 * 2, this.r2 * 2);
  }
  moveToTarget(targetX, targetY) {
    let dx = targetX - this.x;
    let dy = targetY - this.y;
    let d = dist(this.x, this.y, targetX, targetY);

    if (d > 1) {
      this.x += (dx / d) * this.speed;
      this.y += (dy / d) * this.speed;
    }
  }
}

class Herb {
  constructor(startX, startY, startSize) {
    this.x = startX;
    this.y = startY;
    this.startSize = startSize;
  }

  spawn() {
    rect(this.x, this.y, this.startSize);
  }
}

function checkCollision(ax, ay, bx, by) {
  let d = dist(ax, ay, bx, by);
  return d <= 10;
}
