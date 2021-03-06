/* global $ */
// Creating the canvas
var healthbar = $('#lifebar')
var healthCounter = window.innerWidth

var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')
canvas.width = 600
canvas.height = 400
canvas.style = ' position:absolute; width: 600px; height: 400px; margin-left: auto; margin-right:auto; left:0; right:0; '
// canvas.style = 'left: 50%; margin-left: 8% '

document.body.appendChild(canvas)

// Background Images
var bgReady = false
var bgImage = new Image()
bgImage.onload = function () {
  bgReady = true
}
bgImage.src = 'images/bg2.png'

// Unicorn Images
var unicornReady = false
var unicornImage = new Image()
unicornImage.onload = function () {
  unicornReady = true
}
unicornImage.src = 'images/unicorn.png'

// Coin Images
var coinReady = false
var coinImage = new Image()
coinImage.onload = function () {
  coinReady = true
}
coinImage.src = 'images/coin.png'

// Police Image
var policeReady = false
var policeImage = new Image()
policeImage.onload = function () {
  policeReady = true
}
policeImage.src = 'images/police.png'

var unicorn = {
  speed: 100 // movement in pixels per second
}
// an objects of coins
// var bombs = {}
var policeArray = []
var coins = {}
var policeCaught = false
var coinCaught = 0
var playerLife = 3

// Handle keyboard controls
var keysDown = {}

addEventListener('keydown', function (e) {
  keysDown[e.keyCode] = true
}, false)

addEventListener('keyup', function (e) {
  delete keysDown[e.keyCode]
}, false)

// Reset the game when the unicorn eats a seed

function Reset () {
  // throw the police/coins somwehere on the screen randomly

  coins.x = 32 + (Math.random() * (canvas.width - 64))
  coins.y = 32 + (Math.random() * (canvas.height - 80))
  keysDown = {}
  UpdatedHealthBar()
}

function AddPolice () {
  var bombs = {}
  bombs.x = 32 + (Math.random() * (canvas.width - 64))
  bombs.y = 32 + (Math.random() * (canvas.height - 80))
  policeArray.push(bombs)
}

function startGame () {
  unicorn.x = canvas.width / 4
  unicorn.y = canvas.height / 2
}
var flag = true
function MinusHealth () {
  if (healthCounter > 0) {
    healthCounter--
  }
  if (healthCounter === 0) {
    if (flag) {
      flag = false
      window.alert('Oops! Unicorn is die :( ')
      Reset()
      playerLife = 3
      coinCaught = 0
      keysDown = {}
      policeArray = []
      healthCounter = 1000
    }
  }
  UpdatedHealthBar()
}

function UpdatedHealthBar () {
  healthbar.width(healthCounter)
  flag = true
}

setInterval(MinusHealth, 10)

// Update game objects

