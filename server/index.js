const express = require('express')
const consola = require('consola')
const webPush = require('web-push')
const bodyParser = require('body-parser')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// eslint-disable-next-line no-path-concat
app.use(express.static(__dirname + '/public'))

webPush.setVapidDetails('mailto:gkshi@ya.ru', process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

/**
 * Routes
 */
app.use('/api', require('./router'))

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
