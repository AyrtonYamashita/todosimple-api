const user_taskEndpoint = "http://localhost:8080/task/user"
const task_postEndpoint = "http://localhost:8080/task"
const task_updateEndpoint = "http://localhost:8080/task"
var key = "Authorization"



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

function editTask(id) {
    const task_content = document.getElementById(id)
    const input_task = document.getElementById("description_t")
    const btn_edit = document.getElementById("btn-function")
    input_task.value = task_content.textContent
    btn_edit.textContent = "Edit"
    btn_edit.setAttribute("class", "btn btn-outline-primary rounded-0")
    btn_edit.setAttribute("onclick", `putTask(${id})`)
}

async function putTask(id) {
    const btn_edit = document.getElementById("btn-function")
    const input_task = document.getElementById("description_t")
    await fetch(`http://localhost:8080/task/${id}`, {
        method: "PUT",
        headers: new Headers({
            Authorization: localStorage.getItem(key),
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf8"
        }),
        body: JSON.stringify({
            description: input_task.value
        })
    })
    btn_edit.textContent = "Add"
    btn_edit.setAttribute("class", "btn btn-outline-success rounded-0")
    btn_edit.setAttribute("onclick", `addTask()`)
    input_task.value = ""
    getTasks();
}

function show(tasks) {
    let username = window.localStorage.getItem("user")
    console.log(username)
    let tab =
        `
        <thead>
        </thead>

    `
    for (let task of tasks) {
        tab += `
            <tr>
                <td><input type="checkbox" value=${task.id} onclick="checkBoxSubmit()" id="checkbox_id" class="form-check-input">
                </td>
                <td id=${task.id} onclick="editTask(${task.id})">${task.description}</td>
                <td>
                    <button type="button" class="btn-close float-end" aria-label="Close" onclick="removeTasks(${task.id})"></button>
                </td>
            <tr>
        `
    }
    document.getElementById("tasks").innerHTML = tab
    document.getElementById("username_welcome").innerHTML = `Welcome to your app, ${username}`
    loadStateTask()
    document.getElementById("tasks").addEventListener('change', checkBoxSubmit)


}

async function getTasks() {
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
    description_task.addEventListener('click', function(){
        error_task.style.display = "none";
    })
    if (description_task.value == "") {
        error_task.style.display = "flex"
    } else {
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

