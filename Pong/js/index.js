// first variable is for information about the dimensions of the canvas object
               // second is for underlying graphical information
               var canvas;
               var canvasContext;

               // Ball variables
               var ballX = 400;
               var ballSpeedX = 5;
               var ballY = 300;
               var ballSpeedY = 3;
               var ballSize = 20;

               // Paddle variables
               var paddleLY = 250;
               var paddleRY = 250;
               const Paddle_player_width = 15;
               const Paddle_player_height =150;
               const PADDLE_HEIGHT = 100;
               const PADDLE_WIDTH = 10;

               // Score Variables
               var p1Score = 0;
               var p2Score = 0;
               const WINNING_SCORE = 10;

               // Win lose variables
               var showWinScreen = false;
               var winner = "No Winner";


                // Doesn't fire the included code until AFTER the page finishes loading.
                window.onload = function() {
                    canvas = document.getElementById('theGame');
                    canvasContext = canvas.getContext('2d');

                    // Setting speed at which things will move
                    var framesPerSecond = 80;
                    setInterval(function() {
                        moveEverything();
                        drawEverything();
                    }, 1000/framesPerSecond);

                    canvas.addEventListener('mousedown', handleMouseClick);

                    // Locking the mouse position with the paddle position
                    canvas.addEventListener('mousemove',
                            function(evt) {
                                var mousePos = findMousePos(evt);
                                paddleLY = mousePos.y-(PADDLE_HEIGHT/2);
                            })


                };

               function drawNet() {
                   for(var i= 12; i < canvas.height; i+=50) {
                       rect(canvas.width/2 - 1, i, 2, 25, "#dadada");
                   }
               }

                 // Initial creation of the "physical" game parts
                 function drawEverything() {
                     // Create Backdrop
                     rect(0,0,canvas.width,canvas.height, '#2a65bc');

                     // Create Score Area
                     canvasContext.fillStyle = "#dadada";
                     canvasContext.fillText(p1Score.toString(), 200, 100)
                     canvasContext.fillText(p2Score.toString(), 600, 100)

                     if(showWinScreen) {
                         canvasContext.fillText("Game Over", 380,100);
                         canvasContext.fillText("Winner = " + winner, 380,125);
                         canvasContext.fillText("Click to continue", 380,150);
                         return;
                     }

                     drawNet();

                     // Create ball
                     circle(ballX, ballY, ballSize, '#d36e40')

                     // Create paddle left
                     rect(0,paddleLY,Paddle_player_width,Paddle_player_height, '#dadada');

                     // Create paddle Right
                     rect(canvas.width-PADDLE_WIDTH,paddleRY,PADDLE_WIDTH,PADDLE_HEIGHT, '#dadada');

                 }

                // Function concerned with the ball movement
                function moveEverything() {
                    if (showWinScreen) {
                        return;
                    }

                    computerMovement();

                    ballX += ballSpeedX;
                    ballY += ballSpeedY;

                    // Moves the ball horizontally
                        // Checks if the ball misses or hits on the left side
                        if (ballX - ballSize< 0) {
                            if(ballY > paddleLY &&
                               ballY < paddleLY+Paddle_player_height) {
                                ballSpeedX = -ballSpeedX;

                                var deltaY = ballY
                                            -(paddleLY + Paddle_player_height/2);
                                ballSpeedY = deltaY * 0.1

                            } else {
                                p2Score++;      // Must be BEFORE ballReset()
                                ballReset();
                            }
                        }
                        // Checks if the ball misses or hits on the right side
                        if (ballX + ballSize> canvas.width) {
                            if(ballY > paddleRY &&
                                    ballY < paddleRY+PADDLE_HEIGHT) {
                                ballSpeedX = -ballSpeedX;

                                var deltaY = ballY
                                        -(paddleRY + PADDLE_HEIGHT/2);
                                ballSpeedY = deltaY * 0.1
                            } else {
                                p1Score++;      // Must be BEFORE ballReset()
                                ballReset();
                            }
                        }

                    // Moves the ball vertically
                    if (ballY -ballSize < 0) {
                        ballSpeedY = -ballSpeedY;
                    }
                    if (ballY + ballSize > canvas.height) {
                        ballSpeedY = -ballSpeedY;
                    }

                }

               // Computer Movement Function
               function computerMovement() {
                   var paddleRYCenter = paddleRY + (PADDLE_HEIGHT/2);

                   if(paddleRYCenter < ballY - 35) {
                       paddleRY += 2.3;
                   } else if (paddleRYCenter > ballY + 35) {
                       paddleRY -=2.3;
                   }
               }

                // Function to draw a rectangle
                function rect(leftX,topY, width,height, drawColor) {
                    canvasContext.fillStyle = drawColor;
                    canvasContext.fillRect(leftX,topY, width,height);
                }

                // Function to draw a circle
                function circle(x,y,circleRadius, color) {
                    canvasContext.fillStyle = color;
                    canvasContext.beginPath();
                            // x,y --> center point of the ball
                            // 10 --> radius of the circle
                            // 0,Math.PI*2 --> deals with radians around the circle. Full circle is 2*pi
                            // true --> clockwise vs counter-clockwise
                    canvasContext.arc(x,y,circleRadius,  0, Math.PI*2, true);
                    canvasContext.fill();
                }

                // Function to generate the coordinates of the mouse within the game field.
                function findMousePos(evt) {
                    var rectPaddle = canvas.getBoundingClientRect();
                    var root = document.documentElement;
                    var mouseX = evt.clientX - rectPaddle.left - root.scrollLeft;
                    var mouseY = evt.clientY - rectPaddle.top - root.scrollTop;
                    return {
                        x:mouseX,
                        y:mouseY
                    }
                }

               // Win Screen Mouse Click
               function handleMouseClick(evt) {
                   if(showWinScreen) {
                       p1Score = 0;
                       p2Score = 0;
                       showWinScreen = false;
                   }
               }

                // Ball resetting function. For when the player misses
                function ballReset() {
                    if(p1Score >= WINNING_SCORE) {
                            winner = "Player 1"
                            showWinScreen = true;
                    }
                    if(p2Score >= WINNING_SCORE) {
                        winner = "Player 2"
                        showWinScreen = true;
                    }

                    ballSpeedX = -ballSpeedX;
                    ballX = canvas.width/2;
                    ballY = canvas.height/2;
                }