const Hapi = require('hapi')
const routes = require('./routes')

// Create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 8000
})

// Add the routes
server.route(routes)

// Start the server
async function start () {
  try {
    await server.register(require('inert'))
    await server.register(require('vision'))
    server.route({
      method: 'GET',
      path: '/public/{param*}',
      handler: {
        directory: {
          path: 'public'
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
    await server.start()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  console.log('Server running at: ', server.info.uri)
}

start()
