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
  getBoard (context, payload) {
    if (typeof payload === 'string') {
      payload = {
        alias: payload,
        payload: {}
      }
    }
    return API.getBoard(payload)
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
  createCard (context, payload) {
    const board = String(payload.board)
    delete payload.board
    payload.board = board
    return API.createCard(payload)
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

  // labels
  createLabel (context, payload) {
    return API.createLabel(payload)
  },
  toggleLabel (context, payload) {
    return API.toggleLabel(payload)
  },
  /**
   * update label
   * @param context
   * @param {object} payload
   * @param {string} payload.board
   * @param {object} payload.data
   * @returns {object}
   */
  updateLabel (context, payload) {
    return API.updateLabel(payload)
  },
  /**
   * remove label
   * @param context
   * @param {object} payload
   * @param {string} payload.board
   * @param {string} payload.label
   * @returns {object}
   */
  removeLabel (context, payload) {
    return API.removeLabel(payload)
  },

  getFiles (context, card) {
    return API.getFiles(card)
  },
  uploadFile (context, payload) {
    return API.uploadFile(payload)
  },
  removeFile (context, id) {
    return API.removeFile(id)
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
