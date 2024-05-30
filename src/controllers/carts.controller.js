import {
  cartService,
  ticketService,
  productService
} from '../repositories/index.js'
import { sendEmail } from '../utils/sendMail.js'

export default class cartController {
  constructor() {
    this.service = cartService
  }

  getCart = async (req, res) => {
    try {
      const { cid } = req.params // ID Cart
      const { products } = await this.service.getById(cid)

      const productsArray = products.map((product) => {
        return {
          id: product.product._id,
          title: product.product.title,
          price: product.product.price,
          quantity: product.quantity,
          thumbnail: product.product.thumbnail
        }
      })
      req.logger.info('Cart controller - Cart obtained successfully')
      res.render('cart', { products: productsArray, user: req.user })
    } catch (error) {
      req.logger.error(`Cart controller - Error getting cart: ${error}`)
      res.sendServerError(`Cart controller - Error: ${error}`)
    }
  }

  addProduct = async (req, res) => {
    try {
      const { cid, pid } = req.params
      await this.service.updateCart(cid, pid)
      res.sendSuccess('Product added')
    } catch (error) {
      res.sendServerError('Product adding error')
    }
  }

  deleteProductInCart = async (req, res) => {
    try {
      const { cid, pid } = req.params
      const cart = await this.service.deleteProductCart(cid, pid)
      if (!cart) {
        req.logger.error('Cart controller - Cart or product not found.')
        return res.sendServerError('Cart or product not found.')
      }
      req.logger.info(
        'Cart controller - Product deleted from the cart successfully.'
      )
      return res.sendSuccess(' Product deleted from the cart successfully.')
    } catch (error) {
      req.logger.error(`Cart controller - Error: ${error}`)
      req.sendServerError(`Error: ${error}`)
    }
  }

  deleteProductsInCart = async (req, res) => {
    try {
      const { cid } = req.params
      const cart = await this.service.deleteProductsCart(cid)
      if (!cart) {
        req.logger.error(
          'Cart controller - Error obtaining cart or deleting the products.'
        )
        return res.sendServerError(
          'Error obtaining cart or deleting the products.'
        )
      }

      req.logger.info(
        'Cart Controller - Product of the cart deleted successfully.'
      )
      res.sendSuccess('Product of the cart deleted successfully.')
    } catch (error) {
      req.logger.error(`Cart controller - Error: ${error}`)
      res.sendServerError(`Error: ${error}`)
    }
  }

  purchase = async (req, res) => {
    try {
      const { cid } = req.params
      const cart = await this.service.getById(cid)
      const insufficientStock = []
      const buyProducts = []

      if (!cart) {
        req.logger.error('Cart controller - Error obtaining the cart.')
        res.sendServerError('Error obtaining the cart.')
      }

      cart.products.forEach(async (item) => {
        const product = item.product
        const productId = item.product._id
        const quantity = item.quantity
        const stock = item.product.stock

        quantity > stock
          ? insufficientStock.push(product)
          : buyProducts.push({ product, quantity }) &&
            (await productService.updateProduct(productId, {
              stock: stock - quantity
            })) &&
            (await cartService.deleteProductCart(cart, productId))
      })

      const totalAmount = buyProducts.reduce(
        (acc, item) => acc + item.quantity,
        0
      )

      if (!buyProducts.length) {
        req.logger.error(
          'Cart controller - Insufficient stock in these products: ' +
            insufficientStock.map((prod) => prod._id).join(', ')
        )
        return res.sendServerError(
          'Insufficient stock in these products: ' +
            insufficientStock.map((prod) => prod._id).join(', ')
        )
      }

      let ticket = {}
      if (buyProducts.length > 0) {
        ticket = await ticketService.createTicket(totalAmount, req.user.email)
      }
      sendEmail({
        service: `eCommerce - CoderHouse`,
        to: ticket.purchaser,
        subject: 'Thanks for your purchase',
        html: `
      <h1>Ticket</h1>
      <p>Hello ${req.user.full_name}</p>
      <p>Thanks for your purchase</p> 
      <p>Total pay: $${ticket.amount} </p>
      <p>Code: ${ticket.code}</p>`
      })

      req.logger.info('Cart controller - Purchase successfully.')
      res.sendSuccess('Purchase successfully.')
    } catch (error) {
      req.logger.error(`Cart controller - Error: ${error}`)
      res.sendServerError(`Error: ${error}`)
    }
  }
}
