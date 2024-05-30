import cartModel from '../models/cart.model.js'

export default class cartManagerMongo {
  constructor() {
    this.model = cartModel
  }

  async get() {
    try {
      return await this.model.find().lean()
    } catch (error) {
      return new Error('Error getting the carts.' + error)
    }
  }

  async getBy(_id) {
    try {
      return await this.model.findOne({ _id }).lean()
    } catch (error) {
      return new Error('Error getting the cart.' + error)
    }
  }

  async create() {
    try {
      return await this.model.create({ products: [] })
    } catch (error) {
      return new Error('Error creating the cart.' + error)
    }
  }

  async update(cID, pID) {
    try {
      const cart = await this.model.findById({ _id: cID })
      const products = cart.products.find((prod) => prod.product._id == pID)

      if (!products) {
        return await this.model.updateOne(
          { _id: cID },
          { $push: { products: { product: pID, quantity: 1 } } }
        )
      } else {
        return await this.model.updateOne(
          { _id: cID, 'products.product': pID },
          { $inc: { 'products.$.quantity': 1 } },
          { new: true, upset: true }
        )
      }
    } catch (error) {
      return new Error('Error getting the carts.' + error)
    }
  }

  async delete(_id) {
    try {
      return await this.model.findByIdAndDelete(_id)
    } catch (error) {
      return new Error('Error deleting the cart.' + error)
    }
  }

  async deleteOneProduct(cID, pID) {
    try {
      return await this.model.findOneAndUpdate(
        { _id: cID },
        { $pull: { products: { product: pID } } },
        { new: true }
      )
    } catch (error) {
      return new Error('Error deleting product from the cart.' + error)
    }
  }

  async deleteAllProducts(cID) {
    try {
      return await this.model.updateOne(
        { _id: cID },
        { $set: { products: [] } }
      )
    } catch (error) {
      return new Error('Error deleting all products from the cart.' + error)
    }
  }
}
