document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('formLogin')
  formLogin.addEventListener('submit', async (event) => {
    event.preventDefault()

    const data = new FormData(formLogin)
    const userLogin = {}

    data.forEach((value, key) => (userLogin[key] = value))

    const response = await fetch('/api/sessions/login', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(userLogin)
    })

    const responseJson = await response.json()

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: responseJson.payload,
        html: '<b>Redirecting to the products page...</b>',
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        window.location.replace('/api/products')
      }, 2000)
    } else {
      Swal.fire({
        icon: 'error',
        title: responseJson.status,
        text: responseJson.payload
      })
    }
  })

  const registerButton = document.getElementById('register-btn')

  if (registerButton) {
    registerButton.addEventListener('click', (event) => {
      event.preventDefault()
      window.location.href = '/register'
    })
  }

  const recoveryButton = document.getElementById('recovery-password-btn')

  if (recoveryButton) {
    recoveryButton.addEventListener('click', (event) => {
      event.preventDefault()
      window.location.href = '/recovery-password'
    })
  }
})
