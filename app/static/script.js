window.setTimeout(function () {
    $(".alert").fadeTo(500, 0)
}, 1000);

function showAddExerciseForm() {
    // Create a new table row
    var newRow = document.createElement("tr");
    newRow.id = "add-exercise-row";

    // Create table cells for the form fields
    var exerciseCell = document.createElement("td");

    // Add input fields to the table cells
    exerciseCell.innerHTML = '<input type="text" class="form-control" name="exercise" placeholder="Exercise" autofocus>';

    // Add the cells to the row
    newRow.appendChild(exerciseCell);
    
    // Insert the new row before the first row in the table
    var tableBody = document.getElementById("exercise-table-body");
    tableBody.insertBefore(newRow, tableBody.firstChild); 

    var inputField = newRow.querySelector("input");
    inputField.addEventListener("keypress", function (event) {
        // If "Enter" key is pressed, create a new exercise row
        if (event.key === "Enter") {
            addExerciseRow(inputField.value);
            event.preventDefault();
        }
    });
    inputField.focus();
}

function addExerciseRow(exerciseName) {
    // Create a new table row
    var newRow = document.createElement("tr");

    // Create table cells for the exercise name and delete button
    var exerciseCell = document.createElement("td");

    // Set the text for the exercise name cell
    exerciseCell.textContent = exerciseName;

    // Add the delete button to the delete cell
    deleteCell.innerHTML = '<button type="button" class="btn btn-danger btn-sm" onclick="deleteExerciseRow(this)">Delete</button>';

    // Add the cells to the row
    newRow.appendChild(exerciseCell);

    // Add the row to the table body
    var tableBody = document.getElementById("exercise-table-body");
    tableBody.appendChild(newRow);
}