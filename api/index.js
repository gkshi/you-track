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
  updateBoard (payload) {
    return this.do('PUT', `/boards/${payload.board}`, payload.data)
  },
  removeBoard (id) {
    return this.do('DELETE', `/boards/${id}`)
  },

  createColumn (board, data) {
    return new Promise((resolve, reject) => {
      // create column
      this.do('POST', `/boards/${board._id}/columns`, data).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  removeColumn (payload) {
    return new Promise(async (resolve, reject) => {
      // remove column
      await this.do('DELETE', `/columns/${payload.id}`)
      // update columns order in board
      await this.updateBoard({
        board: payload.board._id,
        data: {
          order: [...payload.board.order].filter(i => i !== payload.id)
        }
      }).then(() => {
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  },

  getCard (id) {
    return this.do('GET', `/cards/${id}`)
  },
  createCard (column, data) {
    return this.do('POST', `/columns/${column}/cards`, data)
  }
}
