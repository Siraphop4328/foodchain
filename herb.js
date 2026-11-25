class Herb {
  constructor(startX, startY, startSize, id) {
    this.id = id;
    this.x = startX;
    this.y = startY;
    this.startSize = startSize;
    this.age = 0
    this.birthTime = simTime;
    this.lastRegrowAge = 0;
  }

  spawn() {
    push();
    rectMode(CENTER);
    strokeWeight(0.2);
    fill(120, 255, 100);
    rect(this.x, this.y, this.startSize);
    pop();
  }

  regrow(){
    if(this.age - this.lastRegrowAge >= 10){
      this.lastRegrowAge = this.age;
      


      for(let i = 0; i < 2 ; i++){

        let nx = constrain(random(this.x - 100, this.x + 100), 0, width - 200);
        let ny = constrain(random(this.y - 100, this.y + 100), 0, height);

        if(isGreen(nx, ny)) {
          let p = snapToTileCenter(nx, ny);

          weedArray.push(new Herb(p.x, p.y, 10, nextHerbId++));
        }
      
    }
    
  }

    }
    
  update(){
    this.age = simTime - this.birthTime;
  }
}