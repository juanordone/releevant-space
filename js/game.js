/**
 * Variables used during the game.
 */
let player;
let enemy;
let cursors;
let background1;
let background2;
let spaceBar;
let bullet = [];
let contBullet = 0;
let frame = -1;
let score = 0;
let scoreText;
let explosion;
let sonidoDisparo;

/**
 * It prelaods all the assets required in the game.
 */
function preload() {
  this.load.image("sky", "assets/backgrounds/blue.png");
  this.load.image("player", "assets/characters/player.png");
  this.load.image("enemy", "assets/characters/alien3.png");
  this.load.image("red", "assets/particle/red.png");
  this.load.audio("fondo", "assets/sounds/fondo.mp3");
  this.load.audio("disparo", "assets/sounds/disparo.mp3");
}

/**
 * It creates the scene and place the game objects.
 */
function create() {
  // scene background
  background1 = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, "sky");
  background2 = this.add.image(
    SCREEN_WIDTH / 2,
    SCREEN_HEIGHT / 2 - background1.height,
    "sky"
  );
  //musica de fondo
  let sonidoFondo = this.sound.add("fondo");
  sonidoFondo.loop = true;
  sonidoFondo.play();

  // disparo
  sonidoDisparo = this.sound.add("disparo");

  // playet setup
  player = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT, "player");
  player.setX((SCREEN_WIDTH - player.width * PLAYER_SCALE) / 2);
  player.setY(SCREEN_HEIGHT - (player.height * PLAYER_SCALE) / 2);
  player.setScale(PLAYER_SCALE);

  // enemy setup
  enemy = this.add.image(SCREEN_WIDTH / 2, SCREEN_HEIGHT, "enemy");
  enemy.setX((SCREEN_WIDTH - enemy.width * ENEMY_SCALE) / 2);
  enemy.setY((enemy.height * ENEMY_SCALE) / 2);
  enemy.setScale(ENEMY_SCALE);

  //cursors map into game engine
  cursors = this.input.keyboard.createCursorKeys();

  //map space key status
  spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  //partiulas

  explosion = this.add.particles("red").createEmitter({
    scale: { min: 0.5, max: 0 },
    speed: { min: -100, max: 100 },
    quantity: 1,
    frequency: 0.1,
    lifespan: 100,
    gravityY: 0,
    on: false,
  });

  //Texto Score
  scoreText = this.add.text(5, 5, "Score: 0", {
    font: "32px Arial",
    fill: "#0095DD",
  });
}

/**
 * Updates each game object of the scene.
 */
function update() {
  this.add.ellipse(
    player.x,
    player.y - (player.height / 2) * PLAYER_SCALE,
    180,
    200
  );
  moverPlayer();
  moverFondo();
  if (frame < 0) {
    disparar(this);
  }
  if (contBullet > 0) {
    moverBala();
  }
  frame--;
}

function moverPlayer() {
  if (cursors.left.isDown) {
    let xPlayer = player.x - PLAYER_VELOCITY;
    if (xPlayer < (player.width / 2) * PLAYER_SCALE) {
      xPlayer = (player.width / 2) * PLAYER_SCALE;
    }
    player.setX(xPlayer);
  } else if (cursors.right.isDown) {
    let xPlayer = player.x + PLAYER_VELOCITY;
    if (xPlayer > SCREEN_WIDTH - (player.width / 2) * PLAYER_SCALE) {
      xPlayer = SCREEN_WIDTH - (player.width / 2) * PLAYER_SCALE;
    }
    player.setX(xPlayer);
  }
  if (cursors.up.isDown) {
    let yPlayer = player.y - PLAYER_VELOCITY;
    if (yPlayer < (player.height / 2) * PLAYER_SCALE) {
      yPlayer = (player.height / 2) * PLAYER_SCALE;
    }
    player.setY(yPlayer);
  } else if (cursors.down.isDown) {
    let yPlayer = player.y + PLAYER_VELOCITY;
    if (yPlayer > SCREEN_HEIGHT - (player.height / 2) * PLAYER_SCALE) {
      yPlayer = SCREEN_HEIGHT - (player.height / 2) * PLAYER_SCALE;
    }
    player.setY(yPlayer);
  }
}

function moverFondo() {
  background1.setY(background1.y + BACKGROUND_VELOCITY);
  background2.setY(background2.y + BACKGROUND_VELOCITY);

  if (background1.y > background1.height + SCREEN_HEIGHT / 2) {
    background1.setY(background2.y - background1.height);
    let temp = background1;
    background1 = background2;
    background2 = temp;
  }
}

function disparar(engine) {
  if (spaceBar.isDown) {
    sonidoDisparo.play();
    bullet.push(
      engine.add.ellipse(
        player.x,
        player.y - (player.height / 2) * PLAYER_SCALE,
        5,
        10,
        0xff9900
      )
    );
    contBullet++;
    frame = 12;
  }
}

function moverBala() {
  let index = -1;
  for (i = 0; i < bullet.length; i++) {
    bullet[i].setY(bullet[i].y - BULLET_VELOCITY);
    if (bullet[i].y < 0) {
      bullet[i].destroy();
      index = i;
    }
    colision(bullet[i]);
  }
  if (index >= 0) {
    bullet.splice(index, 1);
  }
}

function colision(bala) {
  if (
    bala.x >= enemy.x - (enemy.width * ENEMY_SCALE) / 2 &&
    bala.x <= enemy.x + (enemy.width * ENEMY_SCALE) / 2 &&
    bala.y >= enemy.y - (enemy.height * ENEMY_SCALE) / 2 &&
    bala.y <= enemy.y + (enemy.height * ENEMY_SCALE) / 2
  ) {
    collectEnemy(bala, enemy);
    explosion.setPosition(enemy.x, enemy.y);
    explosion.explode();
    enemy.setX(
      Math.random() * (SCREEN_WIDTH - enemy.width * ENEMY_SCALE) +
        (enemy.width / 2) * ENEMY_SCALE
    );
  } else {
    // No collision
  }
}

function collectEnemy(bala, enemy) {
  contador = 24;
  score += 10;
  scoreText.setText("Score:" + score);
}
