class Herb {
  constructor(startX, startY, startSize, id) {
    this.id = id;
    this.x = startX;
    this.y = startY;
    this.startSize = startSize;
    this.age = 0
    this.birthTime = simTime;
    this.lastRegrowAge = 0;
    this.regrowInterval = random(5, 15);
  }

  spawn() {
    push();
    rectMode(CENTER);
    noStroke();
    fill(120, 255, 100);
    rect(this.x, this.y, this.startSize);
    pop();
  }

  regrow(){
    if(this.age - this.lastRegrowAge >= this.regrowInterval){
      this.lastRegrowAge = this.age;
      this.regrowInterval = random(5, 15);
      


      for(let i = 0; i < 2 ; i++){

        let nx = constrain(random(this.x - 100, this.x + 100), 0, width - 200);
        let ny = constrain(random(this.y - 100, this.y + 100), 0, height);

        if(isGreen(nx, ny)) {
          let p = snapToTileCenter(nx, ny);
          if(!isOccupied(p.x, p.y)){

            weedArray.push(new Herb(p.x, p.y, 10, nextHerbId++));
          }

        }
      
    }
    
  }

    }
    
  update(){
    this.age = simTime - this.birthTime;
  }
}