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
  removeBoard (id) {
    return this.do('DELETE', `/boards/${id}`)
  },

  createColumn (board, data) {
    return this.do('POST', `/boards/${board}/columns`, data)
  },
  removeColumn (id) {
    return this.do('DELETE', `/columns/${id}`)
  },

  createCard (column, data) {
    return this.do('POST', `/columns/${column}/cards`, data)
  }
}
