import { productService } from '../repositories/index.js'
import { deleteDocuments } from '../utils/multer.js'
import { extractRelativePath } from '../utils/utils.js'
import { sendEmail } from '../utils/sendMail.js'

export default class ProductsController {
  constructor() {
    this.service = productService
  }

  getProducts = async (req, res) => {
    try {
      const { limit = 10, pageQuery = 1 } = req.query
      let { sort } = req.query
      if (sort === 'asc') {
        sort = { price: 'asc' }
      } else {
        sort = { price: 'desc' }
      }
      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } =
        await this.service.getProduct(limit, pageQuery, sort)
      docs.forEach((p) => {
        if (p.stock === 0) {
          this.service.updateProduct(p._id, { isActive: false })
        }
      })
      req.logger.info('Product controller - Products obtained successfully')
      res.render('products', {
        products: docs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page,
        user: req.user
      })
    } catch (error) {
      req.logger.error(`Product Controller - Error: ${error}`)
      res.sendServerError(`Error obtaining the products.`)
    }
  }

  getProduct = async (req, res) => {
    try {
      const { pid } = req.params
      const product = await this.service.getProductById(pid)
      if (product) {
        req.logger.info('Product controller - Product obtained successfully')
        return res.render('product', { product, user: req.user })
      }
    } catch (error) {
      req.logger.error(`Product controller - Error: ${error}`)
      res.sendServerError(`Error obtaining the product.`)
    }
  }

  newProduct = async (req, res) => {
    try {
      const newProduct = req.body
      if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.stock ||
        !newProduct.price ||
        !newProduct.category ||
        !req.file
      )
        throw new Error('Invalid types')
      if (req.user.role === 'PREMIUM') newProduct.owner = req.user.email
      newProduct.thumbnail = `http://localhost:8080/uploads/products/${req.file.filename}`
      const result = await this.service.createProduct(newProduct)
      req.logger.info('Product controller - New product created.')
      return res.sendSuccess('Product created. ID: ' + result._id) // Para saber el ID y usarlo en la documentación
    } catch (error) {
      req.logger.error(`Product controller - ${error}`)
      res.sendServerError(`Error creating product.`)
    }
  }

  deleteProduct = async (req, res) => {
    try {
      const { pid } = req.params
      const { owner, thumbnail, title } = await this.service.getProductById(pid)
      const pathImage = extractRelativePath(thumbnail)
      if (owner !== 'ADMIN' && req.user.email !== owner) {
        try {
          sendEmail({
            service: `eCommerce - CoderHouse`,
            to: owner,
            subject: 'Product deleted',
            html: `
          <h1>Product deleted</h1>
          <p>Hello ${req.user.full_name}</p>
          <p>Your product ${title} was deleted by an Admin.</p>`
          })
          await this.service.deleteProduct(pid)
          deleteDocuments(pathImage)
          req.logger.info(
            'Product controller - The product was removed successfully'
          )
          return res.sendSuccess('The product was removed successfully')
        } catch (error) {
          req.logger.error(
            'Product controller - Error removing the product: ' + error
          )
          return res.sendServerError('Product controller - Error: ' + error)
        }
      }
      await this.service.deleteProduct(pid)
      deleteDocuments(pathImage)
      req.logger.info(
        'Product controller - The product was removed successfully'
      )
      return res.sendSuccess('The product was removed successfully')
    } catch (error) {
      req.logger.error('Product controller - Error removing the product.')
      return res.sendServerError('Error removing the product: ' + error)
    }
  }
}
