const canvas = document.getElementById('gameCanvas'); 
const ctx = canvas.getContext('2d');

// Game variables
const box = 20;
const rows = 20;
const cols = 20;

canvas.width = cols * box;
canvas.height = rows * box;

let snake, food, direction, score, gameInterval;
let isPaused = false;

// Tile textures
const tiles = {
  grass: '#8fbc8f',
  dirt: '#a0522d',
  sand: '#f4a460',
};

// Generate a grid of random tiles
let groundGrid = Array.from({ length: rows }, () =>
  Array.from({ length: cols }, () => {
    const tileTypes = Object.keys(tiles);
    return tileTypes[Math.floor(Math.random() * tileTypes.length)];
  })
);

// Listen for keyboard input
document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

// Draw a rectangle
function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, box, box);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(x, y, box, box);
}

// Draw the ground tiles
function drawGround() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const tileType = groundGrid[row][col];
      const color = tiles[tileType];
      drawRect(col * box, row * box, color);
    }
  }
}

// Main game loop
function gameLoop() {
  // Draw ground tiles
  drawGround();

  // Draw food
  drawRect(food.x, food.y, 'red');

  // Move snake
  const head = { ...snake[0] };
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;

  // Check collision with walls or itself
  if (
    head.x < 0 || head.y < 0 || 
    head.x >= canvas.width || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
  }

  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').textContent = score;
    food = { x: Math.floor(Math.random() * cols) * box, y: Math.floor(Math.random() * rows) * box };
  } else {
    snake.pop();
  }

  snake.unshift(head);

  // Draw snake
  snake.forEach((segment, index) => {
    drawRect(segment.x, segment.y, index === 0 ? 'lime' : 'green');
  });
}

// Start the game
function startGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  food = { x: Math.floor(Math.random() * cols) * box, y: Math.floor(Math.random() * rows) * box };
  direction = 'RIGHT';
  score = 0;
  document.getElementById('score').textContent = score;
  groundGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => {
      const tileTypes = Object.keys(tiles);
      return tileTypes[Math.floor(Math.random() * tileTypes.length)];
    })
  );

  gameInterval = setInterval(gameLoop, 150);  // Start the game loop
  document.getElementById('playNowBtn').style.display = 'none';
  document.getElementById('resumeBtn').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'inline-block';
}

// Pause the game
function pauseGame() {
  clearInterval(gameInterval);
  isPaused = true;
  document.getElementById('resumeBtn').style.display = 'inline-block';
}

// Resume the game
function resumeGame() {
  isPaused = false;
  gameInterval = setInterval(gameLoop, 150);
  document.getElementById('resumeBtn').style.display = 'none';
}

// Restart the game
function restartGame() {
  clearInterval(gameInterval);
  document.getElementById('gameCanvas').style.display = 'block';  // Show the canvas again
  startGame();
  document.getElementById('restartBtn').style.display = 'none';

  // Optionally clear the game over message if needed
  const gameOverMessage = document.getElementById('gameOverMessage');
  if (gameOverMessage) {
    gameOverMessage.remove(); // Remove the game over message when restarting
  }
}

// Game over logic
function gameOver() {
  // Hide the canvas and show the restart button
  document.getElementById('gameCanvas').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'inline-block';
  document.getElementById('resumeBtn').style.display = 'none';

  // Create a game over message element if it doesn't exist
  let gameOverMessage = document.getElementById('gameOverMessage');
  if (!gameOverMessage) {
    gameOverMessage = document.createElement('div');
    gameOverMessage.id = 'gameOverMessage'; // Set an ID to reference this element later
    gameOverMessage.style.color = 'white';
    gameOverMessage.style.fontSize = '24px';
    gameOverMessage.style.textAlign = 'center';
    gameOverMessage.style.marginTop = '20px';
    document.body.appendChild(gameOverMessage);
  }

  // Update the content of the game over message
  gameOverMessage.textContent = `Game Over! Your Score: ${score}`;
}

// Add event listeners for the buttons
document.getElementById('playNowBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);
document.getElementById('resumeBtn').addEventListener('click', resumeGame);
