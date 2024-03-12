async function signUp() {
    let username = document.getElementById("username")
    let password = document.getElementById("password")
    let confirm_password = document.getElementById("confirm-password")

    if (password.value != confirm_password.value) {
        showToast("#validToast")
        return false;
    } else {
        const response = await fetch("http://localhost:8080/user", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json; charset=utf8",
                Accept: "application/json",
            }),
            body: JSON.stringify({
                username: username.value,
                password: confirm_password.value,
            }),
        });

        switch (response.status) {
            case 409:
                showToast("#conflitToast")
                break;
            case 201:
                showToast("#okToast")
                window.setTimeout(function () {
                    window.location = "/view/login.html";
                }, 1000);
                break;
            default:
                showToast("#errorToast")
                break;
        }

    }

}

function showToast(id) {
    var toastElList = [].slice.call(document.querySelectorAll(id));
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl);
    });
    toastList.forEach((toast) => toast.show());
}