function Update (modifier) {
  if (38 in keysDown) {
    // this is when player is holding up
    unicorn.y -= unicorn.speed * modifier
    var rockTop = 0
    if (unicorn.y < rockTop) {
      unicorn.y = rockTop
    }
  }
  if (40 in keysDown) {
    // this is when player is holding down
    // unicorn.y += unicorn.speed * modifier
    unicorn.y += unicorn.speed * modifier
    var rockBottom = canvas.height - 40
    if (unicorn.y > rockBottom) {
      unicorn.y = rockBottom
    }
  }
  if (37 in keysDown) {
    // player holding left button
    unicorn.x -= unicorn.speed * modifier
    var rockLeft = 0

    if (unicorn.x < rockLeft) {
      unicorn.x = rockLeft
    }
  }
  if (39 in keysDown) {
    // player holding right
    unicorn.x += unicorn.speed * modifier
    var rockRight = canvas.width - 40

    if (unicorn.x > rockRight) {
      unicorn.x = rockRight
    }
  }
  // Pressing R on the keyboard will restart the game
  if (82 in keysDown) {
    flag = true
    Reset()
    playerLife = 3
    coinCaught = 0
    keysDown = {}
    policeArray = []
    healthCounter = 1000
  }
  // Have the unicorns ate the coins up?
  if (
    unicorn.x <= (coins.x + 32) &&
    coins.x <= (unicorn.x + 32) && unicorn.y <= (coins.y + 32) && coins.y <= (unicorn.y + 32)) {
    $('#coin').trigger('play')
    ++coinCaught
    healthCounter += 100
    AddPolice()
    Reset()
  }
  // Did the unicorn collide with the spacepolice?
  for (var i = 0; i < policeArray.length; i++) {
    if (
      unicorn.x <= (policeArray[i].x + 32) &&
      policeArray[i].x <= (unicorn.x + 32) && unicorn.y <= (policeArray[i].y + 32) && policeArray[i].y <= (unicorn.y + 32)) {
      policeCaught = true
      policeArray.splice(i) // this is to delete the police out of the array
      policeArray = []
      checkBomb()
      Reset()
    // ( please note that if you put this reset here, an additional spacepolice )
    }
  }
// You can do the same method without array (But more tedious)
// if (
//   unicorn.x <= (bombs.x + 32) &&
//    bombs.x <= (unicorn.x + 32) && unicorn.y <= (bombs.y + 32) && bombs.y <= (unicorn.y + 32)) {
//   ++policeCaught
//   checkBomb()
//   Reset()
// }
}

// setting up swipe listeners

function Swipe (modifier) {
  $('canvas').on('swipeleft', function (event) {

    console.log('left')
    unicorn.x -= 3 * modifier
    var rockLeft = 0

    if (unicorn.x < rockLeft) {
      unicorn.x = rockLeft
    }
  })
  $('canvas').on('swiperight', function (event) {
    console.log('right')
    unicorn.x += 3 * modifier
    var rockRight = canvas.width - 40

    if (unicorn.x > rockRight) {
      unicorn.x = rockRight
    }
  })
  $('canvas').on('swipeup', function (event) {
    unicorn.y -= 3 * modifier
    var rockTop = 0
    if (unicorn.y < rockTop) {
      unicorn.y = rockTop
    }
  })

  $('canvas').on('swipedown', function (event) {
    unicorn.y += 3 * modifier
    var rockBottom = canvas.height - 40
    if (unicorn.y > rockBottom) {
      unicorn.y = rockBottom
    }
  })
}

// Draw or rather show everything
// We call this in the main function to render it
function Render () {
  // bgReady , unicornReady , coinReady is asking if image is ready to load on html
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0)
  }
  if (unicornReady) {
    ctx.drawImage(unicornImage, unicorn.x, unicorn.y)
  }
  if (coinReady) {
    ctx.drawImage(coinImage, coins.x, coins.y)
  }
  for (var i = 0; i < policeArray.length; i++) {
    ctx.drawImage(policeImage, policeArray[i].x, policeArray[i].y)
  }
  $('h2').text('Coins stole : ' + coinCaught)
  $('h3').text('Lives: ' + playerLife)
}

// The main game loop
function Main () {
  var now = Date.now()
  var delta = now - then
  Update(delta / 1000)
  Swipe(delta / 1000)
  Render()
  then = now

  // Request to do this again ASAP
  requestAnimationFrame(Main)
}
// check for bomb (gameOver)
function checkBomb () {
  if (policeCaught) {
    $('#bomb').trigger('play')
    playerLife--
    // Slowing down the alert as the bomb sounds take awhile to play
    setTimeout(function () {
      // clear the keys after the alert pops up
      policeArray = []
      keysDown = {}
      window.alert("You're left with : " + playerLife + ' lifes')
    }, 500)
    healthCounter = 1000
  }
  if (playerLife <= 0) {
    window.alert("You've only one thing to do, and you can't do it well at all!")
    playerLife = 3
    coinCaught = 0
    keysDown = {}
    policeArray = []
  }
}

// Cross-browser support for requestAnimationFrame
var w = window
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame
var then = Date.now()
Reset()
Main()
startGame()
