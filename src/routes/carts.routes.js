import RouterClass from './router.js'
import CartsController from '../controllers/carts.controller.js'

const {

  getCart,
  addProduct,
  deleteProductInCart,
  deleteProductsInCart,
  purchase
} = new CartsController()

export default class cartRouter extends RouterClass {
  init() {
    // Init service
    // Cart view
    this.get('/:cid', ['USER', 'ADMIN', 'PREMIUM'], getCart)
    
    // Delete all the products from the carts
    this.delete('/:cid/products', ['USER', 'ADMIN', 'PREMIUM'], deleteProductsInCart)

    // Add a product to a cart
    this.post('/:cid/products/:pid', ['USER', 'PREMIUM', 'ADMIN'], addProduct)

    // Delete a product from the cart
    this.delete('/:cid/products/:pid', ['USER', 'ADMIN', 'PREMIUM'], deleteProductInCart)

    this.post('/:cid/purchase', ['USER', 'PREMIUM', 'ADMIN'], purchase)
  }
}
