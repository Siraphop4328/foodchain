let weedEaterArray = [];
let weedArray = [];

let simTime = 0;

let endGameTime = 0;
let showSimTime = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  frameRate(60);

  for (let i = 0; i < 4; i++) {
    weedEaterArray.push(
      new Herbivore(random(0, width - 200), random(0, height), 10, 10, 1, i)
    );
  }

  for (i = 0; i < 10; i++) {
    weedArray.push(new Herb(random(0, width - 200), random(0, height), 10, i));
  }
}

function draw() {
  background(255);

  simTime = millis() / 1000;
  // Make UI
  rectMode(CORNER);
  fill(0);
  rect(width - 180, 0, 1000);
  fill(255);
  textSize(16);
  if (checkEndGame() && showSimTime) {
    endGameTime = simTime;

    showSimTime = false;
  }
  if (showSimTime) {
    text("sim time: " + nf(simTime, 0, 2) + " s", width - 170, 20);
  } else {
    text("Time: " + nf(endGameTime, 0, 2) + " s", width - 170, 20);
  }

  text("Herb " + weedArray.length, width - 170, 60);
  text("Cow " + weedEaterArray.length, width - 170, 80);

  for (let i = 0; i < weedEaterArray.length; i++) {
    text(
      weedEaterArray[i].id + " age: " + nf(weedEaterArray[i].age, 0, 1),
      width - 170,
      100 + 20 * i
    );
    text(weedEaterArray[i].hunger, width - 80, 100 + 20 * i);
  }

  // Spawn Herbs
  rectMode(CENTER);
  for (let i = 0; i < weedArray.length; i++) {
    weedArray[i].spawn();
  }

  // Spawn Herbivores
  for (let i = 0; i < weedEaterArray.length; i++) {
    let eater = weedEaterArray[i];
    eater.spawn();

    // Move Herbivores herb
    if (weedArray.length > 0) {
      let closest = eater.findClosestHerb(weedArray);
      if (closest != null) {
        eater.moveToTarget(closest.x, closest.y);
      }
    }

    // Check Collisions
    for (let j = weedArray.length - 1; j >= 0; j--) {
      let currentHerb = weedArray[j];

      if (checkCollision(eater.x, eater.y, currentHerb.x, currentHerb.y)) {
        console.log("Eater " + eater.id + " ate Herb " + currentHerb.id);

        weedArray.splice(j, 1);
        eater.lastEatTime = min(simTime, eater.lastEatTime + 10);
      }
    }

    for (let i = weedEaterArray.length - 1; i >= 0; i--) {
      weedEaterArray[i].update();

      if (weedEaterArray[i].checkDeath()) {
        weedEaterArray.splice(i, 1);
      }
    }
  }
}

class Herbivore {
  constructor(startX, startY, r1, r2, speed, id) {
    this.id = id;
    this.x = startX;
    this.y = startY;
    this.r1 = r1;
    this.r2 = r2;
    this.speed = speed;
    this.age = 0;
    this.birthTime = simTime;
    this.lastEatTime = simTime;
    this.hunger = 0;
  }

  spawn() {
    fill(255);
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

  update() {
    this.age = simTime - this.birthTime;
    this.hunger = simTime - this.lastEatTime;
  }

  checkDeath() {
    return this.age >= 60 || this.hunger >= 10;
  }

  findClosestHerb(herbs) {
    let closestHerb = null;
    let recordDistance = Infinity;

    for (let i = 0; i < herbs.length; i++) {
      let d = dist(this.x, this.y, herbs[i].x, herbs[i].y);
      if (d < recordDistance) {
        recordDistance = d;
        closestHerb = herbs[i];
      }
    }
    return closestHerb;
  }
}

class Herb {
  constructor(startX, startY, startSize, id) {
    this.id = id;
    this.x = startX;
    this.y = startY;
    this.startSize = startSize;
  }

  spawn() {
    fill(0, 200, 0);
    rect(this.x, this.y, this.startSize);
  }
}

function checkCollision(ax, ay, bx, by) {
  let d = dist(ax, ay, bx, by);
  return d <= 10;
}

function checkEndGame() {
  return weedEaterArray.length < 1;
}
