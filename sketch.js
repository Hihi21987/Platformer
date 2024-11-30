let playerMain, playerSide;
let player1, player2;
let players = [];
let tiles, tilesGroup;
let walls, doors, obj, buttons, saws, endWall;
let buttonCols = ["red", "orange", "yellow", "green", "blue","cyan", "purple", "pink", "tan", "brown"];
let buttonCol = [];
let move = 0;
let end;
let ui = [];
let levelButtons, lives; 
let level = 1;
let open;
let objStart = [];
let wallsPos = [];
let tilemap;
let spriteSheet;
let blockImg;
let sawImg;
let turret, range, bullets, bullet, bulletPosX, bulletPosY, turretSpwn, turrets, ranges;
let spinner;
let pan = true;
let panBack = false;
let moveBack = false;
let hit = false;
let song;
let jumpSound, gunSound, buttonSound, deathSound;
let screen = 0;
let completedLevels = [];

function preload() {
  tilemap = loadImage("assets/tilemap_packed.png");
  spriteSheet = loadImage("assets/ninja.png");
  blockImg = loadImage("assets/block.png");
  sawImg = loadImage("assets/tile_0099.png");
  song = loadSound("sounds/march-of-crabs-265246.mp3");
  jumpSound = loadSound("sounds/jump-15984.mp3");
  gunSound = loadSound("sounds/single-pistol-gunshot-42-40781.mp3");
  buttonSound = loadSound("sounds/button-124476.mp3");
  deathSound = loadSound("sounds/homemadeoof-47509.mp3");
}

function setup() {
  new Canvas();
  world.gravity.y = 10;
  spriteSheet.resize(432, 0);
  sawImg.resize(50, 50);
  song.loop();

  //groups
  tiles = new Group();
  buttons = new Group();
  obj = new Group();
  walls = new Group();
  doors = new walls.Group();
  saws = new Group();
  bullets = new Group();
  turrets = new Group();
  ranges = new Group();
  endWall = new walls.Group();
  
  startScreen();
}

