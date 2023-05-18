document.addEventListener("DOMContentLoaded", function () {
    const exercises = document.querySelectorAll(".exercise-row-added");
    const workouts = document.querySelectorAll(".workout-row-added");
    exercises.forEach(exercise => attachExerciseCellEventListeners(exercise, "exercise"));
    workouts.forEach(workout => attachExerciseCellEventListeners(workout, "workout"));
    const workoutBtn = document.querySelector(".workout-btn");
    const exerciseBtn = document.querySelector(".exercise-btn");
    attachButtonEventListener(workoutBtn, "workout");
    attachButtonEventListener(exerciseBtn, "exercise");
})

function attachExerciseCellEventListeners(exercise, targetTable) {
    const editableData = exercise.querySelector("td div");
    const removeBtn = exercise.querySelector("img.remove-img");
    editableData.addEventListener("click", (event) => {
        const rowId = event.target.parentNode.parentNode.getAttribute("data-id");
        editableData.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                editExercise(editableData, rowId, targetTable);
            }
        })
        editableData.addEventListener("blur", () => {
            editExercise(editableData, rowId, targetTable);
        })
    })
    removeBtn.addEventListener("click", (event) => {
        const clickedImg = event.target;
        const parentRow = clickedImg.parentNode.parentNode;
        parentRow.remove()
        removeExercise(parentRow, targetTable);
    })
}

function attachButtonEventListener(button, targetTable) {

    button.addEventListener("click", () => {
        if (button.textContent == "Add") {
            createInputForm(targetTable);
        }
        else {
            removeInputForm(targetTable);
        }
    })
}

function editExercise(cell, rowId, targetTable) {
    const newName = cell.textContent;
    fetch(`/home/edit-${targetTable}/${rowId}`, {
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
        .catch(error => console.log(error))
}

function removeExercise(rowToRemove, targetTable) {
    const rowId = rowToRemove.getAttribute("data-id");
    fetch(`/home/remove-${targetTable}/${rowId}`, {
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

function addExerciseRow(exerciseName, newRow, targetTable) {
    const exerciseRow = document.createElement("tr");
    const exerciseCell = document.createElement("td");
    const editableDiv = document.createElement("div");
    const deleteCell = document.createElement("td");
    exerciseRow.classList.add(`${targetTable}-row-added`);
    deleteCell.classList.add("remove-btn");
    const deleteImg = document.createElement("img");

    deleteImg.src = removeBtn;
    deleteImg.setAttribute("class", "remove-img");
    deleteCell.appendChild(deleteImg);
    editableDiv.textContent = exerciseName;
    editableDiv.contentEditable = true;
    editableDiv.classList.add("form-control");
    editableDiv.classList.add("editable-td");

    // Find the latest id number and create assign latest + 1 to id
    const maxId = Math.max(...Array.from(document.querySelectorAll(`.${targetTable}-row-added`)).map(cell => cell.dataset.id));
    const newId = maxId + 1;
    exerciseRow.setAttribute("data-id", newId);

    exerciseRow.appendChild(exerciseCell);
    exerciseRow.appendChild(deleteCell);
    exerciseCell.appendChild(editableDiv);
    attachExerciseCellEventListeners(exerciseRow);
    const tableBody = document.getElementById(`${targetTable}-table-body`);
    tableBody.insertBefore(exerciseRow, newRow.nextSibling);
}

let exerciseEventListenerAttached = false;

function createInputForm(targetTable) {
    const exerciseForm = document.querySelector(`#add-${targetTable}-form`);
    const exerciseRow = document.querySelector(`#${targetTable}-row-input`);
    const exerciseInput = document.querySelector(`#${targetTable}`);
    exerciseRow.style.display = "table-row";

    changeButton("X", targetTable)
    exerciseInput.focus();
    if (!exerciseEventListenerAttached) {
        exerciseInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter" || event.key === "Return") {
                exerciseRow.style.display = "table-row";
                console.log(exerciseInput.value)
                saveExercise(exerciseInput.value, exerciseForm, targetTable);
                event.preventDefault();
            }
        });
        exerciseInput.addEventListener("blur", (event) => {
            if (!event.relatedTarget || !(event.relatedTarget.nodeName == "BUTTON")) {
                if (exerciseInput.value !== "") {
                    saveExercise(exerciseInput.value, exerciseForm, targetTable);
                    exerciseInput.value = "";
                    exerciseInput.focus();
                }
                else {
                    removeInputForm(targetTable);
                }
            }
        })
        exerciseEventListenerAttached = true;
    }
}


function removeInputForm(targetTable) {
    const inputField = document.querySelector(`#${targetTable}-table-body`);
    const tableRow = inputField.children[0];
    tableRow.style.display = "none";
    changeButton("Add", targetTable);
}

function changeButton(toChange, targetTable) {
    const exercise_btn = document.querySelector(`.${targetTable}-btn`);
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

function saveExercise(exerciseName, exerciseForm, targetTable) {
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
                const inputRow = document.querySelector(`#${targetTable}-row-input`);
                addExerciseRow(exerciseName, inputRow, targetTable);
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
            changeButton("X", targetTable);
        });
};