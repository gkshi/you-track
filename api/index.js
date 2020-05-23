import axios from 'axios'

const urlPrefix = '/api'

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
      url: `${urlPrefix}${url}`,
      headers: {
        'Cache-Control': 'no-cache',
        ...headers
      }
    }
    method === 'GET' ? options.params = data : options.data = data
    return new Promise((resolve, reject) => {
      axios(options).then(res => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  check () {
    return this.do('GET', '/')
  },

  getUser () {
    return this.do('GET', '/user')
  },
  createUser (data) {
    return this.do('POST', '/user', data)
  },

  getBoards () {
    return this.do('GET', '/boards')
  },
  getBoard (alias) {
    return this.do('GET', `/boards/${alias}`)
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

  createColumn (board, data) {
    return this.do('POST', '/columns', { board, data })
  },
  updateColumn (id, data) {
    return this.do('PUT', `/columns/${id}`, data)
  },
  removeColumn (id) {
    return this.do('DELETE', `/columns/${id}`)
  },

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

  search (query) {
    return this.do('GET', '/search', { query })
  }
}
