import RouterClass from './router.js'
import ProductsController from '../controllers/products.controller.js'
import {uploadFiles} from '../utils/multer.js';

const { getProduct, getProducts, newProduct, deleteProduct } = new ProductsController()

export default class productsRouter extends RouterClass {
  init() {
    // Create product view
    this.get('/create-product', ['ADMIN', 'PREMIUM'], (req, res) =>
      res.render('create-product', { user: req.user })
    )
    
    // Products view
    this.get('/', ['USER', 'PREMIUM', 'ADMIN'], getProducts)

    // Product view
    this.get('/:pid', ['USER', 'PREMIUM', 'ADMIN'], getProduct)

    // New product endpoint
    this.post('/', ['ADMIN', 'PREMIUM'], uploadFiles.single('thumbnail'), newProduct)

    // Delete product endpoint
    this.delete('/:pid', ['ADMIN', 'PREMIUM'], deleteProduct)

  }
}
