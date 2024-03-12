const tasksEndpoint = "http://localhost:8080/task/user"

function hideLoading(){
    document.getElementById("loading").style.display = "none"
}

function show (tasks){
    let tab = `<thead>
        <th scope="col">#</th>
        <th scope="col">Description</th>
        <th scope="col">Username</th>
        <th scope="col">UID</th>
    </thead>
    `

    for (let task of tasks) {
        tab += `
            <tr>
                <td scope="row">${task.id}</td>
                <td>${task.description}</td>
                <td>${task.user.username}</td>
                <td>${task.user.id}</td>
            <tr>
        `
    }

    document.getElementById("tasks").innerHTML = tab

}

async function getTasks(){
    let key = "Authorization"
    const response = await fetch(tasksEndpoint, {
        method: "GET",
        headers: new Headers({
            Authorization: localStorage.getItem(key),
        }),
    });

    var data = await response.json();
    console.log(data);
    if(response) hideLoading();
    show(data);
}

document.addEventListener("DOMContentLoaded", function (event) {
    if(!localStorage.getItem("Authorization"))
        window.location = "/view/login.html"
});

getTasks();