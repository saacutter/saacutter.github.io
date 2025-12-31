const canvas = document.querySelector('#screen');
const ctx = canvas.getContext('2d');
ctx.font = "1em Helvetica";
const img = document.querySelector('#wanted')

// Constants
const FPS = 60;
const SPRITEWIDTH = 30;
const SPRITEHEIGHT = 30;

async function start() {
    // Attempt to clear the current game by clearing the interval
    try {
        clearInterval(interval);
    } catch (Exception) {};

    // Load the images
    await loadImages();
    COLOURS = [MARIO, LUIGI, YOSHI, WARIO];

    // Randomly select the wanted character
    WANTED = COLOURS[Math.floor(Math.random() * COLOURS.length)];
    img.src = WANTED.src;
    COLOURS.splice(COLOURS.indexOf(WANTED), 1);

    // Initialise the sprites to random locations
    SPRITE_COUNT = Math.ceil(Math.random() * ((canvas.width / 4) - 1) + (canvas.width / 40));
    SPRITES = [];
    for (let i = 1; i < SPRITE_COUNT; i++) {
        SPRITES[i] = {
            x: Math.random() * (canvas.width - 15) + 15,
            y: Math.random() * (canvas.height - 15) + 15,
            colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
            xdir: Math.random() < 0.5 ? 1 : -1,
            ydir: Math.random() < 0.5 ? 1 : -1,
            dx: Math.random() + 1,
            dy: (Math.random() * 0.25) + 0.5
        };
    }

    // Create wanted character object
    WANTED_OBJ = {
        x: Math.floor(Math.random() * (canvas.width - 15) + 15),
        y: Math.floor(Math.random() * (canvas.height - 15) + 15),
        colour: WANTED,
        xdir: Math.random() < 0.5 ? 1 : -1,
        ydir: Math.random() < 0.5 ? 1 : -1,
        dx: (Math.random()) + 1.25,
        dy: (Math.random() * 0.25) + 0.6
    }
    SPRITES[0] = WANTED_OBJ; // Wanted object is always the first sprite (so it is always drawn first)
    
    // Add a click handler to wanted object
    canvas.addEventListener('click', click);

    // Start the game
    interval = setInterval(draw, 1000 / FPS);
}

function draw() {
    // Clear the background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the objects
    drawSprites();

    // Adjust the sprites' positions
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

function drawSprites() {
    ctx.beginPath();
    for (let i = 0; i < SPRITE_COUNT; i++) {
        ctx.drawImage(SPRITES[i].colour, SPRITES[i].x, SPRITES[i].y, SPRITEWIDTH, SPRITEHEIGHT);
    }
    ctx.closePath();
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
        // Highlight the wanted character's position
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.drawImage(SPRITES[0].colour, SPRITES[0].x, SPRITES[0].y, SPRITEWIDTH, SPRITEHEIGHT);
        ctx.closePath();

        // Stop redrawing every sprite
        clearInterval(interval);

        // Add wanted character back to possible options
        COLOURS.push(WANTED);

        // Remove the click handler
        canvas.removeEventListener('click', click)

        // Wait 2 seconds before starting again
        setTimeout(start, 2000);
    }
}

start();