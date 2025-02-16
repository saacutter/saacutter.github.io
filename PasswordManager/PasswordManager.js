document.addEventListener('DOMContentLoaded', function() {
    // Identify the generate password button
    var button = document.querySelector('#generate');

    // Add an event listener to generate the random password
    button.addEventListener('click', function() {
        // Initialise the default string of characters
        var chars = "abcdefghijklmnopqrstuvwxyz";

        // Get the length input
        length = Number(document.querySelector('#length-input').value);
        if (length < 1 || length > 100) {
            return;
        }

        // Get attributes from the client
        uppercase = document.querySelector('#uppercase-ckbox');
        numbers = document.querySelector('#numbers-ckbox');
        punctuation = document.querySelector('#punctuation-ckbox');
        
        // Add uppercase letters to the possible choices
        if (uppercase.checked) {
            chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }

        // Add numbers to the possible choices
        if (numbers.checked) {
            chars += "1234567890";
        }

        // Add punctuation to the possible choices
        if (punctuation.checked) {
            chars += "!@$^*?#%";
        }

        // Generate the password
        var result = generatePassword(length, chars);

        // Set the value of the password field to the string
        var passwordButton = document.querySelector('#password-input');
        passwordButton.value = result;
    });
});

function generatePassword(length, chars) {
    // Create an empty string to hold the result
    let result = "";

    // Add random characters in the sequence to create a random string of the specified length
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.random() * chars.length);
    }

    return result;
}