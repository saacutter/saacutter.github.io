const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');
FPS = 60;
gameState = 1; // 1 = intro, 2 = in game, 3 = game over

// Create the background image objects (source: https://free-game-assets.itch.io/ocean-and-clouds-free-pixel-art-backgrounds)
const BG = ["ocean_day.png", "ocean_day2.png", "ocean_sunset.png", "ocean_night.png"];
load_images();

// Load the font
load_font();

// Create the ball object
ball = {x: 40, y: canvas.height / 2, radius: canvas.width / 80};
ballWidth = Math.PI * 2;

// Initialise constants for falling physics
GRAVITY = 0.05;
UPVELOCITY = -2.5;
velocity = 0;

// Set the game loop interval
interval = setInterval(() => {
    if (gameState == 1) intro();
    else if (gameState == 2) draw();
}, 1000 / FPS);

// Add the input handlers
canvas.addEventListener('click', () => {
    if (gameState == 1) start(false);
    else if (gameState == 2) velocity = UPVELOCITY;
    else start(true);
});
document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowUp" || event.key == " ") {
        if (gameState == 2) velocity = UPVELOCITY;
        else if (gameState == 1) start(false);
        else start(true);
    }
});

function intro() {
    // Draw the background (clears the canvas)
    ctx.drawImage(BG[0], 0, 0, canvas.width, canvas.height);

    // Draw the ball
    drawBall();

    // Adjust the ball's position
    if (ball.y > 5*(canvas.height/8)) velocity = -3.5; // -3.5 looks better on the title screen
    velocity += GRAVITY;
    ball.y += velocity;

    // Create the start screen
    ctx.fillStyle = "#252c30ff";
    ctx.fillRect(2.25*(canvas.width/6), 2*(canvas.height/6), canvas.width/4, canvas.height/4);
    let fontSize = canvas.width/16;
    ctx.font = `${fontSize}px Jaro`;
    ctx.fillStyle = "#ffffffff";
    ctx.fillText("START", canvas.width/2 - 1.5*(canvas.width/20), canvas.height/2);
}

function start(retry) {
    gameState = 2;

    // Define constants for the pipes
    PIPECOUNT = Math.ceil(canvas.width / 300);
    PIPEWIDTH = canvas.width / 20;
    PIPEHEIGHT = canvas.height;
    LIPHEIGHT = PIPEWIDTH / 2;

    // If this has been called from a retry, reinitialise constants
    if (retry) {
        // Reset the ball's attributes
        ball.x = 40;
        ball.y = canvas.height / 2;
        ball.radius = canvas.width / 80;

        // Reset velocity
        velocity = 0;
    }

    // Initialise the pipes
    PIPES = [];
    BASE = 0;
    canvas.width >= 720 ? BASE = canvas.width : BASE = canvas.width*1.5;
    for (let i = 0; i < PIPECOUNT; i++) {
        PIPES[i] = {
            x: BASE - (PIPEWIDTH*PIPECOUNT) + ((BASE + PIPEWIDTH + 10*PIPECOUNT) / PIPECOUNT)*(i + 1), 
            y: (canvas.height/2) + variation(),
            scored: false
        };
    }

    // Get the user's high score
    HIGHSCORE = localStorage.getItem("high_score_fb") == null ? 0 : localStorage.getItem("high_score_fb");
    score = 0;

    // Create an index to maintain the current background
    INDEX = 0;
    try {
        clearInterval(BGINTERVAL);
    } catch (Exception) {}
    BGINTERVAL = setInterval(() => {
        if (INDEX < BG.length) INDEX++;
        if (INDEX >= BG.length) INDEX = 0;
    }, 30000);
}

function draw() {
    // Draw the background (clears the canvas)
    ctx.drawImage(BG[INDEX], 0, 0, canvas.width, canvas.height);

    // Draw the objects
    drawPipePair();
    drawBall();

    // Adjust the ball's position
    if (collision()) gameOver();
    else {
        velocity += GRAVITY;
        ball.y += velocity;
    }

    // If the ball is hitting the canvas border, reset its position and velocity
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        velocity = 0;
    }

    // Adjust the pipe's position
    for (let i = 0; i < PIPECOUNT; i++) {
        if (PIPES[i].x + 3*(PIPEWIDTH/2) < 0) { // 3*(PIPEWIDTH/2) == PIPEWIDTH + one side of lip
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

    // Add the score
    let fontSize = canvas.width/16;
    ctx.font = `${fontSize}pt Jaro`;
    ctx.fillStyle = "#000000";
    ctx.fillText(`${score}`, canvas.width/2, canvas.height/7);
    ctx.strokeStyle = "#ffffff"
    ctx.strokeText(`${score}`, canvas.width/2, canvas.height/7);
}

function drawPipePair() {
    for (let i = 0; i < PIPECOUNT; i++) {
        ctx.beginPath();

        // Draw bottom pipe
        ctx.rect(PIPES[i].x, PIPES[i].y + 40 + LIPHEIGHT, PIPEWIDTH, PIPEHEIGHT);
        ctx.rect(PIPES[i].x - (PIPEWIDTH/4), PIPES[i].y + 40, PIPEWIDTH + PIPEWIDTH/2, LIPHEIGHT);

        // Draw top pipe
        ctx.rect(PIPES[i].x, PIPES[i].y - 60 - LIPHEIGHT - PIPEHEIGHT, PIPEWIDTH, PIPEHEIGHT);
        ctx.rect(PIPES[i].x - (PIPEWIDTH/4), PIPES[i].y - 60 - LIPHEIGHT, PIPEWIDTH + PIPEWIDTH/2, LIPHEIGHT);

        // Colour the pipes
        ctx.fillStyle = "green";
        ctx.fill();

        // Add a black outline to the pipes
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000000"
        ctx.stroke();
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
    gameState = 3;

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
    ctx.fillText(`${localStorage.getItem("high_score_fb") || 0}`, canvas.width/4 + 10*(canvas.width/30), 2.5*(canvas.height/4));
}

function variation() {
    return Math.round(Math.random() * (canvas.height/3) * ((Math.round(Math.random()) * 2) - 1)); // Adapted from https://stackoverflow.com/questions/8611830/javascript-random-positive-or-negative-number
}

function collision() {
    // Check for ground collision
    if (ball.y >= canvas.height - ball.radius) return true;

    // Check for pipe collision
    for (let i = 0; i < PIPECOUNT; i++) {
        let pipe = PIPES[i];
        if (
            (ball.x >= pipe.x - (PIPEWIDTH/4) && ball.x <= pipe.x + PIPEWIDTH + (PIPEWIDTH/2)) && // Check if the ball is within the pipe's width
            (ball.y + ballWidth > pipe.y + 40 || ball.y - ballWidth < pipe.y - 50) // Check if the ball is between the pipes
        ) return true;
    }

    return false;
}

async function load_images() {
    for (let i = 0; i < BG.length; i++) {
        let img = new Image();
        img.src = BG[i];
        BG[i] = img;
    }
}

// Adapted from https://developer.mozilla.org/en-US/docs/Web/API/FontFace/FontFace
async function load_font() {
    const font = new FontFace("Jaro", 'url("/fonts/Jaro-Regular.ttf")');
    await font.load();
    document.fonts.add(font);
}