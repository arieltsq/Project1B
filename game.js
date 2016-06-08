// Create the canvas

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 600;
// canvas.style = "border: 4px solid black; position:absolute; left: 50%; width: 400px; margin-left: -200px; margin-top: 100px";
canvas.style = 'left: 50%; margin-left: 8% ';

document.body.appendChild(canvas);

// Background Images
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = 'images/bg.png';

// Bird Images
var BirdReady = false;
var BirdImage = new Image();
BirdImage.onload = function () {
  BirdReady = true;
};
BirdImage.src = 'images/bird2.png';

// Seeds Images
var seedsReady = false;
var seedsImage = new Image();
seedsImage.onload = function () {
  seedsReady = true;
};
seedsImage.src = 'images/seeds.png';

// Bomb Image
var bombReady = false;
var bombImage = new Image();
bombImage.onload = function () {
  bombReady = true;
};
bombImage.src = 'images/bomb.png';

var bird = {
  speed: 500 //movement in pixels per second
};
//an objects of seeds
// var bombs = {};
var bombArray = [];
var seeds = {};
var bombsCaught = false;
var seedsCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

// Reset the game when the bird eats a seed

function Reset () {
 // throw the monster somwehere on the screen randomly

  seeds.x = 32 + (Math.random() * (canvas.width - 64));
  seeds.y = 32 + (Math.random() * (canvas.height - 80));
  var bombs = {};
  bombs.x = 32 + (Math.random() * (canvas.width - 64));
  bombs.y = 32 + (Math.random() * (canvas.height - 80));
  bombArray.push(bombs);
  keysDown = {};
}

function startGame () {
  bird.x = canvas.width / 4;
  bird.y = canvas.height / 2;
}

// Update game objects

function Update (modifier) {
  if (38 in keysDown) {
    // this is when player is holding up
    bird.y -= bird.speed * modifier;
    var rockTop = 0;
    if (bird.y < rockTop) {
      bird.y = rockTop;
    }
  }
  if (40 in keysDown) {
    // this is when player is holding down
    // bird.y += bird.speed * modifier;
    bird.y += bird.speed * modifier;
    var rockBottom = canvas.height - 60;
    if (bird.y > rockBottom) {
      bird.y = rockBottom;
    }
  }
  if (37 in keysDown) {
    // player holding left button
    bird.x -= bird.speed * modifier;
    var rockLeft = 0;

    if (bird.x < rockLeft) {
      bird.x = rockLeft;
    }
  }
  if (39 in keysDown) {
    // player holding right
    bird.x += bird.speed * modifier;
    var rockRight = canvas.width - 60;

    if (bird.x > rockRight) {
      bird.x = rockRight;
    }
  }

// Have the birds ate the seeds up?

  if (
		bird.x <= (seeds.x + 32) &&
     seeds.x <= (bird.x + 32) && bird.y <= (seeds.y + 32) && seeds.y <= (bird.y + 32)) {
    ++seedsCaught;
    Reset();
  }
  for(var i=0; i < bombArray.length; i++){
  if (
		bird.x <= (bombArray[i].x + 32) &&
     bombArray[i].x <= (bird.x + 32) && bird.y <= (bombArray[i].y + 32) && bombArray[i].y <= (bird.y + 32)) {
       bombsCaught = true;
    bombArray.splice(i);
    checkBomb();
    Reset();
  }
}
  // if (
  //   bird.x <= (bombs.x + 32) &&
  //    bombs.x <= (bird.x + 32) && bird.y <= (bombs.y + 32) && bombs.y <= (bird.y + 32)) {
  //   ++bombsCaught;
  //   checkBomb();
  //   Reset();
  // }
}

// Draw or rather show everything
// We call this in the main function
function Render () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (BirdReady) {
    ctx.drawImage(BirdImage, bird.x, bird.y);
  }
  if (seedsReady) {
    ctx.drawImage(seedsImage, seeds.x, seeds.y);
  }
  // if (bombReady) {
  //   ctx.drawImage(bombImage, bombs.x, bombs.y);
  // }
  for (var i = 0; i < bombArray.length; i++) {
  ctx.drawImage(bombImage, bombArray[i].x, bombArray[i].y);
  }


  // Score board style
  ctx.fillStyle = 'rgb(250,250,250';
  ctx.color = 'white';
  ctx.font = '30px Georgia';
  ctx.fontWeight = '400';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Seeds Eaten: ' + seedsCaught, 50, 50);

  // Bombs Caught
  ctx.fillStyle = 'rgb(250,250,250';
  ctx.color = 'white';
  ctx.font = '30px Georgia';
  // ctx.fontWeight = '400';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText('Bomb Caught: ' + bombsCaught, 800, 50);
}

// The main game loop
function Main () {
  var now = Date.now();
  var delta = now - then;
  Update(delta / 1000);
  Render();
  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(Main);
}
function checkBomb()
{
  if(bombsCaught){
    alert("gameover");
    bombArray = [];
  }
  console.log(bombsCaught);
}
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
Reset();
Main();

startGame();
