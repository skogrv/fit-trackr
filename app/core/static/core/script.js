document.addEventListener("DOMContentLoaded", function () {
    const exerciseBtn = document.querySelector(".exercise-btn")

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

// Keep track of 
let exerciseEventListenerAttached = false;

function createInputForm() {
    const exerciseForm = document.querySelector("#add-exercise-form");
    const exerciseRow = document.querySelector("#exercise-row");
    const tableCell = document.querySelector("#exercise");
    exerciseRow.style.display = "block";
    changeButton("X")
    if (!exerciseEventListenerAttached) {
        exerciseForm.addEventListener("keypress", function (event) {
            // If "Enter" key is pressed, send exercise to flask form and add new row
            if (event.key === "Enter") {
                saveExercise(tableCell.value, exerciseForm)
                event.preventDefault();
                removeInputForm();
            }
        });

        exerciseEventListenerAttached = true;
    }
    tableCell.focus();
}


function removeInputForm() {
    const inputField = document.querySelector("#exercise-table-body");
    const tableRow = inputField.children[0];
    tableRow.style.display = "none";
    changeButton("Add")
}

function changeButton(toChange) {
    var exercise_btn = document.querySelector(".exercise-btn");
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

function saveExercise(exerciseName, exerciseForm) {
    const formData = new FormData(exerciseForm);
    fetch(exerciseForm.action, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                // Display errors to the user
                const errors = data.errors;
                const errorList = exerciseForm.querySelector('.errors');
                // showErrors(errors)
            } else {
                // Success: Add the new exercise to the table
                const inputRow = document.querySelector("#exercise-row")
                addExerciseRow(exerciseName, inputRow)
                // Hide the form
                exerciseForm.reset();
                // form.parentNode.classList.add('d-none');
            }
        });
};

// function showErrors(errors) {
//     for (let error in errors) {
//         let errorItem = document.createElement('li');
//         let tableBody = document.getElementById("exercise-table-body");
//         errorItem.innerText = errors[fieldName];
//         errorList.appendChild(errorItem);
//     }
// }