function draw() { 
  if (screen == 1){
  background(100);
    
  //Camera effects
  if (pan) {
    if (playerMain.colliding(tiles)) {
      if (camera.x < end.x && !panBack) {
        camera.moveTo(end.x, height / 2, 2.5);
      } else if (camera.x > playerMain.x) {
        panBack = true;
        camera.moveTo(playerMain.x, height / 2, 25);
      }
      if (camera.x < playerMain.x) {
        pan = false;
      }
    }
  } else {
    camera.x = playerMain.x;
  }

  //Movement
  if (move == "left") {
    playerMain.changeAni("move");
    playerMain.vel.x = -4;
    playerMain.mirror.x = true;
  } else if (move == "right") {
    playerMain.changeAni("move");
    playerMain.vel.x = 4;
    playerMain.mirror.x = false;
  } else if (playerMain.vel.y >= 0) {
    playerMain.changeAni("idle");
  }
  if (!keyIsPressed) {
    playerMain.vel.x = 0;
    move = 0;
  }

  for (let i = 0; i < walls.length; i++) {
    walls[i].x = wallsPos[i] - 50;
  }

  //Button mechanics
  for (let i = 0; i < buttons.length; i++) {
    if (
      buttons[i].colliding(player1) ||
      buttons[i].colliding(player2) ||
      buttons[i].colliding(obj)
    ) {
      open = true;
    }
    if (
      buttons[i].collides(player1) ||
      buttons[i].collides(player2) ||
      buttons[i].collides(obj)
    ) {
      buttonSound.play();
    }
    if (open) {
      doors[i].collider = "none";
      doors[i].stroke = color(220, 220, 220, 0);
      doors[i].color = color(220, 220, 220, 0);
      open = false;
      buttons[i].color = "lime";
    } else {
      doors[i].collider = "static";
      doors[i].stroke = "black";
      buttons[i].color = buttonCol[i];
      doors[i].color = buttons[i].color;
    }
  }

  //turret mechanics
  if (turretSpwn) {
    for (let i = 0; i < turrets.length; i++) {
      if (playerMain.overlapping(ranges[i])) {
        turrets[i].rotateTowards(playerMain, 0.05, 0);
        bulletPosX = turrets[i].x + cos(turrets[i].rotation) * 70;
        bulletPosY = turrets[i].y + sin(turrets[i].rotation) * 70;
        if (frameCount % 30 == 0) {
          bullet = new bullets.Sprite(bulletPosX, bulletPosY, 15, "k");
          gunSound.play();
          bullet.color = "black";
          bullet.mass = 30;
          bullet.moveTo(playerMain.x, playerMain.y, 2);
        }
      } else {
        turrets[i].rotationSpeed = 0;
      }
      for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].vel.x == 0 || bullets[i].collides(allSprites)) {
          if (bullets[i].collide(playerMain)) {
            hit = true;
          }
          bullets[i].remove();
          translate(random(-8, 8), random(-8, 8));
        }
      }
    }
  }

  //Saw mechanics
  saws.rotationSpeed = 25;
  for (let i = 0; i < saws.length; i++) {
    if (saws[i].y < height && !moveBack) {
      saws[i].moveTo(saws[i].x, height/10*9, 4);
    } else if (saws[i].y > 0) {
      saws[i].moveTo(saws[i].x, height/10, 4);
    }
    if (saws[i].y >= height/10*9) {
      moveBack = true;
    }
    if (saws[i].y <= height/10) {
      moveBack = false;
    }
  }
  if (playerMain.collides(saws)) {
    hit = true;
  }
  
  //death
  if (playerMain.y > height || hit) {
    hit = false;
    deathSound.play();
    playerMain.vel.x = 0;
    playerMain.vel.y = 0;
    playerMain.x = playerSide.x;
    playerMain.y = playerSide.y - 50;
    lives[lives.length - 1].remove();
  }

  //object fell off map
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].y > height) {
      obj[i].vel.x = 0;
      obj[i].vel.y = 0;
      obj[i].x = objStart[i].x;
      obj[i].y = objStart[i].y;
    }
  }

  //lose condition
  if (lives.length == 0) {
    reset();
  }

  //win condition
  if (playerMain.overlaps(end)) {
    allSprites.remove();
    completedLevels.push(level);
    startScreen();
  }

  camera.off(); //for ui display
    
  playerMain.overlaps(levelButtons);
  levelButtons.draw();
  lives.draw();
  textAlign(CENTER);
  text("Press s to switch character", width / 2, 25);
  } else{
    box.draw();
    box2.draw();
  }
  for (let i = 0; i < levelButtons.length; i++) {
    if (levelButtons[i].mouse.presses()) {
      level = i + 1;
      allSprites.remove();
      reset();
    }
    if (levelButtons[i].mouse.hovering()){
      levelButtons[i].color = "blue"
      if (screen == 0){
        levelButtons[i].w = min(levelButtons[i].w * 1.1, 70)
      } else{
        levelButtons[i].w = min(levelButtons[i].w * 1.1, 30)
      }
    }else {
      levelButtons[i].color = "yellow"
      if (screen == 0){
        levelButtons[i].w = 50
      } else {
        levelButtons[i].w = max(levelButtons[i].w * 0.99, 25)
      }
    }
    for (let j = 0; j < completedLevels.length; j++) {
      if (i + 1 == completedLevels[j]) {
        levelButtons[i].color = "green";
        levelButtons[i].text = "✔️";
      }
    }
  } 
  levelButtons.draw();
}

function keyPressed() {
  switch (key) {
    case "ArrowLeft":
      move = "left";
      break;
    case "ArrowRight":
      move = "right";
      break;
    case " ":
      if (
        playerMain.colliding(tiles) ||
        playerMain.colliding(playerSide) ||
        playerMain.colliding(obj) ||
        playerMain.colliding(buttons)
      ) {
        playerMain.changeAni("jump");
        jumpSound.play();
        playerMain.vel.y = -height/80 - 3; //jump
      }
      break;
    case "ArrowUp":
      if (
        playerMain.colliding(tiles) ||
        playerMain.colliding(playerSide) ||
        playerMain.colliding(obj) ||
        playerMain.colliding(buttons)
      ) {
        playerMain.changeAni("jump");
        jumpSound.play();
        playerMain.vel.y = -height/80 - 3; //jump
      }
      break;
    case "s": //switch to other sprite
      for (let i = 0; i < players.length; i++) {
        if (playerMain != players[i]) {
          playerSide = playerMain;
          playerMain = players[i];
          playerMain.collider = "dynamic";
          break;
        }
      }
      break;
  }
}

