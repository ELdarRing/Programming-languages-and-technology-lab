const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const message = document.getElementById("message");
const searchInput = document.getElementById("searchInput");


let tasks = [];

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        message.textContent = "Введите название задачи!";
        return;
    } else {
        message.textContent = "";
    }

    const task = {
        text: text,
        completed: false
    };

    tasks.push(task);

    taskInput.value = "";

    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        if (!task.text.toLowerCase().includes(searchText)) {
            continue;
        }

        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        const span = document.createElement("span");
        const deleteButton = document.createElement("button");

        li.className = "task";

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        span.textContent = task.text;

        deleteButton.textContent = "Удалить";
        deleteButton.className = "delete-btn";

        if (task.completed) {
            li.classList.add("completed");
        }

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            renderTasks();
        });

        deleteButton.addEventListener("click", function () {
            tasks.splice(i, 1);
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    }

    updateCounter();
}

function updateCounter() {
    let completedCount = 0;
    let uncompletedCount = 0;

    for (let task of tasks) {
        if (task.completed) {
            completedCount++;
        } else {
            uncompletedCount++;
        }
    }

    counter.textContent =
        "Выполнено: " + completedCount +
        " | Не выполнено: " + uncompletedCount;
}

addButton.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

renderTasks();

searchInput.addEventListener("input", function () {
    renderTasks();
});
