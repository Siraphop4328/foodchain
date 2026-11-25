let weedEaterArray = [];
let weedArray = [];

let simTime = 0;

let endGameTime = 0;
let showSimTime = true;
let nextHerbId = 10;

/// Map

let tileSize = 10;
let scl = 0.05;

let mapLayer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CORNER);
  colorMode(HSB, 360, 255, 255);
  frameRate(60);

  for (let i = 0; i < 4; i++) {
    weedEaterArray.push(new Herbivore(random(0, width - 200), random(0, height), 10, 10, 1, i));
  }

  for (let i = 0; i < 25; i++) {
    let p = randomGreenPos();
    weedArray.push(new Herb(p.x, p.y, 10, i));
  }




//// Map

mapLayer = createGraphics(width, height);
mapLayer.colorMode(HSB, 360, 255, 255);
mapLayer.strokeWeight(0.1);

  rectMode(CORNER);
  
  for(let i = 0; i < width/tileSize; i++){
  for(let j = 0; j < height/tileSize; j++){
    mapLayer.fill(getColor(i, j));

    mapLayer.rect(i * tileSize, j * tileSize, tileSize, tileSize);
  }
}

  }



function draw() {
  background(255);

  // Map
  
  image(mapLayer, 0, 0);
  










  simTime = millis() / 1000;
  // Make UI
  rectMode(CORNER);
  fill(0);
  rect(width - 180, 0, 2000);
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
    text(weedEaterArray[i].id + " age: " + nf(weedEaterArray[i].age, 0, 1), width - 170,
        100 + 20 * i);
    text(weedEaterArray[i].hunger, width - 80, 100 + 20 * i);
  }

  // Spawn Herbs
  
  let herbCount = weedArray.length;
  for (let i = 0; i < herbCount; i++) {
    weedArray[i].update();
    weedArray[i].regrow();
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

function checkCollision(ax, ay, bx, by) {
  let d = dist(ax, ay, bx, by);
  return d <= 10;
}

function checkEndGame() {
  return weedEaterArray.length < 1;
}

function getColor(x, y){
  let v = noise(x * scl, y * scl);
  if(v < 0.4) {
    return color(204, 255, 255);
  } 
  else if(v < 0.5) {
    return color(61, 255, 150);
  }
  else if(v < 0.7) {
    return color(129, 255, 200);
  }
  //else {
   // return color(80, 0, 200);
 // }
}

function getNoise(px, py) {
  return noise(floor(px / tileSize) * scl, floor(py / tileSize) * scl);
}

function isGreen(px, py) {
  let v = getNoise(px, py);
  return v >= 0.5 && v <= 0.7;
}

function randomGreenPos(){
  for(let i = 0; i < 1000; i++){
    let x = random(0, width - 200);
    let y = random(0, height);
    if(isGreen(x, y)) return snapToTileCenter(x, y);
  }
  return snapToTileCenter(random(0, width - 200), random(0, height));
}

function snapToTileCenter(px, py) {
  return createVector(
    floor(px / tileSize) * tileSize + tileSize / 2,
    floor(py / tileSize) * tileSize + tileSize / 2
    
  );
}