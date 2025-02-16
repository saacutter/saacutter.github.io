document.addEventListener('DOMContentLoaded', function() {
    // Hide the entry form div
    var entryForm = document.querySelector('#add-login-panel');
    entryForm.style.display = "none";

    var body = document.querySelector('.main-page');
    var addButton = document.querySelector('#add-btn');
    addButton.addEventListener('click', function() {
        // Show the form
        entryForm.style.display = "block";

        // Disable the background
        body.setAttribute('disabled', true);
    });

    var closeButton = document.querySelector('#create-close');
    closeButton.addEventListener('click', function() {
        // Hide the form
        entryForm.style.display = "none";

        // Enable the background
        body.setAttribute('disabled', false);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Hide the options div
    var options = document.querySelector('#options-div');
    options.style.display = "none";

    var select = document.querySelector('#option-select');
    var opened = false;
    select.addEventListener('click', function() {
        // Show the options if hidden or hide if open
        if (!opened) {
            options.style.display = "block";
            opened = true;
        } else {
            options.style.display = "none";
            opened = false;
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Add a click listener to the button
    var addButton = document.querySelector('#add-password-btn');
    addButton.addEventListener('click', function() {
        var entryForm = document.querySelector('#add-login-panel');
        var body = document.querySelector('.main-page');
        var form = document.querySelector('#form');

        // Hide the form if the required element is shown
        if (form.elements['service'].value !== "") {
            // Hide the form
            entryForm.style.display = "none";

            // Enable the background
            body.setAttribute('disabled', false);
        }
    })
});