document.addEventListener('DOMContentLoaded', () => {
  const identityInput = document.getElementById('identityInput')
  const myAddressInput = document.getElementById('myAddressInput')
  const myAccountInput = document.getElementById('myAccountInput')
  const profileInput = document.getElementById('profileInput')

  identityInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    const preview = document.getElementById('identityPreview')
    if (file) {
      preview.src = URL.createObjectURL(file)
      preview.style.display = 'block'
    } else {
      preview.src = ''
      preview.style.display = 'none'
    }
  })

  myAddressInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    const preview = document.getElementById('myAddressPreview')
    if (file) {
      preview.src = URL.createObjectURL(file)
      preview.style.display = 'block'
    } else {
      preview.src = ''
      preview.style.display = 'none'
    }
  })

  myAccountInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    const preview = document.getElementById('myAccountPreview')
    if (file) {
      preview.src = URL.createObjectURL(file)
      preview.style.display = 'block'
    } else {
      preview.src = ''
      preview.style.display = 'none'
    }
  })

  profileInput.addEventListener('change', (e) => {
    const file = e.target.files[0]
    const preview = document.getElementById('profilePreview')
    if (file) {
      preview.src = URL.createObjectURL(file)
      preview.style.display = 'block'
    } else {
      preview.src = ''
      preview.style.display = 'none'
    }
  })
  const formUpload = document.getElementById('uploadForm')
  const userId = document.getElementById('userId').value

  formUpload.addEventListener('submit', async (event) => {
    event.preventDefault()

    const data = new FormData(formUpload)

    const response = await fetch(`/api/users/${userId}/documents`, {
      method: 'POST',
      body: data
    })

    const responseJson = await response.json()
    console.log(responseJson)

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: responseJson.payload,
        html: '<b>Documents uploaded successfully!</b>',
        showConfirmButton: false,
        timer: 1500
      })

      formUpload.reset()
    } else {
      Swal.fire({
        icon: 'error',
        title: responseJson.status,
        text: responseJson.payload
      })
    }
  })
})
