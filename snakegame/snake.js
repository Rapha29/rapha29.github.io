document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const gridSize = 20;
    const boardSize = 400;
    const snakeSpeed = 200; // milissegundos
  
    let snakeDirection = 'right';
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
  
    let score = 0;
    let snakeInterval;
  
    function createGrid() {
      for (let i = 0; i < gridSize * gridSize; i++) {
        const gridCell = document.createElement('div');
        gridCell.style.width = `${boardSize / gridSize}px`;
        gridCell.style.height = `${boardSize / gridSize}px`;
        gameBoard.appendChild(gridCell);
      }
    }
  
    function renderSnake() {
      snake.forEach(segment => {
        const snakeElement = gameBoard.children[segment.y * gridSize + segment.x];
        snakeElement.classList.add('snake');
      });
    }
  
    function renderFood() {
      const foodElement = gameBoard.children[food.y * gridSize + food.x];
      foodElement.classList.add('food');
    }
  
    function clearSnake() {
      snake.forEach(segment => {
        const snakeElement = gameBoard.children[segment.y * gridSize + segment.x];
        snakeElement.classList.remove('snake');
      });
    }
  
    function clearFood() {
      const foodElement = gameBoard.children[food.y * gridSize + food.x];
      foodElement.classList.remove('food');
    }
  
    function moveSnake() {
      const head = { ...snake[0] };
  
      switch (snakeDirection) {
        case 'up':
          head.y--;
          break;
        case 'down':
          head.y++;
          break;
        case 'left':
          head.x--;
          break;
        case 'right':
          head.x++;
          break;
      }
  
      if (head.x < 0) {
        head.x = gridSize - 1;
      } else if (head.x >= gridSize) {
        head.x = 0;
      }
  
      if (head.y < 0) {
        head.y = gridSize - 1;
      } else if (head.y >= gridSize) {
        head.y = 0;
      }
  
      snake.unshift(head);
  
      if (head.x === food.x && head.y === food.y) {
        score++;
        clearFood();
        generateFood();
        scoreElement.textContent = `Score: ${score}`;
      } else {
        snake.pop();
      }
    }
  
    function generateFood() {
      food.x = Math.floor(Math.random() * gridSize);
      food.y = Math.floor(Math.random() * gridSize);
  
      snake.forEach(segment => {
        if (segment.x === food.x && segment.y === food.y) {
          generateFood();
        }
      });
    }
  
    function checkCollision() {
      const head = snake[0];
  
      if (
        snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y)
      ) {
        gameOver();
      }
    }
  
function restartGame() {
  clearInterval(snakeInterval);
  location.reload(); //
}

function gameOver() {
  clearInterval(snakeInterval);
  const gameOverMessage = `Game Over! Your score is ${score}.`;

  // Cria um elemento de parágrafo para exibir a mensagem de "Game Over"
  const gameOverElement = document.createElement('p');
  gameOverElement.textContent = gameOverMessage;

  // Cria um botão para reiniciar o jogo
  const restartButton = document.createElement('button');
  restartButton.textContent = 'Restart';
  restartButton.addEventListener('click', restartGame);

  // Limpa o conteúdo atual do game-container
  const gameContainer = document.getElementById('game-container');
  gameContainer.innerHTML = '';

  // Adiciona a mensagem de "Game Over" e o botão de reiniciar ao game-container
  gameContainer.appendChild(gameOverElement);
  gameContainer.appendChild(restartButton);

  // Reseta as variáveis do jogo
  score = 0;
  snake = [{ x: 10, y: 10 }];
  scoreElement.textContent = 'Score: 0';
  snakeDirection = 'right';
}
  
    function clearBoard() {
      while (gameBoard.firstChild) {
        gameBoard.firstChild.remove();
      }
    }
  
    function handleKeyPress(event) {
      const key = event.key;
      const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  
      if (validKeys.includes(key)) {
        event.preventDefault();
  
        switch (key) {
          case 'ArrowUp':
            if (snakeDirection !== 'down') {
              snakeDirection = 'up';
            }
            break;
          case 'ArrowDown':
            if (snakeDirection !== 'up') {
              snakeDirection = 'down';
            }
            break;
          case 'ArrowLeft':
            if (snakeDirection !== 'right') {
              snakeDirection = 'left';
            }
            break;
          case 'ArrowRight':
            if (snakeDirection !== 'left') {
              snakeDirection = 'right';
            }
            break;
        }
      }
    }
  
    function startGame() {
      clearBoard();
      createGrid();
      renderSnake();
      generateFood();
      renderFood();
  
      snakeInterval = setInterval(() => {
        clearSnake();
        moveSnake();
        checkCollision();
        renderSnake();
        renderFood();
      }, snakeSpeed);
    }
  
    document.addEventListener('keydown', handleKeyPress);
    startGame();
  });
// ...


