const tasksEndpoint = "http://localhost:8080/task"

async function createTask() {
    let key = "Authorization"
    let task = document.getElementById("description")
    if (task.value == "") {
        showToast("#validToast")
        return false
    }

    const response = await fetch(tasksEndpoint, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json; charset=utf8",
            Access: "application/json",
            Authorization: localStorage.getItem(key)
        }),
        body: JSON.stringify({
            description: task.value
        })
    })
    switch (response.status) {
        case 409:
            showToast("#conflitToast")
            break;
        case 201:
            showToast("#okToast")
            window.setTimeout(function () {
                window.location = "/view/index.html";
            }, 500);
            break;
        default:
            showToast("#errorToast")
            break;
    }
}

function showToast(id) {
    var toastElList = [].slice.call(document.querySelectorAll(id));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach((toast) => toast.show());
}
