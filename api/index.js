import axios from 'axios'
import pushMethods from './push'

const API_BASE_URL = '/api'
const SUCCESS_STATUSES = [200, 201, 204]

axios.interceptors.response.use(
  res => {
    return res
  },
  error => {
    return Promise.reject(error.response)
  }
)

export default {

  /**
   * API general wrapper
   * @param method {String}
   * @param url {String}
   * @param data {Object}
   * @param headers {Object}
   * @returns {Promise}
   */
  do (method = 'GET', url = '', data = {}, headers = {}) {
    const options = {
      method,
      url: `${API_BASE_URL}${url}`,
      headers: {
        'Cache-Control': 'no-cache',
        ...headers
      }
    }
    method === 'GET' ? options.params = data : options.data = data
    return new Promise((resolve, reject) => {
      axios(options).then(res => {
        if (SUCCESS_STATUSES.includes(res.status)) {
          resolve(res.data)
        } else {
          reject(res.data || res)
        }
      }).catch(response => {
        reject(response)
      })
    })
  },

  // ping
  check () {
    return this.do('GET', '/')
  },

  // user
  getUser () {
    return this.do('GET', '/user')
  },
  createUser (data) {
    return this.do('POST', '/user', data)
  },
  updateUser (data) {
    return this.do('PUT', '/user', data)
  },

  // board
  getBoards () {
    return this.do('GET', '/boards')
  },
  getBoard (payload) {
    return this.do('POST', `/boards/${payload.alias}`, payload.payload)
  },
  createBoard (data) {
    return this.do('POST', '/boards', data)
  },
  updateBoard (payload) {
    return this.do('PUT', `/boards/${payload._id}`, payload)
  },
  removeBoard (id) {
    return this.do('DELETE', `/boards/${id}`)
  },

  // column
  createColumn (board, data) {
    return this.do('POST', '/columns', { board, data })
  },
  updateColumn (id, data) {
    return this.do('PUT', `/columns/${id}`, data)
  },
  removeColumn (id) {
    return this.do('DELETE', `/columns/${id}`)
  },

  // card
  getCard (id) {
    return this.do('GET', `/cards/${id}`)
  },
  createCard (data) {
    return this.do('POST', '/cards', data)
  },
  updateCard (data) {
    return this.do('PUT', `/cards/${data._id}`, data)
  },
  moveCard (payload) {
    return this.do('POST', '/cards/move', payload)
  },
  removeCard (id) {
    return this.do('DELETE', `/cards/${id}`)
  },

  createLabel (payload) {
    return this.do('POST', '/labels', payload)
  },
  toggleLabel (payload) {
    return this.do('PATCH', '/labels', payload)
  },
  updateLabel (payload) {
    return this.do('PUT', '/labels', payload)
  },
  removeLabel (payload) {
    return this.do('DELETE', `/labels/${payload.board}/${payload.label}`)
  },

  getFiles (card) {
    return this.do('GET', '/files', { card })
  },
  uploadFile (payload) {
    return this.do('POST', `/files/${payload.card}`, payload.data, {
      'Content-Type': 'multipart/form-data'
    })
  },
  removeFile (id) {
    return this.do('DELETE', `/files/${id}`)
  },

  // search
  search (query) {
    return this.do('GET', '/search', { query })
  },
  searchCardBoard (cardId) {
    return this.do('GET', `/search/${cardId}`)
  },

  ...pushMethods
}
