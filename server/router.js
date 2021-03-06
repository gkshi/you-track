const express = require('express')
const multer = require('multer')
const upload = multer()
const router = express.Router()
const webPush = require('web-push')
const CronJob = require('cron').CronJob
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const firebaseAdmin = require('firebase-admin')
const appVersion = require('../package.json').version
const appConfig = require('../app.config')

const cronJobs = {}

/**
 * MongoDB init
 */
let db
const dbName = 'youtrack'
const dbUrl = process.env.NODE_ENV === 'production'
  ? `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-pampp.mongodb.net/test?retryWrites=true&w=majority`
  : 'mongodb://localhost:27017'
const mongoClient = new MongoClient(dbUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

mongoClient.connect((err, client) => {
  if (err) {
    throw new Error(err)
  }
  db = client.db(dbName)
  // app.listen(3000)
})

router.post('/startcron', (request, response) => {
  const subscription = request.body.subscription
  const payload = JSON.stringify({
    title: 'Push notifications with Service Workers'
  })
  // CronJob
  cronJobs[request.body.id] = new CronJob(
    '0-59/6 * * * * *',
    function (onComplete) {
      console.log('You will see this message every 10 seconds')
      webPush.sendNotification(subscription, payload).catch(error => {
        console.log(error)
      })
      if (onComplete) {
        onComplete()
      }
    },
    function () {
      console.log('onComplete')
      console.log('this', this)
      // this.stop()
    })
  cronJobs[request.body.id].start()
  response.send({ status: 'ok' })
})
router.post('/stopcron', (request, response) => {
  console.log('stop', request.body.id)
  cronJobs[request.body.id].stop()
  response.send({ status: 'ok' })
})

router.post('/push-test', (request, response) => {
  // const subscription = request.body.subscription
  // console.log('subscription', subscription)
  // const payload = JSON.stringify({
  //   title: 'Push notifications with Service Workers'
  // })
  // const res = await webPush.sendNotification(subscription, payload).then(res => {
  //   console.log('res', res)
  // }).catch(error => {
  //   console.error(error)
  //   return null
  // })
  const app = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
    databaseURL: 'https://youtrack-a4424.firebaseio.com'
  })
  console.log('app', app)
  const res = false
  if (res) {
    response.status(200).send({})
  } else {
    response.status(500).send()
  }
})

/**
 * API ping
 */
router.get('/', (request, response) => {
  response.send({
    version: appVersion
  })
})

/**
 * Get user
 */
router.get('/user', async (request, response) => {
  const user = await _getOne('users')
  response.send(user)
})
/**
 * Create user
 * @param user <object>
 */
router.post('/user', async (request, response) => {
  const user = await _add('users', {
    name: request.body.name,
    photo: request.body.photo
  })
  response.send(user)
})
/**
 * Update user
 * @param user <object>
 */
router.put('/user', async (request, response) => {
  const data = { ...request.body }
  delete data._id
  await _update('users', request.body._id, data)
  const user = await _getOne('users', request.body._id)
  response.send(user)
})

/**
 * Get boards
 */
router.get('/boards', async (request, response) => {
  const boards = await _get('boards')

  // set card number in each board
  for (const board of boards) {
    const cards = await _get('cards', {
      board: board._id
    })
    board.cards = cards.length
  }
  // boards.forEach(board => {
  //   const cardNumber = await _get('cards', {
  //     board: board._id
  //   })
  // })

  response.send(boards)
})
/**
 * Get board
 * @param alias <string>
 */
