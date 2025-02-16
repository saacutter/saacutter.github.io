document.addEventListener('DOMContentLoaded', function() {
    // Listen for the button being clicked
    let button = document.querySelector('#add-password-btn');
    button.addEventListener('click', createPasswordDiv);
});

function createPasswordDiv() {
    // Identify the form
    var form = document.querySelector('#form').elements;

    // Do not create an entry if the required element is empty
    if (form['service'].value === "") {
        alert("A name is required.");
        return;
    }

    // Select the main password div
    var containerDiv = document.querySelector('#passwords');

    // Create a div for the entry
    var entryDiv = document.createElement('div');
    entryDiv.style = "display: flex;"
    entryDiv.classList = "btm-margin black-border round-border center password-entry";
    containerDiv.appendChild(entryDiv);

    // Create the container division
    var detailsDiv = document.createElement('div');
    detailsDiv.classList = "details";

    // Create the main and sub elements and retrieve the values from the form
    var main = document.createElement('p');
    main.classList = "main";
    main.appendChild(document.createTextNode(form['service'].value))
    var sub = document.createElement('p');
    sub.classList = "sub";
    sub.appendChild((document.createTextNode(form['username'].value)));
    detailsDiv.appendChild(main);
    detailsDiv.appendChild(sub);

    // Create the password div
    var passwordDiv = document.createElement('div');
    passwordDiv.classList = "password";

    // Add the password to the div
    var password = document.createElement('p');
    password.classList = "sub";
    password.appendChild(document.createTextNode(form['password'].value));
    passwordDiv.appendChild(password);

    // Append the entry and password div to the container div
    entryDiv.appendChild(detailsDiv);
    entryDiv.appendChild(passwordDiv);

    // Reset the form
    document.querySelector('#form').reset();
}