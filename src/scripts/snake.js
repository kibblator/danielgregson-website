window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    let emailP = document.getElementById('emailAddress');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const container = document.getElementById('snake-game-container');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        updateTileSize();
    }

    function updateTileSize() {
        const smallerDimension = Math.min(canvas.width, canvas.height);
        tileCount = Math.floor(smallerDimension / 20);
        tileSize = smallerDimension / tileCount;
    }

    let tileCount;
    let tileSize;

    let word = 'dpgregson@hotmail.com';
    let wordArray = word.split('');
    let snake = [{ x: 10, y: 10 }];
    let direction = { x: 0, y: 0 };
    let letterIndex = 0;
    let food = { x: 15, y: 15 };
    let gameStarted = false;
    let gameWon = false;

    function drawGame() {
        if (gameWon) {
            return;
        }

        if (!gameStarted) {
            displayStartMessage();
            return;
        }

        changeSnakePosition();
        if (isGameOver()) {
            return;
        }
        clearScreen();
        checkFoodCollision();
        drawFood();
        drawSnake();
        setTimeout(drawGame, 1000 / 10);
    }

    function displayStartMessage() {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press W, A, S, or D to start', canvas.width / 2, canvas.height / 2);
    }

    function clearScreen() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawSnake() {
        ctx.fillStyle = 'green';
        for (let part of snake) {
            ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
        }
    }

    function changeSnakePosition() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        snake.unshift(head);
        snake.pop();
    }

    function drawFood() {
        var radius = tileSize / 2;
    
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(food.x * tileSize + radius, food.y * tileSize + radius, radius, 0, 2 * Math.PI);
        ctx.fill();
    
        ctx.fillStyle = 'white';
        ctx.font = '15px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(wordArray[letterIndex], food.x * tileSize + radius, food.y * tileSize + radius);
    }
    

    function checkFoodCollision() {
        if (snake[0].x === food.x && snake[0].y === food.y) {
            snake.push({});
            let pickedLetter = wordArray[letterIndex];
            letterIndex++;
            if (letterIndex === wordArray.length) {
                letterIndex = 0;
                gameWin();
            }
            food.x = Math.floor(Math.random() * tileCount);
            food.y = Math.floor(Math.random() * tileCount);
            emailP.textContent += pickedLetter;
        }
    }
    
    function gameWin() {
        gameWon = true;
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
        setTimeout(resetGame, 2000);
    }

    function isGameOver() {
        let gameOver = false;
        if (direction.x === 0 && direction.y === 0) {
            return false;
        }
        if (snake[0].x < 0 || snake[0].x >= tileCount || snake[0].y < 0 || snake[0].y >= tileCount) {
            gameOver = true;
        }
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                gameOver = true;
            }
        }
        if (gameOver) {
            ctx.fillStyle = 'white';
            ctx.font = '50px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
            setTimeout(resetGame, 2000);
        }
        return gameOver;
    }
    
    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        letterIndex = 0;
        food = { x: 15, y: 15 };
        gameStarted = false;
        gameWon = false;
        clearScreen();
        displayStartMessage();
        emailP.textContent = '';
    }
    
    

    document.body.addEventListener('keydown', (event) => {
        if (!gameStarted) {
            resetGame();
            gameStarted = true;
            drawGame();
        }
        switch (event.key) {
            case 'w':
                if (direction.y !== 1) {
                    direction = { x: 0, y: -1 };
                }
                break;
            case 's':
                if (direction.y !== -1) {
                    direction = { x: 0, y: 1 };
                }
                break;
            case 'a':
                if (direction.x !== 1) {
                    direction = { x: -1, y: 0 };
                }
                break;
            case 'd':
                if (direction.x !== -1) {
                    direction = { x: 1, y: 0 };
                }
                break;
        }
    });

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    displayStartMessage();
});
