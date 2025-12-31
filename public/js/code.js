reference = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
applications = ["BallBounce/index.html", "Pong/index.html", "Wanted/index.html"];
code = [];

// Add each key to an array to keep track of them
document.addEventListener("keydown", (event) => {
    code.push(event.key);

    // Check to ensure that the constructed array is the same as the reference array
    if (codeComplete()) window.location = "/Projects/Games/" + applications[Math.floor(Math.random() * applications.length)];
    else if (code.length > reference.length) code = []; // Reset the array if the sequence is incorrect
});

function codeComplete() {
    // Return false if the arrays are not the same length (and therefore cannot be the same)
    if (code.length !== reference.length) return false;

    // Check each element of both arrays to ensure that they match
    for (let i = 0; i < code.length; i++) {
        if (code[i] !== reference[i]) return false;
    }

    return true;
}