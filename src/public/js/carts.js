document.addEventListener('DOMContentLoaded', () => {
  const cartId = document.getElementById('cartId').value
  initializeDeleteProductButtons(cartId)
  initializeDeleteAllProductsButton(cartId)
  initializePurchaseButton(cartId)
})

function initializePurchaseButton(cartId) {
  const purchaseButton = document.querySelectorAll('.purchase-btn')
  purchaseButton.forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const responseJson = await response.json()
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: responseJson.payload,
            html: '<b>Summary sended to your email</b>',
            showConfirmButton: false,
            timer: 2000
          })
          setTimeout(() => {
            window.location.replace('/api/products')
          }, 2000)
        }
      } catch (error) {}
    })
  })
}
function initializeDeleteProductButtons(cartId) {
  const deleteProductButtons = document.querySelectorAll('.deleteProductBtn')

  deleteProductButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        const productId = button.getAttribute('data-product-id')

        await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        location.reload()
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    })
  })
}

function initializeDeleteAllProductsButton(cartId) {
  const deleteProductsButton = document.querySelector('.deleteProductsBtn')

  if (deleteProductsButton) {
    deleteProductsButton.addEventListener('click', async () => {
      try {
        await fetch(`/api/carts/${cartId}/products`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        location.reload()
      } catch (error) {
        console.error('Error deleting all products:', error)
      }
    })
  }
}
