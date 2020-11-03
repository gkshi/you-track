// Modules
import api from './api'
import push from './push'

export const modules = {
  api,
  push
}

export const state = () => ({
  user: {},
  modals: [],
  activeBoard: {},
  activeCard: {},

  // information messages, network status, api errors
  messages: []
})

export const actions = {
  updateUser ({ commit }, user = {}) {
    commit('USER_UPDATE', user)
  },

  openModal ({ commit }, id) {
    commit('MODAL_ADD', id)
  },
  closeModal ({ commit }, id) {
    commit('MODAL_REMOVE', id)
  },
  closeAllModals ({ commit }) {
    commit('MODAL_CLEAR')
  },

  changeActiveBoard ({ commit }, board) {
    const copy = { ...board }
    // TODO: временное решение
    delete copy.columns
    // delete copy.labels
    commit('ACTIVE_BOARD_UPDATE', copy)
  },

  async changeActiveCard ({ dispatch, commit, state }, card = null) {
    if (card) {
      const res = await dispatch('api/getCard', card).catch(() => null)
      if (res) {
        commit('ACTIVE_CARD_UPDATE', res)
        this.$router.push({
          query: {
            card: res._id
          }
        })
        return
      }
    }

    commit('ACTIVE_CARD_UPDATE', {})
    this.$router.push({
      query: {}
    })
  },

  showMessage ({ commit }, data) {
    const message = this.app.$models.create('message', data)
    commit('MESSAGES_ADD', message)
  },
  // TODO: проверить, нужно ли почистить за компонентом "message"
  // либо привести в порядок, либо вырезать полностью
  hideMessage ({ commit }, id) {
    commit('MESSAGES_REMOVE', id)
  }
}

export const mutations = {
  USER_UPDATE (state, user) {
    state.user = user
  },

  MODAL_ADD (state, id) {
    state.modals.push(id)
  },
  MODAL_REMOVE (state, id) {
    state.modals = state.modals.filter(i => i !== id)
  },
  MODAL_CLEAR (state) {
    state.modals = []
  },

  ACTIVE_BOARD_UPDATE (state, board) {
    state.activeBoard = board
  },
  ACTIVE_CARD_UPDATE (state, card) {
    state.activeCard = card
  },

  MESSAGES_ADD (state, message) {
    state.messages.push(message)
  },
  MESSAGES_REMOVE (state, id) {
    state.messages = state.messages.filter(i => i.id !== id)
  }
}

export const getters = {
  activeBoard: state => {
    return state.activeBoard
  }
}
