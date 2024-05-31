document.addEventListener('DOMContentLoaded', function () {
  const role = document.getElementById('userRole').value
  const email = document.getElementById('email').value

  initializeDeleteProductButtons(role, email)
  initializeAddToCartButtons(email)
})

function initializeDeleteProductButtons(role, email) {
  const deleteProductButtons = document.querySelectorAll('.delete-product-btn')
  deleteProductButtons.forEach((button) => {
    const ownerProduct = button.getAttribute('data-product-owner')
    if (role === 'USER' || (email !== ownerProduct && role !== 'ADMIN')) {
      button.style.display = 'none'
    }
    button.addEventListener('click', async function () {
      await handleDeleteProduct(button)
    })
  })
}

async function handleDeleteProduct(button) {
  try {
    const productId = button.getAttribute('data-product-id')
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const responseJson = await response.json()
    showResponseMessage(response, responseJson, 'Product deleted successfully')
  } catch (error) {
    console.error(error)
  }
}

function initializeAddToCartButtons(email) {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn')
  addToCartButtons.forEach((button) => {
    const ownerProduct = button.getAttribute('data-product-owner')
    const cartId = document.getElementById('cartId').value
    const productId = button.getAttribute('data-product-id')
    if (email === ownerProduct) {
      button.style.display = 'none'
    }
    button.addEventListener('click', async function () {
      await handleAddToCart(cartId, productId)
    })
  })
}

async function handleAddToCart(cartId, productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const responseJson = await response.json()
    showResponseMessage(response, responseJson, 'Product added successfully')
  } catch (err) {
    console.error(err)
  }
}

function showResponseMessage(response, responseJson, successMessage) {
  if (response.ok) {
    Swal.fire({
      icon: 'success',
      title: responseJson.payload,
      html: `<b>${successMessage}</b>`,
      showConfirmButton: true,
      timer: 1500
    });
  } else {
    Swal.fire({
      icon: 'error',
      title: responseJson.status,
      text: responseJson.payload
    })
  }
}
