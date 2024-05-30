import productModel from '../models/product.model.js'

export default class ProductDaoMongo {
  constructor() {
    this.model = productModel
  }

  async get(limit, page, sort) {
    try {
      return await productModel.paginate({}, { limit, page, lean: true, sort })
    } catch (error) {
      return new Error('Error getting products' + error)
    }
  }

  async getById(_id) {
    try {
      return await this.model.findById({ _id }).lean()
    } catch (error) {
      return new Error('Error getting a product by ID' + error)
    }
  }

  async create(newProduct) {
    try {
      return await this.model.create(newProduct)
    } catch (error) {
      return new Error('Error creating the product' + error)
    }
  }

  async update(_id, updateProduct) {
    try {
      return await this.model.findByIdAndUpdate({ _id }, updateProduct, {
        new: true
      })
    } catch (error) {
      return new Error('Error updating the product' + error)
    }
  }

  async delete(_id) {
    try {
      return await this.model.findByIdAndDelete(
        { _id },
        { isActive: false },
        { new: true }
      )
    } catch (error) {
      return new Error('Error deleting the product' + error)
    }
  }
}
