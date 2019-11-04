import API from '@/api'

export const actions = {
  getUser () {
    return API.getUser()
  },
  createUser ({ dispatch }, data) {
    return API.createUser(data)
  },

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

  createColumn ({ dispatch }, payload) {
    return API.createColumn(payload.board, payload.data)
  },
  removeColumn ({ dispatch }, id) {
    return API.removeColumn(id)
  },

  createTask ({ dispatch }, payload) {
    return API.createTask(payload.column, payload.data)
  }
}

export default {
  actions
}
