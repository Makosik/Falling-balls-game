// Initialize canvas and variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const basketWidth = 80;
const basketHeight = 10;
let basketX = canvas.width / 2 - basketWidth / 2;
let isGameRunning = false;
let score = 0;
let totalBalls = 0;
let balls = [];
let speedIncreased = false;
let speedPlus = 3;

// Create Ball class
class Ball {
   constructor() {
      this.x = Math.floor(Math.random() * (canvas.width - 20)) + 10;
      this.y = 0;
      this.radius = 10;
      this.speed = speedPlus;
   }

   // Move ball down the screen
   update() {
      this.y += this.speed;
   }

   // Draw ball on canvas
   draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
   }
}

// Draw basket on canvas
function drawBasket() {
   ctx.beginPath();
   ctx.rect(basketX, canvas.height - basketHeight, basketWidth, basketHeight);
   ctx.fillStyle = "green";
   ctx.fill();
   ctx.closePath();
}

// Move basket left or right
function moveBasket(event) {
   if (isGameRunning) {
      if (event.keyCode == 37 && basketX > 0) {
         basketX -= 20;
      } else if (event.keyCode == 39 && basketX < canvas.width - basketWidth) {
         basketX += 20;
      }
   }
}

// Update score and total balls caught
function updateResult() {
   const result = document.getElementById("result");
   const percentage = ((score / totalBalls) * 100).toFixed(2);
   result.innerHTML = `Score: ${score}/${totalBalls} (${percentage}%)`;
}

// Main game loop
function gameLoop() {
   if (isGameRunning) {
      // Clear canvas and draw basket
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBasket();

      // Generate new ball
      if (Math.random() < 0.015) { ////////////////////
         balls.push(new Ball());
         totalBalls++;
      }

      // Update and draw each ball
      balls.forEach((ball, index) => {
         ball.update();
         ball.draw();

         // Check for collision with basket
         if (
            ball.y + ball.radius >= canvas.height - basketHeight &&
            ball.x >= basketX &&
            ball.x <= basketX + basketWidth
         ) {
            balls.splice(index, 1);
            score++;
            updateResult();
         }

         // Check for ball hitting the ground
         if (ball.y + ball.radius >= canvas.height) {
            balls.splice(index, 1);
            updateResult();
         }
      });

     
      // Increase ball speed over time
      if (score >= 20 &&score < 40 && !speedIncreased) {
         speedPlus += 1;
         balls.forEach((ball) => {
            balls.speed = speedPlus;
         });
         console.log(speedPlus)
         speedIncreased = true
      }else if(score>=40 && score <=100 && speedIncreased){
         speedPlus += 1;
         balls.forEach((ball) => {
            balls.speed = speedPlus;
         });
         console.log(speedPlus)
         speedIncreased = false;
      }

      // Check for game over
      if (totalBalls >= 100) {
         stopGame();
         updateResult();
         alert("Game over!");
      }
      // Request next frame
      requestAnimationFrame(gameLoop);
   }
}
// Start game
function startGame() {
   if (!isGameRunning) {
      isGameRunning = true;
      score = 0;
      totalBalls = 0;
      balls = [];
      updateResult();
      gameLoop();
      
   }
}

// Stop game
function stopGame() {
   isGameRunning = false;
}

// Listen for arrow key events
document.addEventListener("keydown", moveBasket);