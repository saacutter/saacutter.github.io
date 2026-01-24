const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');
const FPS = 60;
gameState = 1; // 1 = intro, 2 = in game

// Load the font
load_font();

// Set the game loop interval
interval = setInterval(draw, 1000 / FPS);

function start(retry) {
    // Define constants for the elements
    PADDLEHEIGHT = canvas.height/5;
    PADDLEWIDTH = canvas.width/80;
    BALLRADIUS = PADDLEWIDTH;
    MOVEMENT = canvas.height/125;

    // Reset the presses
    upPress = false;
    downPress = false;

    // Create the paddles
    if (!retry) {
        let offset = canvas.width/16;
        PADDLES = {
            "player": {x: offset, y: canvas.height/2 - PADDLEHEIGHT},
            "ai": {x: canvas.width - offset, y: canvas.height/2 - PADDLEHEIGHT}
        };
    }

    // Create the ball
    BALL = {x: canvas.width/2, y: canvas.height/2};
    balldy = canvas.height/200;
    balldx = canvas.width/320;

    // Decide which direction the ball will start going
    if (Math.random() < 0.5) balldy = -balldy;
    if (Math.random() < 0.5) balldx = -balldx;

    // Start the game
    if (!retry) {
        opponent_score = 0;
        player_score = 0;
    }
}

function draw() {
    // Clear the background
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();

    // Draw the paddles
    ctx.beginPath();
    ctx.rect(PADDLES["player"].x, PADDLES["player"].y, PADDLEWIDTH, PADDLEHEIGHT); // Draw player paddle
    ctx.rect(PADDLES["ai"].x, PADDLES["ai"].y, PADDLEWIDTH, PADDLEHEIGHT); // Draw AI paddle
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    // Draw the ball
    ctx.arc(BALL.x, BALL.y, BALLRADIUS, 0, 2*Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    // Draw the scores onto the screen
    let fontSize = canvas.width/16;
    ctx.fillStyle = "#ffffff";
    ctx.font = `${fontSize}px PongScore`;
    ctx.fillText(player_score, canvas.width/4, canvas.height/8);
    ctx.fillText(opponent_score, 3*(canvas.width/4), canvas.height/8);

    // Move the paddle according to the input
    if (gameState == 2) move();
    else {
        if (BALL.x < canvas.width/2) {
            if (PADDLES["player"].y + PADDLEHEIGHT/2 > BALL.y) PADDLES["player"].y -= MOVEMENT;
            else if (PADDLES["player"].y + PADDLEHEIGHT/2 < BALL.y) PADDLES["player"].y += MOVEMENT;

            if (PADDLES["player"].y - BALLRADIUS < 0) PADDLES["player"].y = BALLRADIUS;
            else if (PADDLES["player"].y + PADDLEHEIGHT + BALLRADIUS > canvas.height) PADDLES["player"].y = canvas.height - PADDLEHEIGHT - BALLRADIUS;
        }
    }

    // Adjust the AI paddle position
    if (BALL.x > canvas.width/2) {
        if (PADDLES["ai"].y + PADDLEHEIGHT/2 > BALL.y) PADDLES["ai"].y -= MOVEMENT;
        else if (PADDLES["ai"].y + PADDLEHEIGHT/2 < BALL.y) PADDLES["ai"].y += MOVEMENT;

        if (PADDLES["ai"].y - BALLRADIUS < 0) PADDLES["ai"].y = BALLRADIUS;
        else if (PADDLES["ai"].y + PADDLEHEIGHT + BALLRADIUS > canvas.height) PADDLES["ai"].y = canvas.height - PADDLEHEIGHT - BALLRADIUS;
    }

    // Adjust the ball's position
    if (BALL.y + BALLRADIUS >= canvas.height || BALL.y - BALLRADIUS < 0) {
        balldy = -balldy; 
        if (gameState == 2) changeYSpeed();
    }

    // Player paddle collision
    else if ((BALL.x - BALLRADIUS >= PADDLES["player"].x && BALL.x - BALLRADIUS <= PADDLES["player"].x + PADDLEWIDTH) &&
             (BALL.y - BALLRADIUS >= PADDLES["player"].y && BALL.y + BALLRADIUS <= PADDLES["player"].y + PADDLEHEIGHT)
    ) {
        balldx = -balldx; 
        if (gameState == 2) changeXSpeed();
    }

    // AI paddle collision
    else if ((BALL.x + BALLRADIUS >= PADDLES["ai"].x && BALL.x + BALLRADIUS <= PADDLES["ai"].x + PADDLEWIDTH) &&
             (BALL.y + BALLRADIUS >= PADDLES["ai"].y && BALL.y - BALLRADIUS <= PADDLES["ai"].y + PADDLEHEIGHT)
    ) {
        balldx = -balldx; 
        if (gameState == 2) changeXSpeed();
    }
    BALL.y += balldy;
    BALL.x += balldx;

    // Identify if the ball is out of bounds
    if (BALL.x - BALLRADIUS <= 0) {opponent_score += 1; gameOver();}
    else if (BALL.x + BALLRADIUS >= canvas.width) {player_score += 1; gameOver();}
}

function gameOver() {
    start(true);
    draw();
    clearInterval(interval)
    setTimeout(() => interval = setInterval(draw, 1000 / FPS), 250);
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
    PADDLES["player"].y -= MOVEMENT;

    // Ensure the paddle cannot leave the canvas
    if ((PADDLES["player"].y - BALLRADIUS) < 0) PADDLES["player"].y = BALLRADIUS;
}

function moveDown() {
    // Move the paddle downwards
    PADDLES["player"].y += MOVEMENT;

    // Ensure the paddle cannot leave the canvas
    if ((PADDLES["player"].y + PADDLEHEIGHT + BALLRADIUS) > canvas.height) PADDLES["player"].y = canvas.height - PADDLEHEIGHT - BALLRADIUS;
}

// Add the events to handle the paddle movements (desktop)
document.addEventListener("keydown", (event) => {
    gameState = 2;
    if (event.key == "ArrowUp") upPress = true;
    else if (event.key == "ArrowDown") downPress = true;
});
document.addEventListener("keyup", (event) => {
    gameState = 2;
    if (event.key == "ArrowUp") upPress = false;
    else if (event.key == "ArrowDown") downPress = false;
});

// Add the events to handle the paddle movements (buttons)
document.querySelector('#up').addEventListener("mousedown", () => {upPress = true; gameState = 2;});
document.querySelector('#up').addEventListener("mouseup", () => {upPress = false; gameState = 2;});
document.querySelector('#down').addEventListener("mousedown", () => {downPress = true; gameState = 2;});
document.querySelector('#down').addEventListener("mouseup", () => {downPress = false; gameState = 2;});

// Add events to handle paddle movements (buttons) for mobile devices
document.querySelector('#up').addEventListener("touchstart", () => {upPress = true; gameState = 2;});
document.querySelector('#up').addEventListener("touchend", () => {upPress = false; gameState = 2;});
document.querySelector('#down').addEventListener("touchstart", () => {downPress = true; gameState = 2;});
document.querySelector('#down').addEventListener("touchend", () => {downPress = false; gameState = 2;});

// Adapted from https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace
async function load_font() {
    const font = new FontFace("PongScore", 'url("/fonts/pong-score.otf.woff2")'); // Retrieved from https://fontstruct.com/fontstructions/show/1158273/pong_score
    await font.load();
    document.fonts.add(font);
}