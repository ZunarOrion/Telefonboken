const createForm = document.getElementById
const loginForm = document.getElementById

createForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let email = document.getElementById().value
    let password = document.getElementById().value

    console.log("email", email)
    console.log("password", password)

    fetch(url/localhost) {
        method: "post",
        header: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            "email": email
            "password": password
        })
    }
})
