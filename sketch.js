let weedEaterArray = [];
let weedArray = [];
let weedEaterEaterArray = [];

let simTime = 0;
let day = simTime / 60;

let endGameTime = 0;
let showSimTime = true;
let nextHerbId = 25;
let nextHerbivoreId = 4;
/// Map

let tileSize = 10;
let scl = 0.05;

let mapLayer;

let waterTiles = [];


// SETTINGS
let startHerbCount = 10;
let startCowCount = 4;
let startHumanCount = 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CORNER);
  colorMode(HSB, 360, 255, 255);
  frameRate(60);

  for (let i = 0; i < startCowCount; i++) {
    weedEaterArray.push(
      new Herbivore(random(0, width - 200), random(0, height), 10, 10, 0.5, i)
    );
  }

  let placed = 0;
  let tries = 0;

  while (placed < startHerbCount && tries < 5000) {
    tries++;
    let p = randomGreenPos();
    if (!isOccupied(p.x, p.y)) {
      weedArray.push(new Herb(p.x, p.y, 10, nextHerbId++));
      placed++;
    }
  }

  for (let i = 0; i < startHumanCount; i++) {
    weedEaterEaterArray.push(
      new Carnivore(random(0, width - 200), random(0, height), 10, 10, 0.55, i)
    );
  }

  //// Map

  mapLayer = createGraphics(width, height);
  mapLayer.colorMode(HSB, 360, 255, 255);
  mapLayer.strokeWeight(0.1);

  rectMode(CORNER);

  for (let i = 0; i < (width - 190) / tileSize; i++) {
    for (let j = 0; j < height / tileSize; j++) {
      mapLayer.fill(getColor(i, j));

      mapLayer.rect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }

  buildWaterTiles();
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

  text(floor(frameRate()), 10, 20);
  text("Herb " + weedArray.length, width - 170, 60);
  text("Cow " + weedEaterArray.length, width - 170, 80);
  text("Human " + weedEaterEaterArray.length, width - 170, 100);
  
  for (let i = 0; i < weedEaterArray.length; i++) {}

  // Spawn Herbs

  let herbCount = weedArray.length;
  for (let i = 0; i < herbCount; i++) {
    weedArray[i].update();
    weedArray[i].regrow();
    weedArray[i].spawn();
  }

  // Spawn Herbivores
  let eaterCount = weedEaterArray.length;
  for (let i = 0; i < eaterCount; i++) {
    let eater = weedEaterArray[i];
    eater.spawn();

    sortPriority(eater);

    // Check Collisions
    for (let j = weedArray.length - 1; j >= 0; j--) {
      let currentHerb = weedArray[j];

      if (checkCollision(eater.x, eater.y, currentHerb.x, currentHerb.y)) {
        console.log("Eater " + eater.id + " ate Herb " + currentHerb.id);

        weedArray.splice(j, 1);
        eater.lastEatTime = min(simTime, eater.lastEatTime + 2);
      }
    }
  }

  for (let i = weedEaterArray.length - 1; i >= 0; i--) {
    weedEaterArray[i].update();

    if (weedEaterArray[i].checkDeath()) {
      weedEaterArray.splice(i, 1);
    }
  }

  // Spawn Carnivore
  for (let i = 0; i < weedEaterEaterArray.length; i++) {
    
    weedEaterEaterArray[i].update();

    weedEaterEaterArray[i].spawn();
    sortCarnivorePriority(weedEaterEaterArray[i]);

    for (let j = weedEaterArray.length - 1; j >= 0; j--) {
      let currentHerbivore = weedEaterArray[j];

      if (checkCollision(weedEaterEaterArray.x, weedEaterEaterArray.y, currentHerbivore.x, currentHerbivore.y)) {
        console.log("Human " + weedEaterEaterArray.id + " ate cow " + currentHerbivore.id);

        weedEaterArray.splice(j, 1);
        weedEaterEaterArray.lastEatTime = min(simTime, weedEaterEaterArray.lastEatTime + 2);
      }
    }
  }
  for (let i = weedEaterEaterArray.length - 1; i >= 0; i--) {
      
  
      if (weedEaterEaterArray[i].checkDeath()) {
        weedEaterEaterArray.splice(i, 1);
      }
    }
}



function checkCollision(ax, ay, bx, by) {
  let d = dist(ax, ay, bx, by);
  return d <= 10;
}

function checkEndGame() {
  return weedEaterArray.length < 1 && weedEaterEaterArray.length < 1;
}

