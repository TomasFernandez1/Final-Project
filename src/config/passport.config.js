import passport from 'passport'
import local from 'passport-local'
import { userService } from '../repositories/index.js'
import { createHash } from '../utils/JWT/createHash.js'
import { isValidPassword } from '../utils/JWT/isValidPassword.js'
import config from './config.js'
import cartDao from '../daos/cart.mongo.js'
import UserDTO from '../dtos/user.dto.js'

const cartService = new cartDao()
const cookieExtractor = (req) => {
  let token = null
  if (req && req.cookies) token = req.cookies['cookieToken']

  return token
}

const LocalStrategy = local.Strategy

export const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name, role } = req.body
          const existingUser = await userService.getByEmail(email)
          if (existingUser) {
            req.logger.error(
              `Passport - The email: ${email} is already registered`
            )
            return done(null, false, {
              payload: 'The username or the email is already registered'
            })
          }
          
          if (!first_name || !last_name || !email || !password || !role) {
            req.logger.error('Passport - Invalid types')
            return done(null, false, { payload: 'Invalid types' })
          }
          const hashedPassword = createHash(password)
          const newUser = {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role,
            cartId: await cartService.create(),
          }
          const createdUser = await userService.createUser(newUser)
          req.logger.info(`Passport - User created`)
          return done(null, createdUser)
        } catch (error) {
          req.logger.error(`Passport - Error: ${error}`)
          return done(error)
        }
      }
    )
  )

  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          let user = await userService.getByEmail(email)
          if (!user) {
            req.logger.error('Passport - User not found')
            return done(null, false, { payload: 'Email or password is wrong.' })
          }
          if (!isValidPassword(password, user.password)){
            req.logger.error('Passport - The password is wrong.')
            return done(null, false, { payload: 'The password is wrong.' })
          }

          await userService.updateUser(user._id, { last_connection: Date()})

          user = Object.fromEntries(Object.entries(new UserDTO(user))) // This line is because JWT need a plain object
          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  
  passport.deserializeUser(async (id, done) => {
    const user = await userService.getById(id)
    done(null, user)
  })
}

/* Receive 1 or -1 from product controller
    let sortOpt = {}

    if (sort === 'asc') {
      sortOpt = { price: 1 }
    } else if (sort === 'desc') {
      sortOpt = { price: -1 }
    }*/
