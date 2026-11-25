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
    this.hunger >= 100;
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