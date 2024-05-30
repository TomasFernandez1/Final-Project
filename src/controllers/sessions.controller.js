import { generateToken } from '../utils/JWT/generateToken.js'
import { createHash } from '../utils/JWT/createHash.js'
import { userService } from '../repositories/index.js'
import { sendEmail } from '../utils/sendMail.js'
import configObject from '../config/config.js'
import UserDTO from '../dtos/user.dto.js'
import jwt from 'jsonwebtoken'

export class SessionController {
  constructor() {
    this.service = userService
  }

  login = async (req, res) => {
    try {
      const token = generateToken(req.user, '1d')
      res.cookie('cookieToken', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
      })
      return res.sendSuccess('Logged successfully')
    } catch (error) {
      req.logger.error(`Sessions controller - Login failed: ${error}`)
      return res.sendServerError('Login failed')
    }
  }

  register = (req, res) => {
    res.sendSuccess('Register successfully')
  }

  recoveryPasswordEmail = async (req, res) => {
    try {
      const { email } = req.body
      let user = await this.service.getByEmail(email)

      if (!user) {
        req.logger.error(
          `Sessions controller - The email ${email} doesn't exists.`
        )
        return res.sendServerError(`The email ${email} doesn't exists.`)
      }

      user = new UserDTO(user)
      const token = generateToken({ email }, '1h')
      sendEmail({
        service: `eCommerce - CoderHouse`,
        to: email,
        subject: 'Recovery password',
        html: `
      <h1>Recovery password</h1>
      <p>Hello ${user.full_name}</p>
      <p>We have received a request to reset your password. If you did not make this request, please ignore this email.</p>
      <p>To reset your password, click the link below:</p>
      <a href="http://localhost:${configObject.PORT}/recovery-password/${token}">Reset Password</a>`
      })
      req.logger.info(
        'Sessions controller - recovery password email sended successfully.'
      )
      res.redirect('/login')
    } catch (error) {
      req.logger.error(
        `Sessions controller - recovery password email error: ${error}`
      )
      return res.sendServerError(`The email ${email} doesn't exists.`)
    }
  }

  recoveryPassword = async (req, res) => {
    try {
      const { password } = req.body
      const { token } = req.params
      if (!jwt.verify(token, configObject.tokenKey) || !token) {
        req.logger.error(`Sessions controller - Token not found`)
        return res.sendServerError(`Token not found.`)
      }

      const { email } = jwt.verify(token, configObject.tokenKey)

      if (!password) {
        req.logger.error('Sessions controller - No password input.')
        return response.sendServerError('No password input.')
      }
      const user = await this.service.getByEmail(email)
      const hashedPassword = createHash(password)

      await this.service.updateUser(user._id, { password: hashedPassword })
      res.redirect('/login')
    } catch (error) {
      req.logger.error(`Sessions controller - Error: ${error}`)
      res.sendServerError(error)
    }
  }

  logout = async (req, res) => {
    try {
      await this.service.updateUser(req.user._id, { last_connection: Date() })
      req.logger.info('Sessions controller - Logout successfully')
      res.clearCookie('cookieToken')
      res.sendSuccess('Logout successfully')
    } catch (error) {
      req.logger.error('Sessions controller - Error logout.')
      res.sendServerError(`Sessions controller - Error: ${error}`)
    }
  }

  generateToken = (req, res) => {
    try {
      const payload = {
        role: 'ADMIN',
        email: 'admin@gmail.com'
      }

      const token = generateToken(payload, '1h')
      res.cookie('cookieToken', token, {httpOnly: true})
      return res.status(200).json({token})
    } catch (error) {
      return res.sendServerError('Error generating token.')
    }
  }
}
