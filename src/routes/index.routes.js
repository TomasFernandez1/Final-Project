import { Router } from 'express'

import usersR from './users.routes.js';
import sessionsR from './sessions.routes.js'
import viewsR from './views.routes.js'
import productsR from './products.routes.js'
import cartsR from './carts.routes.js'

const router = Router()

const usersRouter = new usersR()
const cartsRouter = new cartsR()
const sessionsRouter = new sessionsR()
const viewsRouter = new viewsR()
const productsRouter = new productsR()


router.use('/users', usersRouter.getRouter())
router.use('/view', viewsRouter.getRouter())
router.use('/sessions', sessionsRouter.getRouter())
router.use('/carts', cartsRouter.getRouter())
router.use('/products', productsRouter.getRouter())


export default router