router.post('/boards/:alias', async (request, response) => {
  // find board at first
  const board = await _getOne('boards', {
    alias: request.params.alias
  })

  if (!board) {
    return response.status(404).send()
  }

  if (board.isPrivate) {
    const publicBoard = {
      _id: board._id,
      title: board.title,
      alias: board.alias,
      columns: [],
      labels: [],
      order: [],
      isPrivate: true,
      lastModified: board.lastModified
    }

    if (!request.body.passcode) {
      response.status(401).send(publicBoard)
      return
    }

    console.log('request.body.passcode', request.body.passcode)
    if (request.body.passcode !== board.passcode) {
      response.status(401).send(publicBoard)
      return
    }
  }

  // then find board columns
  let columns = await _get('columns', {
    board: ObjectId(board._id)
  })
  columns = sortById(columns, board.order)

  // then find all cards of each column
  const promises = []
  columns.forEach(column => {
    const promise = new Promise((resolve, reject) => {
      _get('cards', {
        column: ObjectId(column._id)
      }).then(cards => {
        column.cards = sortById(cards, column.order)
        resolve()
      })
    })
    promises.push(promise)
  })
  Promise.all(promises).then(() => {
    board.columns = columns
    response.send(board)
  })
})
/**
 * Create board
 * @param board <object>
 */
router.post('/boards', async (request, response) => {
  const defaultLabelSet = appConfig.defaultLabelSet()

  // Check alias unique
  const existing = await _getOne('boards', {
    alias: request.body.alias
  })
  if (existing) {
    response.send({
      errors: {
        alias: 'Alias must be unique'
      }
    })
    return
  }

  const data = {
    title: request.body.title,
    alias: request.body.alias,
    description: request.body.description,
    columns: [],
    order: [],
    labels: defaultLabelSet,
    isPrivate: request.body.isPrivate
  }

  if (data.isPrivate) {
    data.passcode = request.body.passcode
  }

  // Create a board
  const board = await _add('boards', data)
  response.send(board)
})
/**
 * Update board
 * @param id <string>
 * @param data <object>
 */
router.put('/boards/:id', async (request, response) => {
  await _update('boards', request.params.id, request.body)
  const board = await _getOne('boards', request.params.id)
  response.send(board)
})
/**
 * Remove board
 * @param id <id>
 */
router.delete('/boards/:id', async (request, response) => {
  const columns = await _get('columns', {
    board: ObjectId(request.params.id)
  })

  // Remove child cards
  await _remove('cards', {
    column: {
      $in: columns.map(i => i._id)
    }
  })

  // Remove child columns
  await _remove('columns', {
    board: ObjectId(request.params.id)
  })

  // Remove board
  const result = await _remove('boards', request.params.id)

  response.send(result)
})

/**
 * Create column
 * @param column <object>
 */
router.post('/columns', async (request, response) => {
  // Create column
  const column = await _add('columns', {
    title: request.body.data.title,
    board: ObjectId(request.body.board),
    cards: [],
    order: []
  })

  // Update board columns order
  const board = await _getOne('boards', request.body.board)
  await _update('boards', request.body.board, {
    order: [...board.order, column._id.toString()]
  })
  response.send(column)
})
/**
 * Update column
 * @param id <string>
 * @param data <object>
 */
router.put('/columns/:id', async (request, response) => {
  await _update('columns', request.params.id, request.body)
  const column = await _getOne('columns', request.params.id)
  response.send(column)
})
/**
 * Remove column
 * @param id <string>
 */
router.delete('/columns/:id', async (request, response) => {
  const column = await _getOne('columns', request.params.id)

  // update board order
  const board = await _getOne('boards', {
    _id: column.board
  })
  const newOrder = board.order.filter(i => {
    return typeof i === 'string' ? i !== column._id.toString() : i !== column._id
  })
  await _update('boards', { _id: board._id }, {
    order: newOrder
  })

  // remove cards in column
  await _remove('cards', {
    column: column._id
  })

  // remove column
  const res = await _remove('columns', request.params.id)
  response.send(res)
})

/**
 * Get card
 * @param id <string>
 */
router.get('/cards/:id', async (request, response) => {
  const card = await _getOne('cards', request.params.id)
  if (card) {
    response.send(card)
  } else {
    response.status(404).send({})
  }
})
/**
 * Create card
 * @param data <object>
 */
router.post('/cards', async (request, response) => {
  // Create card
  const card = await _add('cards', {
    ...request.body,
    column: ObjectId(request.body.column),
    board: ObjectId(request.body.board)
  })

  // Update column order
  const column = await _getOne('columns', request.body.column)
  await _update('columns', request.body.column, {
    order: [...column.order, card._id.toString()]
  })
  response.send(card)
})
/**
 * Move card between columns
 * @param card <string>
 * @param column.id <string>
 * @param column.order <array>
 */
