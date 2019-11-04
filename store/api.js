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
  removeBoard ({ dispatch }, id) {
    return API.removeBoard(id)
  },

  // columns
  createColumn ({ dispatch }, payload) {
    return API.createColumn(payload.board, payload.data)
  },
  removeColumn ({ dispatch }, id) {
    return API.removeColumn(id)
  },

  // cards
  createCard ({ dispatch }, payload) {
    return API.createCard(payload.column, payload.data)
  }
}

export default {
  actions
}
