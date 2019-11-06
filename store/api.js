import API from '@/api'

export const actions = {
  // users
  getUser () {
    return API.getUser()
  },
  createUser ({ dispatch }, data) {
    return API.createUser(data)
  },

  // boards
  getBoards () {
    return API.getBoards()
  },
  getBoard ({ dispatch }, alias) {
    return API.getBoard(alias)
  },
  createBoard ({ dispatch }, data) {
    return API.createBoard(data)
  },
  updateBoard ({ dispatch }, payload) {
    return API.updateBoard(payload)
  },
  removeBoard ({ dispatch }, id) {
    return API.removeBoard(id)
  },

  // columns
  createColumn ({ dispatch }, payload) {
    return API.createColumn(payload.board, payload.data)
  },
  removeColumn ({ dispatch }, payload) {
    return API.removeColumn(payload)
  },

  // cards
  createCard ({ dispatch }, payload) {
    return API.createCard(payload.column, payload.data)
  },
  getCard ({ dispatch }, id) {
    return API.getCard(id)
  }
}

export default {
  actions
}
