document.addEventListener("DOMContentLoaded", function () {
    const exercises = document.querySelectorAll(".exercise-row-added");
    exercises.forEach(attachExerciseCellEventListeners);
    addExercise();
})

function attachExerciseCellEventListeners(exercise) {
    const editableData = exercise.querySelector("td div");
    const removeBtn = exercise.querySelector("img.remove-img");
    editableData.addEventListener("click", (event) => {
        const rowId = event.target.parentNode.parentNode.getAttribute("data-id");
        editableData.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                editExercise(editableData, rowId);
            }
        })
        editableData.addEventListener("blur", (event) => {
            editExercise(editableData, rowId);
        })
    })
    removeBtn.addEventListener("click", (event) => {
        const clickedImg = event.target;
        const parentRow = clickedImg.parentNode.parentNode;
        parentRow.remove()
        fetchRemoveExercise(parentRow);
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

function editExercise(cell, rowId) {
    const newName = cell.textContent;
    fetch(`/home/edit-exercise/${rowId}`, {
        method: "PUT",
        body: JSON.stringify({ name: newName }),
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": "{{ session['csrf_token'] }}"
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

function fetchRemoveExercise(rowToRemove) {
    const rowId = rowToRemove.getAttribute("data-id");
    fetch(`/home/remove-exercise/${rowId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": "{{ session['csrf_token'] }}"
        }
    })
        .then(response => {
            if (response.ok) {
                console.log("Deleted");
            }
            else {
                console.log("Not deleted")
            }
        })
        .catch(error => console.log(error));
}

function addExerciseRow(exerciseName, newRow) {
    const exerciseRow = document.createElement("tr");
    const exerciseCell = document.createElement("td");
    const editableDiv = document.createElement("div");
    const deleteCell = document.createElement("td");
    exerciseRow.classList.add("exercise-row-added");
    deleteCell.classList.add("remove-btn");
    const deleteImg = document.createElement("img");
    const removeBtn = document.querySelector(".remove-img");
    const srcRemoveBtn = removeBtn.src;
    deleteImg.src = srcRemoveBtn;
    deleteImg.setAttribute("class", "remove-img");
    deleteCell.appendChild(deleteImg);
    editableDiv.textContent = exerciseName;
    editableDiv.contentEditable = true;
    editableDiv.classList.add("form-control");
    editableDiv.classList.add("editable-td");

    // Find the latest id number and create assign latest + 1 to id
    const maxId = Math.max(...Array.from(document.querySelectorAll('.exercise-row-added')).map(cell => cell.dataset.id));
    const newId = maxId + 1;
    exerciseRow.setAttribute("data-id", newId);

    exerciseRow.appendChild(exerciseCell);
    exerciseRow.appendChild(deleteCell);
    exerciseCell.appendChild(editableDiv);
    attachExerciseCellEventListeners(exerciseRow);
    const tableBody = document.getElementById("exercise-table-body");
    tableBody.insertBefore(exerciseRow, newRow.nextSibling);
}

let exerciseEventListenerAttached = false;

function createInputForm() {
    const exerciseForm = document.querySelector("#add-exercise-form");
    const exerciseRow = document.querySelector("#exercise-row");
    const exerciseInput = document.querySelector("#exercise");
    exerciseRow.style.display = "table-row";
    exerciseForm.focus()

    changeButton("X")
    if (!exerciseEventListenerAttached) {
        exerciseForm.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                exerciseRow.style.display = "table-row";
                saveExercise(exerciseInput.value, exerciseForm);
                event.preventDefault();
            }
        });
        exerciseInput.addEventListener("blur", () => {
            removeInputForm();
        })
        exerciseEventListenerAttached = true;
    }
    exerciseInput.focus();
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