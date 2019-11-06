// Modules
import api from './api'

export const modules = {
  api
}

export const state = () => ({
  user: {},
  modals: [],
  activeBoard: null,
  activeCard: {}
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

  changeActiveBoard ({ commit }, board = null) {
    commit('ACTIVE_BOARD_UPDATE', board)
  },
  changeActiveCard ({ dispatch, commit }, card) {
    if (!card) {
      commit('ACTIVE_CARD_UPDATE', {})
      this.$router.push({
        query: {}
      })
      return
    }
    dispatch('api/getCard', card).then(res => {
      commit('ACTIVE_CARD_UPDATE', res)
      this.$router.push({
        query: {
          card: res._id
        }
      })
    }).catch(err => {
      console.warn('changeActiveCard err', err)
      commit('ACTIVE_CARD_UPDATE', {})
    })
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
  ACTIVE_CARD_UPDATE (state, card = {}) {
    state.activeCard = card
  }
}
