// --------------- Libraries --------------- //
import express from 'express'
import handlebars from 'express-handlebars'
import compression from 'express-compression'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import swaggerJsDocs from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';


// --------------- Config --------------- //
import config, { connectDB } from './config/config.js'
import { __dirname } from './utils/utils.js';
import viewsR from './routes/views.routes.js'
import {initializePassport} from './config/passport.config.js';
import { addLogger } from './utils/logger.js'


// --------------- Router --------------- //
import appRouter from './routes/index.routes.js'

const app = express()
const viewsRouter = new viewsR()

connectDB()

app.use(compression({ brotli: { enabled: true, zlib: {} } }))
app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
initializePassport()
app.use(passport.initialize())
app.use(addLogger)


// --------------- Init handlebars --------------- //
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentation of eCommerce',
      description: 'Description App eCommerce'
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDocs(swaggerOptions)

app.use('/api', appRouter)
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

// --------------- Redirect root to /login --------------- //
app.get('/', (req, res) => {
  res.redirect('/login')
})

app.use('/', viewsRouter.getRouter())

app.listen(config.PORT, () => {
  console.log('Listening port: ' + config.PORT)
})
