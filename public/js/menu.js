// Initialise the swiper object
const swiper = new Swiper('.swiper', {
    freeMode: {
        enabled: true,
        momentum: false,
    },
    grabCursor: true,
    longSwipes: false,
    slidesPerView: 3,
    slideNextClass: 'swiper-slide-next',
    slidePrevClass: 'swiper-slide-prev'
});


// Enable keyboard support for selecting games
const GAMES = document.querySelectorAll('.swiper-slide a');
const CONTROLS = document.querySelector('#menu-controls');
let curIndex = -1;

// Add the hover effects when any game is hovered over
GAMES.forEach((game, index) => game.addEventListener('mouseover', () => {
    removeCurrentlySelected();
    game.classList.add('programs-hover');
    CONTROLS.style.visibility = "visible";
    curIndex = index;
}));

// Remove the hover effect when the game is unhovered
GAMES.forEach((game) => game.addEventListener('mouseout', () => {
    removeCurrentlySelected();
}));

document.addEventListener('keydown', (event) => {
    let key = event.key;

    if (key == "ArrowRight") {
        removeCurrentlySelected();

        // Increment the current index by 1 and simulate hovering over the next game
        curIndex += 1;
        if (curIndex >= GAMES.length) curIndex = GAMES.length - 1;
        GAMES[curIndex].classList.add('programs-hover');
        swiper.slideTo(curIndex);

        // Make the menu controls visible
        CONTROLS.style.visibility = "visible";
        
        // Set the previous and next slides
        if (curIndex > 0) GAMES[curIndex - 1].classList.add('swiper-slide-prev');
        if (curIndex < GAMES.length - 1) GAMES[curIndex + 1].classList.add('swiper-slide-next');
    } else if (key == "ArrowLeft") {
        removeCurrentlySelected();

        // Decrement the current index by 1 and simulate hovering over the previous game
        curIndex -= 1;
        if (curIndex < 0) curIndex = 0;
        GAMES[curIndex].classList.add('programs-hover');
        swiper.slideTo(curIndex);

        // Make the menu controls visible
        CONTROLS.style.visibility = "visible";
        
        // Set the previous and next slides
        if (curIndex > 0) GAMES[curIndex - 1].classList.add('swiper-slide-prev');
        if (curIndex < GAMES.length - 1) GAMES[curIndex + 1].classList.add('swiper-slide-next');
    } else if (key == "ArrowUp" || key == "ArrowDown") {
        removeCurrentlySelected();
    } else if (key == "Enter") {
        window.location = GAMES[curIndex].href;
    }
});

function removeCurrentlySelected() {
    // Identify all currently selected games
    let currentlySelected = document.querySelectorAll('.programs-hover');

    // If there are any games currently selected, unhover them
    if (currentlySelected) currentlySelected.forEach((cur) => cur.classList.remove('programs-hover'));

    // Hide the menu controls
    CONTROLS.style.visibility = "hidden";

    // Remove any next and previous slide classes
    let previous = document.querySelectorAll('.swiper-slide-prev');
    if (previous) previous.forEach((prev) => prev.classList.remove('swiper-slide-prev'));

    let next = document.querySelectorAll('.swiper-slide-next');
    if (next) next.forEach((nx) => nx.classList.remove('swiper-slide-next'));
}


// Add the shuffle button implementation
document.querySelector('#shuffle').addEventListener('click', () => {
    let applications = document.querySelectorAll('.game');
    window.location = applications[Math.floor(Math.random() * applications.length)].href;
});