router.post('/cards/move', async (request, response) => {
  // Update card column
  const card = await _getOne('cards', request.body.card)
  await _update('cards', request.body.card, {
    column: ObjectId(request.body.column.id)
  })

  // Update columnFrom order
  const columnFrom = await _getOne('columns', { _id: card.column })
  await _update('columns', { _id: card.column }, {
    order: columnFrom.order.filter(i => i !== request.body.card)
  })

  // Update columnTo order
  await _update('columns', request.body.column.id, {
    order: request.body.column.order
  })

  response.send({})
})
/**
 * Update card
 * @param id <string>
 * @param data <object>
 */
router.put('/cards/:id', async (request, response) => {
  const data = request.body
  delete data._id
  delete data.column
  const result = await _update('cards', request.params.id, data)
  response.send(result)
})
/**
 * Remove card
 * @param id <string>
 */
router.delete('/cards/:id', async (request, response) => {
  // Remove card
  const card = await _getOne('cards', request.params.id)
  const res = await _remove('cards', request.params.id)

  // Update column order
  const column = await _getOne('columns', { _id: card.column })
  await _update('columns', { _id: column._id }, {
    order: column.order.filter(i => i !== request.params.id)
  })

  response.send(res)
})

/**
 * Create label
 */
router.post('/labels', async (request, response) => {
  const board = await _getOne('boards', request.body.board)
  const sortedLabelsById = [...board.labels].sort((a, b) => b._id - a._id)
  const label = {
    ...request.body.label,
    _id: sortedLabelsById[0]._id + 1
  }
  const res = await _update('boards', request.body.board, {
    labels: [...board.labels, label]
  })
  if (res) {
    response.send(label)
    return
  }
  response.status(500).send({
    error: 'not updated'
  })
})
router.patch('/labels', async (request, response) => {
  const card = await _getOne('cards', request.body.card)
  card.labels = card.labels || []

  let newValue = []

  if (card.labels.find(i => i === request.body.label)) {
    newValue = card.labels.filter(i => i !== request.body.label)
  } else {
    newValue = [...card.labels, request.body.label]
  }
  const res = await _update('cards', request.body.card, {
    labels: newValue
  })
  console.log('res', res)
  response.send({})
})
/**
 * Update label
 * @param id <string>
 * @param data <object>
 */
router.put('/labels', async (request, response) => {
  const board = await _getOne('boards', request.body.board)
  const newLabels = [...board.labels]
  const targetIndex = newLabels.findIndex(i => i._id === request.body.data._id)
  const updatedLabel = {
    ...newLabels[targetIndex],
    ...request.body.data
  }
  newLabels.splice(targetIndex, 1, updatedLabel)
  const res = await _update('boards', request.body.board, {
    labels: newLabels
  })
  if (res) {
    response.send(updatedLabel)
    return
  }
  response.status(500).send({
    error: 'not updated'
  })
})
/**
 * Remove label
 */
router.delete('/labels/:board/:label', async (request, response) => {
  // delete the label
  const board = await _getOne('boards', request.params.board)
  const newLabels = [...board.labels.filter(i => i._id !== +request.params.label)]
  const removeResult = await _update('boards', request.body.board, {
    labels: newLabels
  })

  // remove label from all the cards
  const cardsWithLabel = await _get('cards', {
    labels: {
      $in: [+request.params.label]
    }
  })

  const updateResults = []
  for (let i = 0; i < cardsWithLabel.length; i++) {
    const res = await _update('cards', {
      _id: cardsWithLabel[i]._id
    }, {
      labels: cardsWithLabel[i].labels.filter(i => i !== +request.params.label)
    })
    updateResults.push(res)
  }

  if (removeResult && updateResults.length === cardsWithLabel.length) {
    response.send({})
    return
  }
  response.status(500).send({
    error: 'not done'
  })
})

router.get('/files', async (request, response) => {
  const files = await _get('files', {
    card: ObjectId(request.query.card)
  })
  response.send(files || [])
  // response.status(500).send({
  //   error: 'not uploaded'
  // })
})
/**
 * upload file
 */
