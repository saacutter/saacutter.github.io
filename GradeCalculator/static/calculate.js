document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#calculate').addEventListener('change', updateTable);
    document.querySelector('#final-table').addEventListener('change', calculateRequiredMark);
});

function updateTable() {
    // Select the table footer
    var tableFoot = document.querySelector('#calculate').querySelector('tfoot').querySelectorAll('td');

    // Calculate the values
    var weightSum = sumElements();
    var average = calculateAverage();

    // Ensure that both fields are numbers
    if (isNaN(average) || isNaN(weightSum)) {
        weightSum = 0;
        average = 0;
    }

    // Insert values into table
    tableFoot[1].innerHTML = weightSum + "%";
    tableFoot[3].innerHTML = average.toFixed(2) + "%";

    // Change the text if the weighting sum is equal to 100%
    if (weightSum == 100) {
        tableFoot[2].innerHTML = "Final Score";
        return;
    }

    // Change the values of the final grade calculator
    var finalTable = document.querySelector('#final-table').querySelector('tbody').querySelectorAll('td');
    finalTable[1].children[0].value = average;
    finalTable[5].children[0].value = 100 - weightSum;
}

function sumElements() {
    // Select the table body
    var table = document.querySelector('#calculate').querySelector('tbody');

    // Calculate the sum of weights and sum of marks
    let sum = 0;
    for (let i = 0; i < table.rows.length; i++) {
        // Get the value of the row
        weighting = table.rows[i].cells[1].children[0].value;
        mark = table.rows[i].cells[2].children[0].value;

        // Ensure the values are valid
        invalid = false;
        if (weighting < 0 || weighting > 100) {
            table.rows[i].cells[1].children[0].value = "";
            invalid = true;
        }
        if (mark < 0 || mark > 100) {
            table.rows[i].cells[2].children[0].value = "";
            invalid = true;
        }
        if (invalid) return;

        // Add the entry's weighting to the total sum
        sum += Number(weighting);

        // Ensure the total weighting isn't above 100%
        if (sum > 100) {
            alert("The weighting total cannot be greater than 100%.");
            table.rows[i].cells[2].children[0].value = table.rows[i].cells[1].children[0].value = "";
            return 0;
        }
    }

    return sum;
}

function calculateAverage() {
    // Select the table body
    var table = document.querySelector('#calculate').querySelector('tbody');

    // Calculate the weighted sum
    let weightedSum = 0;
    for (let i = 0; i < table.rows.length; i++) {
        // Get the values of the row
        weighting = Number(table.rows[i].cells[1].children[0].value) / 100;
        mark = Number(table.rows[i].cells[2].children[0].value) / 100;

        // Add the row's values to the sum
        weightedSum += (weighting * mark) * 100;
    }

    // Calculate the total weight as a fraction
    totalWeight = sumElements() / 100;

    // Return the weighted average calculation
    return weightedSum / totalWeight;
}

function calculateRequiredMark() {
    // Select the table cells
    var table = document.querySelector('#final-table');
    var tableCells = table.querySelector('tbody').querySelectorAll('td');

    // Extract the values from the table
    current = tableCells[1].children[0].value;
    target = tableCells[3].children[0].value;
    finalWeight = tableCells[5].children[0].value;

    // Ensure the values given are valid
    invalid = false;
    if (current < 0 || current > 100) {
        tableCells[1].children[0].value = "";
        invalid = true;
    }
    if (target < 0 || target > 100) {
        tableCells[3].children[0].value = "";
        invalid = true;
    }
    if (finalWeight < 0 || finalWeight > 100) {
        tableCells[5].children[0].value = "";
        invalid = true;
    }
    if (invalid) return;

    // Convert values into decimals
    current /= 100;
    target /= 100;
    finalWeight /= 100;
    currentWeight = 1- finalWeight;

    // Calculate the required mark
    required = (target - (current * currentWeight)) / finalWeight;
    if (required < 0 || isNaN(required)) {
        return;
    }

    table.querySelector('tfoot').querySelectorAll('td')[1].innerHTML = (required * 100).toFixed(2) + "%";
}