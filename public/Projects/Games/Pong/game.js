const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');
ctx.font = "1em Helvetica";

function start() {
    // Attempt to clear the current game by clearing the interval
    try {
        clearInterval(interval);
    } catch (Exception) {};

    // Define constants for the elements
    PADDLEHEIGHT = canvas.height / 5;
    PADDLEWIDTH = canvas.width / 80;
    BALLRADIUS = PADDLEWIDTH;
    FPS = 60;

    // Load the font
    load_font();

    // Reset the presses
    upPress = false;
    downPress = false;

    // Create the paddles
    let offset = canvas.width / 16;
    PADDLES = {
        "player": {x: offset, y: canvas.height / 2 - PADDLEHEIGHT},
        "ai": {x: canvas.width - offset, y: canvas.height / 2 - PADDLEHEIGHT}
    };

    // Crete the ball
    BALL = {x: canvas.width / 2, y: canvas.height / 2};
    balldy = canvas.height / 200;
    balldx = canvas.width / 320;

    // Decide which direction the ball will start going
    if (Math.random() < 0.5) balldy = -balldy;
    if (Math.random() < 0.5) balldx = -balldx;

    // Start the game
    interval = setInterval(draw, 1000 / FPS);
    opponent_score = 0;
    player_score = 0;
}

function draw() {
    // Clear the background
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();

    // Draw the objects
    drawPaddles();
    drawBall();

    // Draw the scores onto the screen
    let fontSize = canvas.width/16;
    ctx.fillStyle = "#ffffff";
    ctx.font = `${fontSize}px PongScore`;
    ctx.fillText(player_score, canvas.width / 4, canvas.height / 8);
    ctx.fillText(opponent_score, (canvas.width / 4)*3, canvas.height / 8);

    // Move the paddle according to the input
    move();

    // Adjust the ball's position
    if ((BALL.y + BALLRADIUS*2) >= canvas.height || (BALL.y - BALLRADIUS*2) < 0) {balldy = -balldy; changeYSpeed();}

    // Player paddle collision
    else if (((BALL.x - BALLRADIUS >= PADDLES["player"].x) && (BALL.x - BALLRADIUS <= PADDLES["player"].x + PADDLEWIDTH)) &&
             ((BALL.y - BALLRADIUS >= PADDLES["player"].y) && (BALL.y + BALLRADIUS <= PADDLES["player"].y + PADDLEHEIGHT))
    ) {balldx = -balldx; changeXSpeed();}

    // AI paddle collision
    else if (((BALL.x + BALLRADIUS >= PADDLES["ai"].x) && (BALL.x + BALLRADIUS <= PADDLES["ai"].x + PADDLEWIDTH)) &&
             ((BALL.y + BALLRADIUS >= PADDLES["ai"].y) && (BALL.y - BALLRADIUS <= PADDLES["ai"].y + PADDLEHEIGHT))
    ) {balldx = -balldx; changeXSpeed();}
    BALL.y += balldy;
    BALL.x += balldx;

    // Adjust the AI paddle position
    if (BALL.x > canvas.width / 2 && BALL.x < canvas.width - PADDLES["player"].x) {
        if ((PADDLES["ai"].y + PADDLEHEIGHT / 2) > BALL.y) PADDLES["ai"].y -= canvas.height / 75;
        else if ((PADDLES["ai"].y + PADDLEHEIGHT / 2) < BALL.y) PADDLES["ai"].y += canvas.height / 75;

        if ((PADDLES["ai"].y - BALLRADIUS) < 0) PADDLES["ai"].y = BALLRADIUS;
        else if ((PADDLES["ai"].y + PADDLEHEIGHT + BALLRADIUS) > canvas.height) PADDLES["ai"].y = canvas.height - PADDLEHEIGHT - BALLRADIUS;
    }

    // Identify if the ball is out of bounds
    if ((BALL.x - BALLRADIUS) <= 0) {opponent_score += 1; gameOver();}
    else if ((BALL.x + BALLRADIUS) >= canvas.width) {player_score += 1; gameOver();}
}

function drawPaddles() {
    ctx.beginPath();

    // Draw player paddle
    ctx.rect(PADDLES["player"].x, PADDLES["player"].y, PADDLEWIDTH, PADDLEHEIGHT);

    // Draw AI paddle
    ctx.rect(PADDLES["ai"].x, PADDLES["ai"].y, PADDLEWIDTH, PADDLEHEIGHT);

    // Colour the paddles
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(BALL.x, BALL.y, BALLRADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function gameOver() {
    BALL = {x: canvas.width / 2, y: canvas.height / 2};
    balldy = canvas.height / 200;
    balldx = canvas.width / 320;
}

function changeYSpeed() {
    if (balldy < 0) balldy -= 0.1;
    else balldy += 0.01;
}

function changeXSpeed() {
    if (balldx < 0) balldx -= 0.1;
    else balldx += 0.01;
}

function move() {
    if (upPress) moveUp();
    if (downPress) moveDown();
}

function moveUp() {
    // Move the paddle upwards
    PADDLES["player"].y -= canvas.height / 125;

    // Ensure the paddle cannot leave the canvas
    if ((PADDLES["player"].y - BALLRADIUS) < 0) PADDLES["player"].y = BALLRADIUS;
}

function moveDown() {
    // Move the paddle downwards
    PADDLES["player"].y += canvas.height / 125;

    // Ensure the paddle cannot leave the canvas
    if ((PADDLES["player"].y + PADDLEHEIGHT + BALLRADIUS) > canvas.height) PADDLES["player"].y = canvas.height - PADDLEHEIGHT - BALLRADIUS;
}

// Add the events to handle the paddle movements (desktop)
document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp") upPress = true;
    else if (event.key == "ArrowDown") downPress = true;
});
document.addEventListener("keyup", (event) => {
    if (event.key == "ArrowUp") upPress = false;
    else if (event.key == "ArrowDown") downPress = false;
});

// Add the events to handle the paddle movements (buttons)
document.querySelector('#up').addEventListener("mousedown", () => {
    upPress = true;
});
document.querySelector('#up').addEventListener("mouseup", () => {
    upPress = false;
});
document.querySelector('#down').addEventListener("mousedown", () => {
    downPress = true;
});
document.querySelector('#down').addEventListener("mouseup", () => {
    downPress = false;
});

// Add events to handle paddle movements (buttons) for mobile devices
document.querySelector('#up').addEventListener("touchstart", () => {
    upPress = true;
});
document.querySelector('#up').addEventListener("touchend", () => {
    upPress = false;
});
document.querySelector('#down').addEventListener("touchstart", () => {
    downPress = true;
});
document.querySelector('#down').addEventListener("touchend", () => {
    downPress = false;
});

// Adapted from https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace
async function load_font() {
    const font = new FontFace("PongScore", 'url("/fonts/pong-score.otf.woff2")'); // Retrieved from https://fontstruct.com/fontstructions/show/1158273/pong_score
    await font.load();
    document.fonts.add(font);
}

start();