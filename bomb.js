console.log("javascript running");

var startingTime = 30;
var remainingTime = 0;
var gameOver = false;
var wiresToCut = [];
var successSong = null;

// Variables for the timer handles
var delay = null;
var timer = null;

var wiresCut = {
  blue: false,
  green: false,
  red: false,
  white: false,
  yellow: false
};

var checkForWin = function() {
  return wiresToCut.length ? false : true;
}

var endGame = function(win) {
  clearTimeout(delay);
  clearInterval(timer);
  gameOver = true;
  // activate reset button
  document.getElementsByTagName("button")[0].disabled = false;
  if (win) {
    // we won!!!
    console.log("you saved the city!");
    document.getElementsByClassName("timerbox")[0].classList.add("green");
    document.getElementsByClassName("timerbox")[0].classList.remove("red");
    var yay = document.getElementById('yay');
    yay.addEventListener('ended', function() {
      successSong.play();
    });
    yay.play();
  } else {
    // we lost :(
    console.log("BOOM!");
    document.getElementById('explode').play();
    document.body.classList.remove("unexploded");
    document.body.classList.add("exploded");
  }
}

var cutWire = function() {
  if (!wiresCut[this.id] && !gameOver) {
    // do the wire cutting and game checking here
    document.getElementById('buzz').play();
    this.src = "img/cut-" + this.id + "-wire.png";
    wiresCut[this.id] = true;
    // Check for correct wire
    var wireIndex = wiresToCut.indexOf(this.id);
    if (wireIndex > -1) {
      // This is where the good cut logic goes
      console.log(this.id + " was correct!");
      wiresToCut.splice(wireIndex, 1);
      if (checkForWin()) {
        endGame(true);
      }
    } else {
      // this is where the bad cut logic goes
      console.log(this.id + " was incorrect!");
      delay = setTimeout(function() {
        endGame(false);
      }, 750);
    }
  }
}

var updateClock = function() {
  remainingTime--;
  if (remainingTime <= 0) {
    endGame(false);
  }
  document.querySelector(".timerbox p").textContent = "0:00:" + remainingTime;
}

var initGame = function() {
  // This line empties the wiresToCut array
  wiresToCut.length = 0;
  remainingTime = startingTime;
  for (let wire in wiresCut) {
    var rand = Math.random();
    if (rand > 0.5) {
      wiresToCut.push(wire);
    }
  }
  console.log(wiresToCut);
  document.getElementsByTagName("button")[0].disabled = true;
  document.getElementById('siren').play();
  timer = setInterval(updateClock, 1000);
}

var reset = function() {
  gameOver = false;
  var wireImages = document.getElementsByClassName("wirebox")[0].children;
  for (let i = 0; i < wireImages.length; i++) {
    wireImages[i].src = "img/uncut-" + wireImages[i].id + "-wire.png";
  }
  // Reset background
  document.body.classList.add("unexploded");
  document.body.classList.remove("exploded");
  // Reset clock color
  document.getElementsByClassName("timerbox")[0].classList.remove("green");
  document.getElementsByClassName("timerbox")[0].classList.add("red");

  clearTimeout(delay);
  clearInterval(timer);

  successSong.pause();
  successSong.currentTime = 0;

  for (let wire in wiresCut) {
    wiresCut[wire] = false;
  }

  initGame();
}

document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM loaded");
  for (let wire in wiresCut) {
    document.getElementById(wire).addEventListener('click', cutWire);
  }
  document.getElementsByTagName("button")[0].addEventListener("click", reset);
  successSong = document.getElementById('success');
  initGame();
});
