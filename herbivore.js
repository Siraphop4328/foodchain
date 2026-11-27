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
    this.lastDrinkTime = simTime;
    this.thirst = 0;
    this.baseR2 = r2;
    this.color = 255;
    this.thirstRate = 2;
    this.horny = 0;
    this.lastHornyTime = simTime;
  }

  spawn() {
    let scaleFactorSize = map(this.hunger, 0, 100, 1, 0.2);
    scaleFactorSize = constrain(scaleFactorSize, 0.2, 1);

    
    

    this.r2 = this.baseR2 * scaleFactorSize;
   // this.color = cowColor;

    
    if (
      this.horny > this.thirst &&
      this.horny >= this.hunger &&
      this.age > 10
    ) {
      fill(300, 255, 255);
    } else if(this.hunger > this.thirst && this.hunger >= this.horny) {
      fill(100, 255, 255);
    }
    else{
      fill(200, 255, 255);
    }
    
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
    this.thirst = (simTime - this.lastDrinkTime) * this.thirstRate;
    this.horny = (simTime - this.lastHornyTime) * 0.75;
  }

  checkDeath() {
    return this.hunger >= 100 || this.thirst >= 100;
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

  findClosestHerbivore(herbivore) {
    let closestHerbivore = null;
    let recordDistance = Infinity;

    for (let i = 0; i < herbivore.length; i++) {
      if (herbivore[i] == this) continue;
      let d = dist(this.x, this.y, herbivore[i].x, herbivore[i].y);
      if (d < recordDistance) {
        recordDistance = d;
        closestHerbivore = herbivore[i];
      }
    }
    return closestHerbivore;
  }
}