router.post('/files/:card', upload.any(), async (request, response) => {
  let result = null
  for (const file of request.files) {
    const res = await _add('files', {
      title: file.originalname,
      card: ObjectId(request.params.card),
      type: file.mimetype, // data:image/png;base64,
      source: file.buffer.toString('base64')
    })
    result = res
  }
  if (result) {
    response.send(result)
  }
  // response.status(500).send({
  //   error: 'not uploaded'
  // })
})
/**
 * delete file
 */
router.delete('/files/:id', async (request, response) => {
  const res = await _remove('files', request.params.id)
  response.send(res)
})

/**
 * Search in boards and cards by text fields
 */
router.get('/search', async (request, response) => {
  const text = request.query.query

  if (text === '') {
    response.send({
      boards: [],
      cards: []
    })
  }

  const boards = await _get('boards', _generateSearchQuery(['title', 'description', 'alias'], text))
  const cards = await _get('cards', _generateSearchQuery(['title', 'description'], text))

  response.send({
    boards,
    cards
  })
})
/**
 * Search board by card ID
 * @param id <string>
 */
router.get('/search/:id', async (request, response) => {
  let card
  // get card by id
  try {
    card = await _getOne('cards', request.params.id)
  } catch (e) {
    response.status(404).send()
    return
  }
  // get card column
  const column = await _getOne('columns', {
    _id: card.column
  })
  if (column) {
    // get card board
    const board = await _getOne('boards', {
      _id: column.board
    })
    response.send(board)
  } else {
    response.status(404).send()
  }
})

/**
 * Helpers
 */

/**
 * @param fields
 * @param text
 * @param logicalOperator
 * @returns {{logicalOperator: []}}
 * @private
 */
function _generateSearchQuery (fields, text, logicalOperator = '$or') {
  const arr = []

  fields.forEach(field => {
    arr.push({
      [field]: {
        $regex: '.*' + text + '.*',
        $options: 'gim'
      }
    })
  })

  return { [logicalOperator]: arr }
}

function sortById (items, ids = []) {
  const sorted = []
  ids.forEach(id => {
    const item = items.find(i => ObjectId(i._id).equals(id))
    if (item) {
      sorted.push(item)
    }
  })
  if (sorted.length !== items.length) {
    const idsStr = ids.join(',')
    items.forEach(i => {
      if (!idsStr.includes(i._id)) {
        sorted.push(i)
      }
    })
  }
  return sorted
}

async function _get (from, query = {}) {
  if (typeof query !== 'object') {
    query = {
      _id: ObjectId(query)
    }
  }
  const result = await db.collection(from).find({
    ...query
  }).toArray()
  return result
}

async function _getOne (from, query) {
  const result = await _get(from, query)
  return result[0]
}

async function _add (to, data = {}) {
  if (!data._id) {
    delete data._id
  }
  let result = null
  if (Array.isArray(data)) {
    result = await db.collection(to).insertMany(data).then(res => {
      return res.ops
    })
  } else {
    result = await db.collection(to).insertOne(data).then(res => {
      return res.ops[0]
    })
  }
  return result
}

async function _update (collection, query = {}, data = {}) {
  // Предотвращаем перезапись _id (если вдруг придет новое значение с клиента)
  delete data._id
  if (typeof query !== 'object') {
    query = {
      _id: ObjectId(query)
    }
  }
  const result = await db.collection(collection).updateOne(query, {
    $set: data,
    $currentDate: {
      lastModified: true
    }
  }).then(res => {
    if (!res.result.ok) {
      throw new Error(res.error)
    }
    return res.result
  })
  return result
}

async function _remove (from, query = {}) {
  if (typeof query !== 'object') {
    query = {
      _id: ObjectId(query)
    }
  }
  let result = null
  if (query._id) {
    result = await db.collection(from).deleteOne(query).then(res => {
      return res.result
    })
  } else {
    result = await db.collection(from).deleteMany(query).then(res => {
      return res.result
    })
  }

  return result
}

module.exports = router
