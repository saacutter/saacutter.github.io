const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');
ctx.font = "1em Helvetica";

// Create the background image objects (source: https://free-game-assets.itch.io/ocean-and-clouds-free-pixel-art-backgrounds)
const BG = ["ocean_day.png", "ocean_day2.png", "ocean_sunset.png", "ocean_night.png"];
load_images();

function start() {
    // Attempt to clear the current game by clearing the interval
    try {
        clearInterval(interval);
        game_over = false;
    } catch (Exception) {};

    // Define constants for the pipes
    PIPECOUNT = Math.ceil(canvas.width / 300);
    PIPEWIDTH = canvas.width / 20;
    PIPEHEIGHT = canvas.height;
    LIPHEIGHT = PIPEWIDTH / 2;

    // Load the font
    load_font();

    // Create the ball object
    ball = {x: 40, y: canvas.height / 2, radius: canvas.width / 80};
    ballWidth = Math.PI * 2;
    bdy = 40;

    // Initialise the pipes
    PIPES = [];
    BASE = 0;
    canvas.width >= 720 ? BASE = canvas.width : BASE = canvas.width*1.5;
    for (let i = 0; i < PIPECOUNT; i++) {
        PIPES[i] = {
            x: ((BASE + PIPEWIDTH + 30) / PIPECOUNT)*(i + 1), 
            y: (canvas.height / 2) + variation(),
            scored: false
        };
    }

    // Initialise constants for falling physics
    GRAVITY = 0.05;
    velocity = 0;

    // Get the user's high score
    HIGHSCORE = localStorage.getItem("high_score_fb") == null ? 0 : localStorage.getItem("high_score_fb");

    // Create an index to maintain the current background
    INDEX = 0;
    setTimeout(changeBackground, 30000);

    // Start the game (drawing a new frame every 15ms for 60fps)
    interval = setInterval(draw, 16.66);
    score = 0;
}

function draw() {
    // Draw the background (clears the canvas)
    ctx.drawImage(BG[INDEX], 0, 0, canvas.width, canvas.height);

    // Draw the objects
    drawPipePair();
    drawBall();

    // Adjust the ball's position
    if (ball.y >= canvas.height - ballWidth) gameOver();
    else if (collision()) gameOver();
    else {
        velocity += GRAVITY;
        ball.y += velocity;
    }

    // Adjust the pipe's position
    for (let i = 0; i < PIPECOUNT; i++) {
        if (PIPES[i].x + PIPEWIDTH < 0) {
            PIPES[i].x = BASE;
            PIPES[i].y = (canvas.height / 2) + variation();
            PIPES[i].scored = false;
        } else {
            PIPES[i].x -= 2;
        }

        if (!PIPES[i].scored && (PIPES[i].x + PIPEWIDTH) < ball.x) {
            PIPES[i].scored = true;
            score++;
        }
    }
}

function drawPipePair() {
    for (let i = 0; i < PIPECOUNT; i++) {
        ctx.beginPath();

        // Draw bottom pipe
        ctx.rect(PIPES[i].x, PIPES[i].y + 60, PIPEWIDTH, PIPEHEIGHT);
        ctx.rect(PIPES[i].x - (PIPEWIDTH / 4), PIPES[i].y + 60, PIPEWIDTH + PIPEWIDTH/2, 20);

        // Draw top pipe
        ctx.rect(PIPES[i].x, PIPES[i].y - 80 - PIPEHEIGHT, PIPEWIDTH, PIPEHEIGHT);
        ctx.rect(PIPES[i].x - (PIPEWIDTH / 4), PIPES[i].y - 80, PIPEWIDTH + PIPEWIDTH/2, 20);

        // Colour the pipes
        ctx.fillStyle = "green";
        ctx.fill();

        ctx.closePath();
    }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, ballWidth);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

function gameOver() {
    clearInterval(interval);
    game_over = true;

    // Create game over screen
    ctx.fillStyle = "#252c30ff";
    ctx.fillRect(canvas.width/4, canvas.height/4, 2*(canvas.width/4), 2*(canvas.height/4));

    // Add game over text
    let fontSize = canvas.width/16;
    ctx.font = `${fontSize}px Jaro`;
    ctx.fillStyle = "#ffffffff";
    ctx.fillText("GAME OVER", canvas.width/2 - 3*(canvas.width/20), 1.8*(canvas.height/4));

    // Add the scores
    fontSize = 0.5*fontSize;
    ctx.font = `${fontSize}px Jaro`;
    ctx.fillText("Score", canvas.width/4 + 2*(canvas.width/30), 2.25*(canvas.height/4));
    ctx.fillText(`${score}`, canvas.width/4 + 2*(canvas.width/30), 2.5*(canvas.height/4));
    if (score > HIGHSCORE) {
        localStorage.setItem("high_score_fb", score);
        ctx.fillText("New High Score!", canvas.width/2 - 7*(canvas.width/30), 2.75*(canvas.height/4));
    }
    ctx.fillText("High Score", canvas.width/4 + 10*(canvas.width/30), 2.25*(canvas.height/4));
    ctx.fillText(`${localStorage.getItem("high_score_fb")}`, canvas.width/4 + 10*(canvas.width/30), 2.5*(canvas.height/4));
}

function variation() {
    // Adapted from https://stackoverflow.com/questions/8611830/javascript-random-positive-or-negative-number
    return Math.round(Math.random() * (canvas.height/3) * ((Math.round(Math.random()) * 2) - 1));
}

function move() {
    if (ball.y - bdy < 0) ball.y = 0; // Stop the ball from going further than the canvas border
    else {
        moveInterval = setInterval(() => {ball.y -= 4}, 10);
        setTimeout(() => clearInterval(moveInterval), 80);

        // Reset the velocity
        velocity = 0.05;
    }
}

function collision() {
    for (let i = 0; i < PIPECOUNT; i++) {
        let pipe = PIPES[i];
        if (
            (ball.x >= (pipe.x - (PIPEWIDTH / 4)) && ball.x <= pipe.x + PIPEWIDTH) && // Check if the ball is within the pipe's width
            ((ball.y + LIPHEIGHT + ballWidth) > (pipe.y + 80) || (ball.y - LIPHEIGHT - ballWidth) < (pipe.y - 70)) // Check if the ball is between the pipes
        ) return true;
    }
    return false;
}

// Handle the ball's up movement
document.addEventListener("keydown", (event) => {if (event.key == "ArrowUp") move()});
document.getElementById('screen').addEventListener('click', () => {
    if (!game_over) move();
    else start();
});

async function load_images() {
    for (let i = 0; i < BG.length; i++) {
        let img = new Image();
        await img;
        img.src = BG[i];
        BG[i] = img;
    }
}

function changeBackground() {
    if (INDEX < BG.length) INDEX++;
    if (INDEX >= BG.length) INDEX = 0;
    setTimeout(changeBackground, 30000);
}

// Adapted from https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace
async function load_font() {
    const font = new FontFace("Jaro", 'url("/fonts/Jaro-Regular.ttf")');
    await font.load();
    document.fonts.add(font);
}

start();