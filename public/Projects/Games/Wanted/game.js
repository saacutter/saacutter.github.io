const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');
const FPS = 60;
const SPRITEWIDTH = 30;
const SPRITEHEIGHT = 30;
gameState = 1; // 1 = intro, 2 = in game, 3 = found
introTimeout = false;

// Load the images
loadImages();
CHARACTERS = [MARIO, LUIGI, YOSHI, WARIO];

// Set the game loop interval
interval = setInterval(() => {
    if (gameState == 1) intro();
    else if (gameState == 2) draw();
}, 1000 / FPS);

// Add the click handler for the game
canvas.addEventListener('click', (e) => {
    if (gameState == 2) click(e);
});

function intro() {
    // Clear the background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create a spotlight for the character
    ctx.arc(canvas.width/2, canvas.height/2, 3*(SPRITEWIDTH/2), 0, 2*Math.PI);
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fill();

    // Draw the wanted character
    ctx.drawImage(SPRITES[0].colour, canvas.width/2 - SPRITEWIDTH/2, canvas.height/2 - SPRITEHEIGHT/2, SPRITEWIDTH, SPRITEHEIGHT);

    // Change the game's state once
    if (!introTimeout) {
        setTimeout(() => gameState = 2, 2000);
        introTimeout = true;
    }
}

function start() {
    // Decide if the sprites should move or be stationary
    isMoving = Math.random() < 0.3 ? true : false;

    // Randomly select the wanted character
    WANTED = CHARACTERS[Math.floor(Math.random()*CHARACTERS.length)];
    CHARACTERS.splice(CHARACTERS.indexOf(WANTED), 1);

    // Create wanted character object
    SPRITE_COUNT = Math.ceil(Math.random() * ((canvas.width/4) - 1) + (canvas.width/40));
    SPRITES = [];
    WANTED_OBJ = {
        x: isMoving == true ? Math.floor(Math.random() * (canvas.width - 15) + 15) : Math.random() * (canvas.width - SPRITEWIDTH*2) + SPRITEWIDTH,
        y: isMoving == true ? Math.floor(Math.random() * (canvas.height - 15) + 15) : Math.random() * (canvas.height - SPRITEHEIGHT*2) + SPRITEHEIGHT,
        colour: WANTED,
        xdir: Math.random() < 0.5 ? 1 : -1,
        ydir: Math.random() < 0.5 ? 1 : -1,
        dx: (Math.random()) + 1.25,
        dy: (0.25*Math.random()) + 0.6
    }
    SPRITES[0] = WANTED_OBJ; // Wanted object is the first sprite (so it is always drawn first)

    // Initialise the sprites to random locations
    for (let i = 1; i < SPRITE_COUNT; i++) {
        SPRITES[i] = {
            x: isMoving == true ? Math.random() * (canvas.width - 15) + 15 : Math.random() * (canvas.width - SPRITEWIDTH*2) + SPRITEWIDTH,
            y: isMoving == true ? Math.random() * (canvas.height - 15) + 15 : Math.random() * (canvas.height - SPRITEHEIGHT*2) + SPRITEHEIGHT,
            colour: CHARACTERS[Math.floor(Math.random()*CHARACTERS.length)],
            xdir: Math.random() < 0.5 ? 1 : -1,
            ydir: Math.random() < 0.5 ? 1 : -1,
            dx: Math.random() + 1,
            dy: (0.25*Math.random()) + 0.5
        };
    }

    // Get the user's high score
    //HIGHSCORE = localStorage.getItem("high_score_wanted") || 0;
    //score = 0;
}

function draw() {
    // Clear the background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the objects
    for (let i = 0; i < SPRITE_COUNT; i++) ctx.drawImage(SPRITES[i].colour, SPRITES[i].x, SPRITES[i].y, SPRITEWIDTH, SPRITEHEIGHT);

    // Adjust the sprites' positions
    if (isMoving) {
        for (let i = 0; i < SPRITE_COUNT; i++) {
            // Adjust x position if out of bounds
            if (SPRITES[i].x > canvas.width) {SPRITES[i].x = -SPRITEWIDTH}
            else if (SPRITES[i].x < -SPRITEWIDTH) {SPRITES[i].x = canvas.width}

            // Adjust y position if out of bounds
            if (SPRITES[i].y >= canvas.height) {SPRITES[i].y = -SPRITEHEIGHT}
            else if (SPRITES[i].y < -SPRITEHEIGHT) {SPRITES[i].y = canvas.height}

            // Adjust x and y position
            SPRITES[i].x += SPRITES[i].xdir*SPRITES[i].dx;
            SPRITES[i].y += SPRITES[i].ydir*SPRITES[i].dy;
        }
    }
}

function loadImages() {
    MARIO = new Image();
    MARIO.src = "mario.png";

    YOSHI = new Image();
    YOSHI.src = "yoshi.png";

    WARIO = new Image();
    WARIO.src = "wario.png";

    LUIGI = new Image();
    LUIGI.src = "luigi.png";
}

function click(event) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    if (x >= SPRITES[0].x && x <= SPRITES[0].x + SPRITEWIDTH && y >= SPRITES[0].y && y <= SPRITES[0].y + SPRITEHEIGHT) {
        // Stop redrawing every sprite
        gameState = 3;

        // Highlight the wanted character's position
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(SPRITES[0].colour, SPRITES[0].x, SPRITES[0].y, SPRITEWIDTH, SPRITEHEIGHT);

        // Add wanted character back to possible options
        CHARACTERS.push(WANTED);

        // Wait 2 seconds before starting again
        setTimeout(() => {
            introTimeout = false; 
            gameState = 1; 
            start();
        }, 2000);
    }
}