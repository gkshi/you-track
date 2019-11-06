const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser')
const router = express.Router()
const { Nuxt, Builder } = require('nuxt')
const app = express()
const Helpers = require('./helpers')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// eslint-disable-next-line no-path-concat
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

// get user
router.get('/user', (request, response) => {
  const users = db.collection('users')
  users.find().toArray().then(items => {
    if (items[0]) {
      response.send(items[0])
    } else {
      response.status(404).send({})
    }
  })
})
// create user
router.post('/user', (request, response) => {
  const users = db.collection('users')
  users.insertOne({
    name: request.body.name,
    photo: request.body.photo
  }).then(res => {
    response.send(res.ops[0])
  })
})

// get boards
router.get('/boards', (req, res) => {
  const boards = db.collection('boards')
  boards.find({}).toArray((err, items) => {
    if (err) {
      throw new Error(err)
    }
    res.send(items)
  })
})

// get board
router.get('/boards/:alias', async (request, response) => {
  // find board
  const board = await db.collection('boards').findOne({
    alias: request.params.alias
  })
  if (!board) {
    return response.status(404).send()
  }
  // find board columns
  let columns = await db.collection('columns').find({
    board: board._id
  }).toArray()
  columns = Helpers.sort(columns, board.order)
  const promises = []
  columns.forEach(column => {
    const promise = new Promise(async (resolve, reject) => {
      const cards = await db.collection('cards').find({
        column: ObjectId(column._id)
      }).toArray()
      column.cards = cards
      resolve()
    })
    promises.push(promise)
  })
  Promise.all(promises).then(() => {
    board.columns = columns
    response.send(board)
  })
})

// create board
router.post('/boards', (request, response) => {
  if (!request.body.title || !request.body.alias) {
    return response.status(452).send('POST board error')
  }
  const boards = db.collection('boards')
  boards.insertOne({
    title: request.body.title,
    alias: request.body.alias,
    description: request.body.description,
    columns: [],
    order: []
  }).then(res => {
    response.send(res.ops[0])
  })
})

// update board
router.put('/boards/:id', (request, response) => {
  const boards = db.collection('boards')
  boards.updateOne({
    _id: ObjectId(request.params.id)
  }, {
    $set: {
      ...request.body
    },
    $currentDate: {
      lastModified: true
    }
  }).then(async () => {
    const board = await boards.findOne({
      _id: ObjectId(request.params.id)
    })
    response.send(board)
  }).catch(err => {
    console.warn(err)
    response.status(501).send()
  })
})

// remove board
router.delete('/boards/:id', (request, response) => {
  const boards = db.collection('boards')
  boards.deleteOne({
    _id: ObjectId(request.params.id)
  }).then(() => {
    response.send('ok')
  })
})

// create column
router.post('/boards/:id/columns', async (request, response) => {
  const columns = db.collection('columns')
  const board = await db.collection('boards').findOne({
    _id: ObjectId(request.params.id)
  })
  columns.insertOne({
    title: request.body.title,
    board: board._id,
    cards: []
  }).then(res => {
    response.send(res.ops[0])
  })
})

// remove column
router.delete('/columns/:id', (request, response) => {
  const columns = db.collection('columns')
  columns.deleteOne({
    _id: ObjectId(request.params.id)
  }).then(() => {
    response.send('ok')
  })
})

router.get('/cards/:id', (request, response) => {
  const cards = db.collection('cards')
  cards.findOne({
    _id: ObjectId(request.params.id)
  }).then(item => {
    response.send(item)
  }).catch(() => {
    response.status(400).send()
  })
})

router.post('/columns/:column/cards', (request, response) => {
  const cards = db.collection('cards')
  cards.insertOne({
    title: request.body.title,
    column: ObjectId(request.params.column)
  }).then(res => {
    response.send(res.ops[0])
  })
})

app.use('/api', router)

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
}
start()
