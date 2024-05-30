import jwt from 'jsonwebtoken';
import configObject from '../config/config.js'

export class viewsController {
  constructor() {}

  recoveryPasswordToken = async (req, res) => {
    try {
      const { token } = req.params
      if (!jwt.verify(token, configObject.tokenKey)) {
        req.logger.error("Sessions controller - Error token doesn't exists")
        return res.redirect('/api/sessions/recovery-password')
      }
      req.logger.info('Sessions controller - Token verified successfully')
      res.render('recovery-password-form', { token })
    } catch (error) {
      req.logger.error(`Sessions controller - Error: ${error}`)
      console.log(error);
      res.redirect('/recovery-password')
    }
  }
}
