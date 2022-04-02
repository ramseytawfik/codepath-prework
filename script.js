var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var clueHoldTime = 1000;
var mistakes = 0;
let timer = null;
var count = 60;
var reset = false;

const nextClueWaitTime = 1000;
const cluePauseTime = 333;
const len = 8;

function generatePattern() {
  for (let j = 0; j < len; j++) {
    pattern[j] = Math.ceil(Math.random() * 6);
  }
}

function startGame() {
  console.log(pattern);
  progress = 0;
  gamePlaying = true;
  clueHoldTime = 1000;

  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");

  generatePattern();
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;

  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");

  reset = true;
}

function playTone(btn, len) {
  first.frequency.value = freqMap[btn];
  second.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);

  tonePlaying = true;

  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    first.frequency.value = freqMap[btn];
    second.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}
function stopTone() {
  second.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

var context = new AudioContext();
var first = context.createOscillator();
var second = context.createGain();

second.connect(context.destination);
second.gain.setValueAtTime(0, context.currentTime);
first.connect(second);
first.start(0);

function lightButton(btn) {
  document.getElementById("Button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("Button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  mistakes = 0;
  let delay = nextClueWaitTime;
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
  clueHoldTime -= 100;
  count = 60;
  reset = false;

  clearInterval(timer);
  timer = setInterval(countDown, 1000);
}

function countDown() {
  // Update the count down every 1 second
  document.getElementById("timer").innerHTML = "Time Left: " + count + " sec";
  count -= 1;
  if (count < 0 || reset) {
    if (!reset) {
      stopGame();
      alert("Time is up. You lost.");
    }
    resetTimer();
    clearInterval(timer);
  }
}
function resetTimer() {
  count = 60;
  document.getElementById("timer").innerHTML = "Countdown: 0 sec";
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  if (btn === pattern[guessCounter]) {
    if (guessCounter === progress) {
      if (progress === pattern.length - 1) {
        winGame();
        reset = true;
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    mistakes++;
    if (mistakes === 3) {
      loseGame();
      reset = true;
    } else {
      //Increment errors
      alert("Wrong! Lives Left:" + (3 - mistakes));
    }
  }
}

const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 515.2,
  5: 666.1,
  6: 822,
};
