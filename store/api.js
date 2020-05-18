import API from '@/api'

export const actions = {
  check () {
    return API.check()
  },

  // users
  getUser () {
    return API.getUser()
  },
  createUser (context, data) {
    return API.createUser(data)
  },

  // boards
  getBoards () {
    return API.getBoards()
  },
  getBoard (context, alias) {
    return API.getBoard(alias)
  },
  createBoard (context, data) {
    return API.createBoard(data)
  },
  updateBoard (context, payload) {
    return API.updateBoard(payload)
  },
  removeBoard ({ dispatch }, id) {
    return API.removeBoard(id)
  },

  // columns
  createColumn (context, payload) {
    return API.createColumn(payload.board, payload.data)
  },
  updateColumn (context, payload) {
    return API.updateColumn(payload.id, payload.data)
  },
  removeColumn (context, id) {
    return API.removeColumn(id)
  },

  // cards
  createCard (context, data) {
    return API.createCard(data)
  },
  getCard (context, id) {
    return API.getCard(id)
  },
  updateCard (context, data) {
    return API.updateCard(data)
  },
  moveCard (context, payload) {
    return API.moveCard(payload)
  },
  removeCard (context, id) {
    return API.removeCard(id)
  }
}

export default {
  actions
}
