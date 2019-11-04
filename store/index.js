// Modules
import api from './api'

export const modules = {
  api
}

export const state = () => ({
  user: {},
  modals: [],
  activeBoard: null
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
  }
}
