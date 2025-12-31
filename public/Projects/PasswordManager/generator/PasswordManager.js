document.addEventListener('DOMContentLoaded', function() {
    generatePassword();
});

function generatePassword(length, chars) {
    // Initialise the default string of characters
    var chars = "abcdefghijklmnopqrstuvwxyz";

    // Get the length input
    length = Number(document.querySelector('#length-input').value);
    if (length < 1 || length > 64) {
        alert("The length value is not valid. It must be in the range 1-64 (inclusive).")
        return;
    }

    // Get additional options and add to choices
    uppercase = document.querySelector('#uppercase-ckbox');
    numbers = document.querySelector('#numbers-ckbox');
    punctuation = document.querySelector('#punctuation-ckbox');
    if (uppercase.checked) {
        chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    if (numbers.checked) {
        chars += "1234567890";
    }
    if (punctuation.checked) {
        chars += "!@$^*?#%";
    }

    // Add random characters in the sequence to create a random string
    var result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.random() * chars.length);
    }

    // Set the value of the password field to the string
    var passwordButton = document.querySelector('input');
    passwordButton.value = result;
}