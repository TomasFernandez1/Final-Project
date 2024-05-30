import ticketDTO from '../dtos/ticket.dto.js';

export default class TicketRepository{
    constructor(dao){
        this.dao = dao;
    }


    getTicket = async () =>{
        return await this.dao.get()
    }

    getTicketBy = async (id) => {
        return await this.dao.getBy(id)
    }

    createTicket = async (amount, purchaser) => {
        const ticket = new ticketDTO({amount, purchaser})
        return await this.dao.create(ticket)
    }

    deleteTicket = async(id) => {
        return await this.dao.delete(id)
    }

    updateTicket = async(id, newTicket) =>{
        return await this.dao.update(id, newTicket)
    }
}