function getColor(x, y) {
  let v = noise(x * scl, y * scl);
  if (v < 0.4) {
    return color(204, 255, v * 255 + 50);
  } else if (v < 0.47) {
    return color(61, 255, v * 255 + 100);
  } else if (v < 0.7) {
    return color(129, 255, v * 255 + 50);
  } else {
    return color(80, 0, v * 400 - 50);
  }
}

function getNoise(px, py) {
  return noise(floor(px / tileSize) * scl, floor(py / tileSize) * scl);
}

function isGreen(px, py) {
  let v = getNoise(px, py);
  return v >= 0.47 && v <= 0.7;
}

function isWater(px, py) {
  return getNoise(px, py) < 0.4;
}

function randomGreenPos() {
  for (let i = 0; i < 1000; i++) {
    let x = random(0, width - 200);
    let y = random(0, height);
    if (isGreen(x, y)) return snapToTileCenter(x, y);
  }
  return snapToTileCenter(random(0, width - 200), random(0, height));
}

function snapToTileCenter(px, py) {
  return createVector(
    floor(px / tileSize) * tileSize + tileSize / 2,
    floor(py / tileSize) * tileSize + tileSize / 2
  );
}

function buildWaterTiles() {
  for (let i = 0; i < width / tileSize; i++) {
    for (let j = 0; j < height / tileSize; j++) {
      if (noise(i * scl, j * scl) < 0.4) {
        waterTiles.push(
          createVector(i * tileSize + tileSize / 2, j * tileSize + tileSize / 2)
        );
      }
    }
  }
}

function findClosestWater(x, y) {
  let closest = null;
  let record = Infinity;
  for (let w of waterTiles) {
    let d = dist(x, y, w.x, w.y);
    if (d < record) {
      record = d;
      closest = w;
    }
  }
  return closest;
}

function isOccupied(x, y) {
  let tx = floor(x / tileSize);
  let ty = floor(y / tileSize);
  return weedArray.some(
    (h) => floor(h.x / tileSize) === tx && floor(h.y / tileSize) === ty
  );
}

function sortPriority(eater) {
  if (eater.hunger > eater.thirst && eater.hunger >= eater.horny) {
    if (weedArray.length > 0) {
      let closest = eater.findClosestHerb(weedArray);
      if (closest != null) eater.moveToTarget(closest.x, closest.y);
    }
  } else if (eater.thirst > eater.hunger && eater.thirst >= eater.horny) {
    let water = findClosestWater(eater.x, eater.y);
    if (water != null) eater.moveToTarget(water.x, water.y);
    if (isWater(eater.x, eater.y)) {
      eater.lastDrinkTime = simTime;
    }
  } else if (eater.age > 10) {
    let mate = eater.findClosestHerbivore(weedEaterArray);
    if (mate != null) {
      eater.moveToTarget(mate.x, mate.y);
      if (isCloseToMate(eater, mate)) {
        weedEaterArray.push(
          new Herbivore(eater.x + 20, eater.y, 10, 10, 0.5, nextHerbivoreId++)
        );
        eater.lastHornyTime = simTime;
        mate.lastHornyTime = simTime;
      }
    }
  }
}

function sortCarnivorePriority(eater) {
  if (eater.hunger > eater.thirst && eater.hunger >= eater.horny) {
    if (weedEaterArray.length > 0) {
      let closest = eater.findClosestHerbivore(weedEaterArray);
      if (closest != null){
        eater.moveToTarget(closest.x, closest.y);

        if(checkCollision(eater.x, eater.y, closest.x, closest.y)){
          let idx = weedEaterArray.indexOf(closest);
          if(idx !== -1) weedEaterArray.splice(idx, 1);
          eater.lastEatTime = simTime;
        }
        
      } 
    }
  } else if (eater.thirst > eater.hunger && eater.thirst >= eater.horny) {
    let water = findClosestWater(eater.x, eater.y);
    if (water != null) eater.moveToTarget(water.x, water.y);
    if (isWater(eater.x, eater.y)) {
      eater.lastDrinkTime = simTime;
    }
    
  } else if (eater.age > 60) {
    
    let mate = eater.findClosestHerbivore(weedEaterEaterArray);
    if (mate != null) {
      eater.moveToTarget(mate.x, mate.y);
      if (isCloseToMate(eater, mate)) {
        weedEaterEaterArray.push(new Carnivore(eater.x + 10, eater.y, 10, 10, 0.55, 0));
        eater.lastHornyTime = simTime;
        mate.lastHornyTime = simTime;
      }
    }
  }
  
}

function isCloseToMate(eater, mate) {
  if (!mate) return false;
  let d = dist(eater.x, eater.y, mate.x, mate.y);
  return d <= 1;
}
