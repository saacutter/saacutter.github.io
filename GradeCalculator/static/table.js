document.addEventListener('DOMContentLoaded', function() {
    var button = document.querySelectorAll('button');
    button[0].addEventListener('click', addAssessment);
    button[1].addEventListener('click', removeAssessment);
    button[2].addEventListener('click', clearTable);
});

function addAssessment() {
    // Select the table
    var tableBody = document.querySelector('table').querySelector('tbody');
    
    // Create the table row
    var row = tableBody.insertRow();

    // Insert cells into each column
    var name = row.insertCell(0);
    var weighting = row.insertCell(1);
    var mark = row.insertCell(2);

    // Create the name input
    var nameInput = document.createElement('input');
    nameInput.setAttribute('name', 'name');
    nameInput.setAttribute('type', 'text');
    name.appendChild(nameInput);

    // Create the weighting input
    var weightingInput = document.createElement('input');
    weightingInput.setAttribute('name', 'weighting');
    weightingInput = addAttributes(weightingInput);
    weighting.appendChild(weightingInput);

    // Create the mark input
    var markInput = document.createElement('input');
    markInput.setAttribute('name', 'mark');
    markInput = addAttributes(markInput);
    mark.appendChild(markInput);
}

function addAttributes(input) {
    input.setAttribute('type', 'number');
    input.setAttribute('min', '0');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('required', true);
    return input;
}

function removeAssessment() {
    // Select the table
    var table = document.querySelector('table').querySelector('tbody');

    // Delete the last row if there is more than one
    if (table.rows.length > 1) {
        table.deleteRow(table.rows.length - 1);
    } else {
        alert("The requested action could not be performed.");
    }
}

function clearTable() {
    // Select the table
    var table = document.querySelector('table').querySelector('tbody');

    // Clear the value for each row's cells
    for (let i = 0; i < table.rows.length; i++) {
        for (let j = 0; j < table.rows[i].cells.length; j++) {
            table.rows[i].cells[j].children[0].value = "";
        }
    }

    updateFooter();

    /* Alternate implementation
    for (let i = table.rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    } 
    */
}