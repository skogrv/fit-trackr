document.addEventListener("DOMContentLoaded", function () {
    editExercise();
    addExercise();
})

function editExercise() {
    const exerciseCells = document.querySelectorAll(".editable-td");

    exerciseCells.forEach(cell => {
        cell.addEventListener("click", () => {
            cell.contentEditable = true;
            cell.focus();
            cell.addEventListener("keydown", (event) => {
                if (event.key == "Enter") {
                    fetchExercise(cell, event);
                }
            })
            cell.addEventListener("blur", (event) => {
                fetchExercise(cell, event);
            })
        })
    })
}

function addEventListenerExercise(cell) {
    cell.contentEditable = true;
    cell.focus();
    cell.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            fetchExercise(cell, event);
        }
    })
    cell.addEventListener("blur", (event) => {
        fetchExercise(cell, event);
    })
}

function addExercise() {
    const exerciseBtn = document.querySelector(".exercise-btn")

    exerciseBtn.addEventListener("click", function () {
        if (exerciseBtn.textContent == "Add") {
            createInputForm();
        }
        else {
            removeInputForm();
        }
    })
}

function fetchExercise(cell, event) {
    event.preventDefault();
    const exerciseId = cell.dataset.id;
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
                console.log("Failed to update");
            }
        })
}

function addExerciseRow(exerciseName, newRow) {
    const exerciseRow = document.createElement("tr");
    const exerciseCell = document.createElement("td");
    exerciseCell.textContent = exerciseName;
    const maxId = Math.max(...Array.from(document.querySelectorAll('.editable-td')).map(cell => cell.dataset.id));
    const newId = maxId + 1;
    exerciseCell.classList.add("editable-td");
    exerciseCell.setAttribute("data-id", newId);
    exerciseRow.appendChild(exerciseCell);
    addEventListenerExercise(exerciseCell) 
    const tableBody = document.getElementById("exercise-table-body");
    tableBody.insertBefore(exerciseRow, newRow.nextSibling);
}

let exerciseEventListenerAttached = false;

function createInputForm() {
    const exerciseForm = document.querySelector("#add-exercise-form");
    const exerciseRow = document.querySelector("#exercise-row");
    const tableCell = document.querySelector("#exercise");
    const exerciseData = document.querySelector("#exercise-data");
    exerciseRow.style.display = "block";

    changeButton("X")
    if (!exerciseEventListenerAttached) {
        exerciseForm.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                exerciseRow.style.display = "block";
                saveExercise(tableCell.value, exerciseForm);
                event.preventDefault();
                // exerciseData.classList.add("editable-td");
                // addEventListenerExercise(exerciseData)
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
    changeButton("Add");
}

function changeButton(toChange) {
    const exercise_btn = document.querySelector(".exercise-btn");
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
        .then(response => {
            if (response.ok) {
                const inputRow = document.querySelector("#exercise-row");
                addExerciseRow(exerciseName, inputRow);
            }
            else {
                return response.json().then(data => {
                    throw new Error(data.errors.exercise[0]);
                });
            }
        })
        .catch(error => console.log(error))
        .finally(() => {
            exerciseForm.reset();
            changeButton("X");
        });
};