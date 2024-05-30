document.addEventListener('DOMContentLoaded', () => {
  const role = document.getElementById('userRole').value

  setupButtonEvent('btn-logout', handleLogout)
  setupButtonEvent('btn-home', handleHomeRedirect)
  setupButtonEvent('btn-delete-users', handleDeleteUsers)
  setupDeleteUsersButton(role)
  setupCreateProductButton(role)
  setupUsersButton(role)
  setupUpdateDocumentButton(role)
  hideHomeButton()
})

function setupButtonEvent(buttonId, eventHandler) {
  const button = document.getElementById(buttonId)
  if (button) {
    button.addEventListener('click', eventHandler)
  }
}

async function handleLogout(event) {
  event.preventDefault()
  try {
    const responseJson = await fetchData('/api/sessions/logout', 'POST')
    if (responseJson) {
      Swal.fire({
        icon: 'success',
        title: responseJson.payload,
        html: '<b>Redirecting to the login page...</b>',
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        window.location.replace('/login')
      }, 2000)
    }
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

function handleHomeRedirect(event) {
  event.preventDefault()
  window.location.href = '/api/products'
}

async function handleDeleteUsers(event) {
  event.preventDefault()
  try {
    const responseJson = await fetchData('/api/users/', 'DELETE')
    if (responseJson) {
      Swal.fire({
        icon: 'success',
        title: 'Users deleted successfully',
        showConfirmButton: false,
        timer: 1500
      })
    }
  } catch (error) {
    console.error('Error deleting users:', error)
  }
}

function setupDeleteUsersButton(role) {
  const deleteUsersButton = document.getElementById('btn-delete-users')
  if (deleteUsersButton) {
    if (role !== 'ADMIN') {
      deleteUsersButton.style.display = 'none'
    }
}}

function setupCreateProductButton(role) {
  const createProductButton = document.getElementById('btn-create-product')
  if (createProductButton) {
    if (role === 'USER') {
      createProductButton.style.display = 'none'
    } else {
      createProductButton.addEventListener('click', () => {
        window.location.href = '/api/products/create-product'
      })
    }
  } else {
    console.warn('Create product button not found')
  }
}

function setupUsersButton(role) {
  const userListButton = document.getElementById('btn-users')
  if (userListButton) {
    if (role === 'USER') {
      userListButton.style.display = 'none'
    } else {
      userListButton.addEventListener('click', () => {
        window.location.href = '/api/users'
      })
    }
  } else {
    console.warn('Create product button not found')
  }
}

function setupUpdateDocumentButton(role) {
  const updateDocumentButton = document.getElementById('btn-upload-documents')
  if (updateDocumentButton) {
    if (role === 'ADMIN') {
      updateDocumentButton.style.display = 'none'
    } else {
      updateDocumentButton.addEventListener('click', () => {
        window.location.href = '/api/users/upload-documents'
      })
    }
  } else {
    console.warn('Create product button not found')
  }
}

function hideHomeButton() {
  const currentUrl = window.location.pathname
  const homeButton = document.getElementById('btn-home')
  const nav = document.getElementById('navbar')
  if (currentUrl === '/login' || currentUrl === '/register' || currentUrl === '/recovery-password' || currentUrl.match(/\/recovery-password\/.*$/)) {
    nav.style.display= 'none'
    homeButton.style.display = 'none'
  }
}

async function fetchData(url, method) {
  const response = await fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' }
  })
  if (response.ok) {
    return await response.json()
  } else {
    console.error(`Error fetching ${url}:`, response.status)
    return null
  }
}
