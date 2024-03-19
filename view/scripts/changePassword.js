const putEndpoint = "http://localhost:8080/user/update"

function loadPage(){
    window.location = '/view/setPassword.html'
}

async function setPassword(){
    const new_pwd = document.getElementById("new_password").value
    const confirm_pwd = document.getElementById("confirm_password").value
    if (new_pwd != confirm_pwd){
        showToast("#validToast");
        return false;
    }
    await fetch(putEndpoint, {
        method: "PUT",
        headers: new Headers({
            Authorization: localStorage.getItem("Authorization"),
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf8"
        }),
        body: JSON.stringify({
            password: new_pwd
        })
    })
    showToast("#okToast")
    window.localStorage.removeItem("Authorization")
    window.localStorage.removeItem("checkBoxState")
    window.location = '/view/login.html'
    showToast("#okToast")
}

function showToast(id) {
    var toastElList = [].slice.call(document.querySelectorAll(id));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach((toast) => toast.show());
}
