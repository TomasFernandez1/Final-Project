import { userService } from '../repositories/index.js'
import { sendEmail } from '../utils/sendMail.js'

export default class UsersController {
  constructor() {
    this.service = userService
  }

  getUsers = async (req, res) => {
    try {
      const users = await this.service.getUsers()
      if (!users) {
        req.logger.error('Users controller - Error getting users.')
        return res.sendServerError('Error getting users.')
      }
      const { docs } = users
      req.logger.info('Users controller - Successfully obtained users.')
      res.render('users', { users: docs, user: req.user })
    } catch (error) {
      req.logger.error(`Users controller - Error: ${error}`)
      res.sendServerError(error)
    }
  }

  getUser = async (req, res) => {
    try {
      const { uid } = req.params
      const user = await this.service.getById(uid)
      if (!user) {
        req.logger.error(
          `Users controller - Error getting user with the email: ${email}.`
        )
        return res.sendServerError(
          `Error getting user with the email: ${email}`
        )
      }
      req.logger.info('Users controller - Successfully obtained the user.')
      user.full_name = user.first_name + ' ' + user.last_name
      res.render('user', { user })
    } catch (error) {
      req.logger.error(`Users controller - Error: ${error}`)
      res.sendServerError(error)
    }
  }

  updateUser = async (req, res) => {
    try {
      const { uid } = req.params
      const { role } = req.body
      const user = await this.service.getById(uid)
      if (!user) {
        req.logger.error('User not found')
        res.sendServerError('User not found')
      }
      await userService.updateUser(uid, { role })

      res.redirect('/api/users')
    } catch (error) {
      console.log(error)
      res.sendServerError(error)
    }
  }

  deleteUsers = async () => {
    try {
      const { docs } = await this.service.getUsers()
      docs.forEach(async (element) => {
        const { last_connection, role} = element
        const differenceInDays = this.calculateTime(last_connection)
        if (differenceInDays > 2 || role !== 'ADMIN') {
          sendEmail({
            service: `eCommerce - CoderHouse`,
            to: element.email,
            subject: 'Account deleted',
            html: `
          <h1>Account deleted</h1>
          <p>Hello ${element.first_name} ${element.last_name}</p>
          <p>Your account has been deleted due to inactivity.</p>
          <p>Now you can create another account with the same email.</p>
          <p>Here: http://localhost:8080/register </p>`
          })
          console.info(`User controller - Account deleted: ${element.email}`)
          await this.service.deleteUser(element._id)
        }
      })
    } catch (error) {
      console.error(`Users controller - Error: ${error}`)
    }
  }

  calculateTime = (last_connection) => {
    const last_connectionDate = new Date(last_connection)
    const today = new Date()
    const timeDifference = today.getTime() - last_connectionDate.getTime()
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  }
}
