import { faker } from '@faker-js/faker'

export default class TicketDTO{
    constructor(ticket){
        this.code = faker.string.alphanumeric({ length: {min: 8, max: 8} })
        this.amount = ticket.amount
        this.purchaser = ticket.purchaser
    }
}