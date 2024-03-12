async function signUp() {
    let username = document.getElementById("username")
    let password = document.getElementById("password")
    let confirm_password = document.getElementById("confirm-password")

    if (password.value != confirm_password.value) {
        confirm_password.setCustomValidity("As senhas precisam ser iguais!");
        confirm_password.reportValidity();
        return false;
    } else {
        console.log(username.value, password.value, confirm_password.value)

        const response = await fetch("http://localhost:8080/user", {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json; charset=utf8",
                Accept: "application/json",
            }),
            body: JSON.stringify({
                username: password.value,
                password: confirm_password.value,
            }),
        });

        if(response.ok){
            showToast("#okToast");
        }else{
            showToast("#errotToast");
        }
        return true;
    }

}

function showToast(id) {
    var toastElList = [].slice.call(document.querySelectorAll(id));
    var toastList = toastElList.map(function (toastEl) {
      return new bootstrap.Toast(toastEl);
    });
    toastList.forEach((toast) => toast.show());
  }
