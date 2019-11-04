const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser')
const router = express.Router()
// const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static(__dirname + '/public'))

/**
 * MongoDB init
 */
// eslint-disable-next-line no-unused-vars
let db
const dbName = 'youtrack'
const url = 'mongodb://localhost:27017/'
const mongoClient = new MongoClient(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

mongoClient.connect((err, client) => {
  if (err) {
    throw new Error(err)
  }
  db = client.db(dbName)
  app.listen(3000)
})

/**
 * Routes
 */
router.get('/user', (request, response) => {
  const users = db.collection('users')
  users.find().toArray().then(items => {
    if (items[0]) {
      response.send(items[0])
    } else {
      response.status(404).send(null)
    }
  })
})
router.post('/user', (request, response) => {
  const users = db.collection('users')
  users.insertOne({
    name: request.body.name
  }).then(res => {
    response.send(res.ops[0])
  })
})

router.get('/boards', (req, res) => {
  const boards = db.collection('boards')
  boards.find({}).toArray((err, items) => {
    if (err) {
      throw new Error(err)
    }
    res.send(items)
  })
})

router.get('/boards/:alias', async (request, response, next) => {
  const board = await db.collection('boards').findOne({
    alias: request.params.alias
  })
  if (!board) {
    // return sendResponse(404, 'not found')
    // return response.status(404)
    // throw new Error('Not found')
    // return next(new Error(404))
    return response.status(404).send()
  }
  const columns = await db.collection('columns').find({
    board: board._id
  }).toArray()
  const promises = []
  columns.forEach(column => {
    const promise = new Promise(async (resolve, reject) => {
      const tasks = await db.collection('tasks').find({
        column: ObjectId(column._id)
      }).toArray()
      column.tasks = tasks
      resolve()
    })
    promises.push(promise)
  })
  Promise.all(promises).then(() => {
    board.columns = columns
    response.send(board)
  })
})

router.post('/boards', (request, response) => {
  if (!request.body.title || !request.body.alias) {
    return response.status(452).send('POST board error')
  }
  const boards = db.collection('boards')
  boards.insertOne({
    title: request.body.title,
    alias: request.body.alias,
    description: request.body.description
  }).then(res => {
    response.send(res.ops[0])
  })
})
router.delete('/boards/:id', (request, response) => {
  const boards = db.collection('boards')
  boards.deleteOne({
    _id: ObjectId(request.params.id)
  }).then(() => {
    response.send('ok')
  })
})

router.post('/boards/:alias/columns', async (request, response) => {
  const columns = db.collection('columns')
  const board = await db.collection('boards').findOne({
    alias: request.params.alias
  })
  columns.insertOne({
    title: request.body.title,
    board: board._id,
    tasks: []
  }).then(res => {
    response.send(res.ops[0])
  })
})
router.delete('/columns/:id', (request, response) => {
  const columns = db.collection('columns')
  columns.deleteOne({
    _id: ObjectId(request.params.id)
  }).then(() => {
    response.send('ok')
  })
})

router.post('/columns/:column/tasks', (request, response) => {
  const tasks = db.collection('tasks')
  // const column = await db.collection('columns').findOne({
  //   _id: ObjectId(request.params.column)
  // })
  // console.log('column', column._id)
  tasks.insertOne({
    title: request.body.title,
    column: ObjectId(request.params.column)
  }).then(res => {
    response.send(res.ops[0])
  })
})

app.use('/api', router)

// app.use(function (err, req, res, next) {
//   console.log('<<< err', err)
//   // console.error(err.stack)
//   res.status(err).send('Something broke!')
// })

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  // consola.ready({
  //   message: `Server listening on http://${host}:${port}`,
  //   badge: true
  // })
}
start()
