document.addEventListener("DOMContentLoaded", function () {
    const exerciseBtn = document.querySelector(".exercice-btn")

    exerciseBtn.addEventListener("click", function () {
        if (exerciseBtn.textContent == "Add") {
            createInputForm();
        }
        else {
            removeInputForm();
        }
    })
})

function addExerciseRow(exerciseName, newRow) {
    // Create a new table row
    var exerciseRow = document.createElement("tr");

    // Create table cells for the exercise name and delete button
    var exerciseCell = document.createElement("td");

    // Set the text for the exercise name cell
    exerciseCell.textContent = exerciseName;

    // Add the cells to the row
    exerciseRow.appendChild(exerciseCell);

    // Add the row to the table body
    var tableBody = document.getElementById("exercise-table-body");
    tableBody.insertBefore(exerciseRow, newRow.nextSibling);
}

function createInputForm() {
    // Create a new table row
    var newRow = document.createElement("tr");
    newRow.id = "add-exercise-row";

    // Create table cells for the form fields
    var exerciseCell = document.createElement("td");

    // Add input fields to the table cells
    exerciseCell.innerHTML = '<input type="text" class="form-control exercise-input" name="exercise" placeholder="Exercise">';

    // Add the cells to the row
    newRow.appendChild(exerciseCell);

    // Insert the new row before the first row in the table
    var tableBody = document.getElementById("exercise-table-body");
    tableBody.insertBefore(newRow, tableBody.firstChild);

    // Change the color of the button once it is clicked
    changeButton("X")

    var inputField = newRow.querySelector(".exercise-input");
    var pattern = /[a-zA-Z]/;
    inputField.addEventListener("keypress", function (event) {
        // If "Enter" key is pressed, create a new exercise row
        if (event.key === "Enter" && pattern.test(inputField.value)) {
            addExerciseRow(inputField.value, newRow);
            saveExercise(inputField.value)
            event.preventDefault();
            inputField.value = "";
        }
    });
    inputField.focus();
}

function removeInputForm() {
    var inputField = document.querySelector("#exercise-table-body");
    var tableRow = inputField.children[0];
    tableRow.remove();
    changeButton("Add")
}

function changeButton(toChange) {
    var exercise_btn = document.querySelector(".exercice-btn");
    if (toChange === "X") {
        exercise_btn.textContent = "X";
        exercise_btn.classList.remove("btn-primary");
        exercise_btn.classList.add("btn-danger");
    }
    else {
        exercise_btn.textContent = "Add";
        exercise_btn.classList.remove("btn-danger");
        exercise_btn.classList.add("btn-primary");
    }
}

function saveExercise(exerciseName) {
    const formData = {
        exerciseName: exerciseName,
    };
    fetch("/save-exercise", {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .catch(console => console.error(error))
}