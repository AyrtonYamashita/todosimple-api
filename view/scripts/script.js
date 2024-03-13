const user_taskEndpoint = "http://localhost:8080/task/user"
const task_postEndpoint = "http://localhost:8080/task"

function hideLoading() {
    document.getElementById("loading").style.display = "none"
}

function checkBoxSubmit() {
    const checkboxs = document.querySelectorAll('input[type="checkbox"]');
    let checkState = {}
    checkboxs.forEach(checkbox => {
        checkState[checkbox.value] = checkbox.checked;
        if (checkbox.checked) {
            const tasks = document.getElementById(checkbox.value)
            tasks.className = "text-muted "
        } else {
            const tasks = document.getElementById(checkbox.value)
            tasks.removeAttribute("class")
        }
        localStorage.setItem('checkBoxState', JSON.stringify(checkState))
    })
}

function loadStateTask() {
    const savedState = localStorage.getItem('checkBoxState');
    if (savedState) {
        const checkBoxState = JSON.parse(savedState);
        const checkboxes = document.querySelectorAll('input[type="checkbox"]')
        checkboxes.forEach(checkbox => {
            checkbox.checked = checkBoxState[checkbox.value]
            if (checkbox.checked) {
                const tasks = document.getElementById(checkbox.value)
                tasks.className = "text-muted "
            } else {
                const tasks = document.getElementById(checkbox.value)
                tasks.removeAttribute("class")
            }
        })
    }
}

function show(tasks) {
    let tab =
        `
        <thead>
        </thead>

    `
    for (let task of tasks) {
        tab += `
            <tr>
                <td><input type="checkbox" value=${task.id} onclick="checkBoxSubmit()"></td>
                <td id=${task.id}>${task.description}</td>
                <td>
                    <button type="button" class="btn-close float-end" aria-label="Close" onclick="removeTasks(${task.id})"></button>
                </td>
            <tr>
        `
    }
    document.getElementById("tasks").innerHTML = tab
    loadStateTask()
    document.getElementById("tasks").addEventListener('change', checkBoxSubmit)


}

async function getTasks() {
    let key = "Authorization"
    const response = await fetch(user_taskEndpoint, {
        method: "GET",
        headers: new Headers({
            Authorization: localStorage.getItem(key),
        }),
    });

    var data = await response.json();
    console.log(data);
    if (response) hideLoading();
    show(data);
}

async function removeTasks(id) {
    let key = "Authorization"
    await fetch(`http://localhost:8080/task/${id}`, {
        method: "DELETE",
        headers: new Headers({
            Authorization: localStorage.getItem(key)
        })
    })
    getTasks();
}

async function addTask() {
    let error_task = document.getElementById("error_add_task")
    let description_task = document.getElementById("description_t")
    if (description_task.value == "") {
        error_task.style.display = "flex"
    } else {
        let key = "Authorization"
        const response = await fetch(task_postEndpoint, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json; charset=utf8",
                Accept: "application/json",
                Authorization: localStorage.getItem(key)
            }),
            body: JSON.stringify({
                description: description_task.value
            })
        })
        getTasks();
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
    if (!localStorage.getItem("Authorization"))
        window.location = "/view/login.html"
});

getTasks();

