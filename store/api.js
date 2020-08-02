import API from '@/api'

export const actions = {
  check () {
    return API.check()
  },

  // user
  getUser () {
    return API.getUser()
  },
  createUser (context, data) {
    return API.createUser(data)
  },
  updateUser (context, data) {
    return API.updateUser(data)
  },

  // board
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

  // column
  createColumn (context, payload) {
    return API.createColumn(payload.board, payload.data)
  },
  updateColumn (context, payload) {
    return API.updateColumn(payload.id, payload.data)
  },
  removeColumn (context, id) {
    return API.removeColumn(id)
  },

  // card
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
  },

  // search
  search (context, query = '') {
    return API.search(query)
  },
  searchCardBoard (context, cardId) {
    return API.searchCardBoard(cardId)
  }
}

export default {
  actions
}
