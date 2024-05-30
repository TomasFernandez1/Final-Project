import userModel from '../models/user.model.js'

export default class UserDaoMongo {
  constructor() {
    this.model = userModel
  }

  async get() {
    try {
      return await this.model.paginate({}, { limit:10, page:1, lean: true })
    } catch (error) {
      return new Error('Error getting the users.' + error)
    }
  }

  async getBy(email) {
    try {
      return await this.model.findOne({ email }).lean()
    } catch (error) {
      return new Error('Error getting the user by email. ' + error)
    }
  }

  async getById(_id) {
    try {
      return await this.model.findById(_id).lean()
    } catch (error) {
      return new Error('Error getting the user by ID. ' + error)
    }
  }

  async create(newUser) {
    try {
      return await this.model.create(newUser)
    } catch (error) {
      return new Error('Error creating a new user.' + error)
    }
  }

  async update(_id, updatedUser) {
    try {
      return await this.model.findByIdAndUpdate({ _id }, updatedUser)
    } catch (error) {
      return new Error('Error updating the user.' + error)
    }
  }

  async delete(_id) {
    try {
      return await this.model.findByIdAndDelete({ _id })
    } catch (error) {
      return new Error('Error deleting the user.' + error)
    }
  }
}
