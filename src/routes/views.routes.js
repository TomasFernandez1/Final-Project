import RouterClass from './router.js'
import { viewsController } from '../controllers/views.controller.js'
const { recoveryPasswordToken } = new viewsController()

export default class viewsRouter extends RouterClass {
  init() {
    this.get('/login', ['PUBLIC'], async (req, res) => {
      res.render('login')
    })

    this.get('/register', ['PUBLIC'], async (req, res) => {
      res.render('register')
    })

    this.get('/recovery-password', ['PUBLIC'], async (req, res) => {
      res.render('recovery-password')
    })

    this.get('/recovery-password/:token', ['PUBLIC'], recoveryPasswordToken)

    this.get('/error-register', ['PUBLIC'], async (req, res) => {
      res.render('errorRegister')
    })
  }
}