function spawn() {
  player1 = new Sprite(50, height - 50, 72, 73);
  player2 = new Sprite(0, height - 50, 72, 73);
  players.push(player1);
  players.push(player2);
  playerMain = player1;
  playerSide = player2;

  for (let i = 0; i < players.length; i++) {
    players[i].spriteSheet = spriteSheet;
    players[i].anis.frameDelay = 4;
    players[i].anis.offset.y = -10;
    players[i].addAnis({
      idle: { row: 0, frames: 6 },
      move: { row: 1, frames: 6 },
      jump: { row: 3, frames: 5 },
    });
    players[i].changeAni("idle");
    players[i].w = 40;
    players[i].h = 50;

    players[i].rotationLock = true;
  }
  camera.x = playerMain.x;
}

function uiSetup() {
  levelButtons = new Group();
  levelButtons.color = "yellow";
  while (levelButtons.length < 5) {
    levelButton = new levelButtons.Sprite(
      width - (5 - levelButtons.length) * 30,
      25,
      25,
      "static"
    );
    levelButton.text = levelButtons.length;
  }
  ui.push(levelButtons);

  lives = new Group();
  lives.color = "red";
  while (lives.length < 3) {
    life = new lives.Sprite(30 + lives.length * 30, 25, 20, "none");
    life.image = "❤️";
  }
  ui.push(lives);
}

function reset() {
  allSprites.remove();
  screen = 1;
  turretSpwn = false;
  levelSetUp();
  players = [];
  objStart = [];
  wallsPos = [];
  spawn();
  uiSetup();
  pan = true;
  panBack = false;

  for (let i = 0; i < obj.length; i++) {
    objStart.push(createVector(obj[i].x, obj[i].y));
  }
  for (let i = 0; i < walls.length; i++) {
    wallsPos.push(walls[i].x);
  }
  for (let i = 0; i < buttons.length; i++) {
    buttonCol.push(random(buttonCols));
  }
}

function turretSetup(x, y) {
  turret = new Sprite(
    x,
    y,
    [
      [0, 15],
      [60, -7.5],
      [0, -15],
      [-60, -7.5],
      [0, 15],
    ],
    "k"
  );
  turret.addCollider(36, 0, 15);
  turret.addCollider(-24, 0, 30);
  turret.offset.x = 24;
  turret.rotation = 180;
  turret.color = "grey";
  turrets.add(turret);
  range = new Sprite(turret.x - 200, turret.y, 400, 300, "n");
  range.color = color(20, 20, 20, 0);
  ranges.add(range);
  turretSpwn = true;
}

function spinnerSetup(x, y) {
  spinner = new Sprite(
    x,
    y,
    [
      [0, -25],
      [-100, 12.5],
      [0, 25],
      [100, 12.5],
      [0, -25],
    ],
    "k"
  );
  spinner.addCollider(-60, 0, 25);
  spinner.addCollider(40, 0, 50);
  spinner.offset.x = -40;
  spinner.rotationSpeed = 10;
  spinner.color = "brown";
}

function startScreen(){
  screen = 0;
  background(0)
  box = new Sprite(width/2, 100, width, height/5, 'none');
  box.color = color(255,255,255,10);
  box.text = "Start";
  box.textSize = 50;
  box2 = new Sprite(width/2,  height/2 + 100, width, height/3, 'none');
  box2.color = color(255,255,0,10);
  box2.text = "Select your level";
  box2.offset.y = -50;
  box2.textSize = 25;
  levelButtons = new Group();
  levelButtons.color = "yellow";
  while (levelButtons.length < 5) {
    levelButton = new levelButtons.Sprite(width/6 *  (levelButtons.length + 1), height/ 2, 50, "static");
    levelButton.textSize = 40;
    levelButton.text = levelButtons.length;
  }
}

