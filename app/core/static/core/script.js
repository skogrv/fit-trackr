document.addEventListener("DOMContentLoaded", function () {
    editExercise()
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

function editExercise() {
    const exerciseCells = document.querySelectorAll(".editable-td");
    exerciseCells.forEach(cell => {
        cell.addEventListener("click", () => {
            const exerciseId = cell.dataset.id;
            cell.contentEditable = true;
            cell.focus();
            cell.addEventListener("keydown", (event) => {
                if (event.key == "Enter") {
                    event.preventDefault();
                    const newName = cell.textContent;
                    fetch(`/home/edit-exercise/${exerciseId}`, {
                        method: "PUT",
                        body: JSON.stringify({ name: newName }),
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRFToken": "{{ csrf_token() }}"
                        }
                    })
                        .then(response => {
                            if (response.ok) {
                                console.log("Exercise name updated");
                            }
                            else {
                                console.log("Failed to update")
                            }
                        })
                }
            })
        })
    })
}

function addExerciseRow(exerciseName, newRow) {
    // Create a new table row
    const exerciseRow = document.createElement("tr");

    // Create table cells for the exercise name and delete button
    const exerciseCell = document.createElement("td");

    // Set the text for the exercise name cell
    exerciseCell.textContent = exerciseName;

    // Add the cells to the row
    exerciseRow.appendChild(exerciseCell);

    // Add the row to the table body
    const tableBody = document.getElementById("exercise-table-body");
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
                exerciseRow.style.display = "block";
                saveExercise(tableCell.value, exerciseForm)
                event.preventDefault();
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
        headers: {
            "X-CSRFToken": "{{ csrf_token() }}"
        }
    })
        .then(response => response.json())
        .then(data => {
            if (!data.errors) {
                // Success: Add the new exercise to the table
                const inputRow = document.querySelector("#exercise-row")
                addExerciseRow(exerciseName, inputRow)
                // Hide the form
                exerciseForm.reset();
                changeButton("X")
            }
        });
};