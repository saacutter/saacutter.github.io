function addAssessment() {
    // Select the table
    var tableBody = document.querySelector('#calculate').querySelector('tbody');
    
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
    var table = document.querySelector('#calculate').querySelector('tbody');

    // Delete the last row if there is more than one
    if (table.rows.length > 1) {
        table.deleteRow(table.rows.length - 1);
        updateTable();
    } else {
        alert("The requested action could not be performed.");
    }
}

function clearMainTable() {
    // Select the table cells
    var tableCells = document.querySelector('#calculate').querySelector('tbody').querySelectorAll('td');

    // Clear the value for each row's cells
    for (let i = 0; i < tableCells.length; i++) {
        tableCells[i].children[0].value = "";
    }

    updateTable();
    clearFinalTable();
}

function clearFinalTable() {
    // Select the table cells
    var tableCells = document.querySelector('#final-table').querySelector('tbody').querySelectorAll('td');

    // Clear the value for each row's cells
    for (let i = 1; i < tableCells.length; i += 2) {
        tableCells[i].children[0].value = "";
    }

    // Clear the required mark
    document.querySelector('#final-table').querySelector('tfoot').querySelectorAll('td')[1].innerHTML = "0.00%";
}