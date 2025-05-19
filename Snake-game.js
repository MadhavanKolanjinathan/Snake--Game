const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
const scale = 15; // Size of each grid
let rows = canvas.height / scale;
let columns = canvas.width / scale;

// Game state variables
let snake;
let food;
let score;
let gameInterval;
let timerInterval;
let isGameRunning = false;

// Timer variables
let seconds = 0;
let minutes = 0;
let isTimerRunning = false;

// Set up the game
function setup() { 
  canvas.width = 1200;
  canvas.height = 360;
  score = 0;
  rows = canvas.height / scale;
  columns = canvas.width / scale;
  snake = new Snake();
  food = generateFood();
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  seconds = 0;
  minutes = 0;
  document.getElementById('timer').textContent = "00:00";
  isGameRunning = false;
  isTimerRunning=false;
  
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake.update();
  snake.draw();
  drawFood(food);
  checkCollision();
  displayScore();
}

// Snake class
function Snake() {
  this.body = [{x: 10, y: 10}];
  this.direction = 'right';
  
  this.update = function () {
    const head = {x: this.body[0].x, y: this.body[0].y};
    
    switch (this.direction) {
      case 'left': head.x--; break;
      case 'right': head.x++; break;
      case 'up': head.y--; break;
      case 'down': head.y++; break;
    }
    
    this.body.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
      score++;
      food = generateFood();
    } else {
      this.body.pop();
    }
  };
  
  this.draw = function () {
    ctx.fillStyle = 'red';
    this.body.forEach((segment) => {
      ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
    });
  };
    
  this.changeDirection = function (event) {
    if (event.keyCode === 37 && this.direction !== 'right') {
      this.direction = 'left';
    } else if (event.keyCode === 38 && this.direction !== 'down') {
      this.direction = 'up';
    } else if (event.keyCode === 39 && this.direction !== 'left') {
      this.direction = 'right';
    } else if (event.keyCode === 40 && this.direction !== 'up') {
      this.direction = 'down';
    }
  };
}

// Generate food at a random location
function generateFood() {
  return {
    x: Math.floor(Math.random() * columns),
    y: Math.floor(Math.random() * rows)
  };
}

// Draw food on the canvas
function drawFood(food) {
  ctx.fillStyle = 'yellow';
  ctx.fillRect(food.x * scale, food.y * scale, scale, scale);
}

// Check for collisions with walls or itself

function checkCollision() {
  const head = snake.body[0];
  
  // Collision with walls
  if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
    alert("Game over!!-->If u want to continue press 'OK' & your score is:"+ score);
    setup();
  }
  
  // Collision with itself
  for (let i = 1; i < snake.body.length; i++) {
    if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
      alert("Game over!! your score is:"+ score);
      setup();
    }
  }
}

// Display score
function displayScore() {
  ctx.fillStyle = 'white';
  ctx.font = '25px Arial';
  ctx.fillText('Score: ' + score, 500,340);
}

//! Start timer function
function startTimer() {
  if (!isTimerRunning) {
    timerInterval = setInterval(updateTimer, 1000);
    isTimerRunning = true;
  }
}

// Reset timer
function resetTimer() {
  seconds = 0;
  minutes = 0;
  document.getElementById('timer').textContent = "00:00";
  if (isTimerRunning) {
    clearInterval(timerInterval);
    startTimer();
  }
}

// Update timer display
function updateTimer() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  document.getElementById('timer').textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
}

// Format time to ensure two digits for single digit numbers
function formatTime(time) {
  return time < 10 ? '0' + time : time;
}

//! start and restart button clicks
document.getElementById('startBtn').addEventListener('click', () => {
  if (!isGameRunning) {
    isGameRunning = true;
    setup();
    gameInterval = setInterval(gameLoop, 80);
    startTimer();
  }
});

document.getElementById('restartBtn').addEventListener('click', () => {
  clearInterval(gameInterval);
  resetTimer();
  isGameRunning = false;
  setup();
  gameInterval = setInterval(gameLoop, 80);
  startTimer();
});

//avoid page refresh (F5 or Ctrl+R)
window.addEventListener('keydown', function (e) {
  if (e.keyCode === 116 || (e.ctrlKey && e.keyCode === 82)) {
    e.preventDefault();
  }
});
  
// Listen for keyboard input to change direction
document.addEventListener('keydown', (event) => snake.changeDirection(event));

// Initialize the game
setup();
