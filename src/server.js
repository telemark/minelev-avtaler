const Hapi = require('hapi')
const routes = require('./routes')
const authRoutes = require('./routes/auth')
const classRoutes = require('./routes/classes')
const agreementRoutes = require('./routes/agreements')
const config = require('./config')

// Create a server with a host and port
const server = Hapi.server({
  port: 8000
})

// Add the routes
server.route(routes)
server.route(authRoutes)
server.route(classRoutes)
server.route(agreementRoutes)

// Plugin options
const yarOptions = {
  storeBlank: false,
  cookieOptions: {
    password: config.YAR_SECRET,
    isSecure: process.env.NODE_ENV !== 'development',
    isSameSite: 'Lax'
  }
}

const plugins = [
  { plugin: require('hapi-auth-cookie') },
  { plugin: require('vision') },
  { plugin: require('inert') },
  { plugin: require('yar'), options: yarOptions }
]

// Start the server
async function start () {
  await server.register(plugins)

  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: 'src/public'
      }
    }
  })

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates',
    layout: true,
    layoutPath: 'templates/layouts',
    helpersPath: 'templates/helpers',
    partialsPath: 'templates/partials'
  })

  server.auth.strategy('session', 'cookie', {
    password: config.COOKIE_SECRET,
    cookie: 'minelev-avtaler-session',
    redirectTo: `${config.AUTH_SERVICE_URL}/login?origin=${config.ORIGIN_URL}`,
    appendNext: 'nextPath',
    isSecure: process.env.NODE_ENV !== 'development',
    isSameSite: 'Lax'
  })

  server.auth.default('session')

  await server.start()
  console.log('Server running at: ', server.info.uri)
}

start().catch(console.error)
