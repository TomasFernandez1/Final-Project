const formRegister = document.getElementById("formRegister")

formRegister.addEventListener("submit" , async(event) => {
    event.preventDefault()

    const data = new FormData(formRegister)
    const userRegister = {}

    data.forEach((value , key) => userRegister[key] = value)

    const response = await fetch("/api/sessions/register", {
        headers : {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(userRegister)
    })

    const responseJson = await response.json()

    if (response.ok) {
        Swal.fire({
            icon: 'success',
            title: responseJson.payload,
            html: '<b>Redirecting to the login page...</b>',
            showConfirmButton: false,
            timer: 1500
        })
        setTimeout(() => { window.location.replace("/login") }, 2000)
    } else {
        Swal.fire({ icon: 'error', title: responseJson.status, text: responseJson.payload })
    }
});