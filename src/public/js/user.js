document.addEventListener('DOMContentLoaded', () => {
  const userId = document.getElementById('userId').value
  document
    .getElementById('premiumForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault()

      const role = document.getElementById('role').value
      const url = `/api/users/${userId}/premium`
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role })
        })

        if (response.ok) {
          Swal.fire({
            title: 'Success!',
            text: 'User role updated successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });setTimeout(() => {
            window.location.replace('/api/users');
          }, 2000);
        } else {
          const errorData = await response.json()
          Swal.fire({
            title: 'Error!',
            text: errorData.payload,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      } catch (error) {
        Swal.fire({
          title: 'Network Error!',
          text: 'Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
})
