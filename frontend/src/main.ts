const createForm = document.getElementById("create-form") as HTMLFormElement;
const loginForm = document.getElementById("login-form");

createForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    let email = document.getElementById("email-create") as HTMLInputElement;
    let password = document.getElementById("password-create") as HTMLInputElement;
    if (!email || !password) {
        return
    };
    

    const res = await fetch("http://localhost:3000/signup", {
        method: "post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "email": email.value,
            "password": password.value
        })
    });

    const token = await res.text();

    localStorage.setItem("token", token);
});
