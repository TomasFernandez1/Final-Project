import UserRepository from './user.repository.js'
import ProductRepository from './products.repository.js'
import CartRepository from './carts.repository.js'
import TicketRepository from './ticket.repository.js'

import userDAO from '../daos/user.mongo.js'
import ProductDao from '../daos/product.mongo.js'
import cartDAO from '../daos/cart.mongo.js'
import ticketDAO from '../daos/ticket.mongo.js'

export const userService = new UserRepository(new userDAO())
export const productService = new ProductRepository(new ProductDao())
export const cartService = new CartRepository(new cartDAO())
export const ticketService = new TicketRepository(new ticketDAO())
