/**
 * Information message, network status, api errors
 */

export default {
  id: {
    type: String,
    default: () => Math.random().toFixed(7).slice(2)
  },

  type: {
    type: String,
    default: 'info',
    validation: value => ['info', 'success', 'error'].includes(value),
    required: true
  },

  error: {
    type: Object,
    default: null,
    validation: value => typeof value === 'object' || value === null
  },

  data: {
    type: Object,
    default: null,
    validation: value => typeof value === 'object' || value === null
  }
}
