const validKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '+', '-', '/', '*', '(', ')', '%'];
let isResult = false;

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', pressKeyboard);
});

function updateDisplay(character) {
    // Locate the display element
    display = document.querySelector('.display');

    // Clear the display if there was an error
    if (display.value == "Invalid") {
        displayDefault();
    } else if (character === '') {
        // Truncate the last element off the end
        display.value = truncateEnd(display.value);

        // Ensure that there is always a value in the box
        if (display.value === '') {
            displayDefault();
        }
    } else {
        // Replace the initial value or add it onto the display
        if (display.value === '0') {
            display.value = character;
        } else {
            display.value += character;
        }
    }
}

function displayDefault() {
    // Locate the display element
    display = document.querySelector('.display');

    // Set the value to the default
    display.value = '0';

    // Reset result switch
    isResult = false;
}

function calculate() {
    // Locate the display element
    display = document.querySelector('.display');

    // Evaluate the current text within the display
    try {
        // Replace division and percentage signs
        let expression = display.value.replace('÷', '/').replace('×', '*').replace('%', '/100');

        // Evaluate expression
        result = eval(expression);
        isResult = true;

        // TODO: Process if the result is above a certain length
    } catch (Exception) {
        // Display an error message
        result = "Invalid";
    }

    // Set the result to the display value
    display.value = result;
}

function truncateEnd(equation) {
    return equation.slice(0, -1);
}

function pressKeyboard(event) {
    // Locate the display element
    display = document.querySelector('.display');

    // Identify the key that was pressed down
    let key = event.key;
    
    // Update the display if the key is valid
    if (validKeys.includes(key)) {
        // Replace the equivalent keys with equivalent symbols
        switch (key) {
            case '/':
                key = ' ÷ ';
                break;
            case '*':
                key = ' × ';
                break;
            case '+':
                key = ' + ';
                break;
            case '-':
                key = ' - ';
                break;
        }

        // TODO: Check the previous key to see if it is already an operator

        // Update the display with the key
        updateDisplay(key);
    } else if (key === 'Backspace') {
        if (display.value === "Invalid" || isResult) {
            displayDefault();
        } else {
            updateDisplay('');
        }
    } else if (key === 'Enter') {
        calculate();
    }
}