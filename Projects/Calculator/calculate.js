document.addEventListener('DOMContentLoaded', () => {
    const validKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '+', '-', '/', '*', '(', ')', '%'];
    const operators = ['+', '-', '÷', '×', '.', '^', '%'];
    let display = document.querySelector('.display');
    let isResult = false;

    // Enable keyboard inputs
    document.addEventListener('keydown', pressKeyboard);

    // Enable button functionality
    let buttons = document.querySelectorAll('button[data-value]');
    buttons.forEach((button) => {
        let value = button.dataset.value;
        switch (value) {
            case 'clear':
                button.addEventListener('click', displayDefault);
                break;
            case 'calculate':
                button.addEventListener('click', calculate);
                break;
            default:
                button.addEventListener('click', () => updateDisplay(value));
        }
    });

    function updateDisplay(character) {
        // If there is currently no input, cancel the operation
        let curVal = display.innerHTML.trim();
        if (curVal.length === 1 && curVal === '0' && operators.includes(character.trim()) && character !== '.') return;

        // If the last character and current character are both operators, replace the old operator with the new one
        let lastChar = curVal[curVal.length - 1];
        if (operators.includes(lastChar) && operators.includes(character.trim())) display.innerHTML = truncateEnd(display.innerHTML.trim()).trim();

        // Clear the display if there was an error
        if (display.innerHTML == "Invalid") {
            displayDefault();
        } else if (character === '') {
            // If the current value is a result value, then delete should act as a clear
            if (isResult) displayDefault();

            // Truncate the last element off the end
            display.innerHTML = truncateEnd(display.innerHTML);

            // Ensure that there is always a value in the box
            if (display.innerHTML === '') displayDefault();
        } else {
            // Replace the initial value or add it onto the display
            if (display.innerHTML === '0' || isResult) {
                if (character !== '.') display.innerHTML = character;
                else display.innerHTML += character;
            } else {
                display.innerHTML += character;
            }
        }
    }

    function displayDefault() {
        // Set the value to the default
        display.innerHTML = '0';

        // Reset result switch
        isResult = false;
    }

    function calculate() {
        try {
            // Replace division and percentage signs
            let expression = display.innerHTML.replace('÷', '/').replace('×', '*');

            // Evaluate expression
            result = math.evaluate(expression);
            isResult = true;
        } catch (Exception) {
            // Display an error message
            result = "Invalid";
        }

        // Set the result to the display value
        display.innerHTML = result;
    }

    function truncateEnd(equation) {
        return equation.slice(0, -1);
    }

    function pressKeyboard(event) {
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

            // Update the display with the key
            updateDisplay(key);
        } else if (key === 'Backspace') {
            if (display.innerHTML === "Invalid" || isResult) displayDefault();
            else updateDisplay('');
        } else if (key === 'Enter') calculate();
    }
});