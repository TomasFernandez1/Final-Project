import ticketModel from '../models/ticket.model.js'


export default class ticketManagerMongo {
  constructor() {
    this.model = ticketModel
  }

  async get() {
    try {
      return await this.model.find({}).lean()
    } catch (error) {
      return new Error('Error getting the tickets.' + error)
    }
  }

  async getById(_id) {
    try {
      return await this.model.findById({ _id }).lean()
    } catch (error) {
      return new Error('Error getting the ticket by ID.' + error)
    }
  }

  async create(ticket) {
    try {

      return await this.model.create(ticket)
    } catch (error) {
      return new Error('Error creating the ticket.' + error)
    }
  }

  async delete(_id) {
    try {
      return await this.model.findByIdAndDelete({ _id })
    } catch (error) {
      return new Error('Error deleting the ticket.' + error)
    }
  }

  async update(tID, newTicket) {
    return await this.model.findByIdAndUpdate(tID, newTicket)
  }
}
