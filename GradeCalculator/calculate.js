document.addEventListener('DOMContentLoaded', function() {
    var table = document.querySelector('table');
    table.addEventListener('change', updateFooter);
});

function updateFooter() {
    // Select the table footer
    var tableFoot = document.querySelector('table').querySelector('tfoot').querySelectorAll('td');

    // Calculate the values
    var weightSum = sumElements();
    var weightedAverage = calculateWeightedAverage();

    // Ensure that both fields are numbers
    if (isNaN(weightedAverage) || isNaN(weightSum)) {
        weightSum = 0;
        weightedAverage = 0;
    }

    // Insert values into table
    tableFoot[1].innerHTML = weightSum + "%";
    tableFoot[3].innerHTML = weightedAverage.toFixed(2) + "%";

    // Change the text if the weighting sum is equal to 100%
    if (weightSum == 100) {
        tableFoot[2].innerHTML = "Final Score";
    }
}

function sumElements() {
    // Select the table body
    var table = document.querySelector('table').querySelector('tbody');

    // Calculate the sum of weights and sum of marks
    let sum = 0;
    for (let i = 0; i < table.rows.length; i++) {
        // Get the value of the row
        weighting = table.rows[i].cells[1].children[0].value;
        mark = table.rows[i].cells[2].children[0].value;

        // Ensure the values aren't empty
        if (weighting == "" || mark == "") {
            continue;
        }

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

function calculateWeightedAverage() {
    // Select the table body
    var table = document.querySelector('table').querySelector('tbody');

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