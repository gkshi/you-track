export default {
  // type of message
  type: {
    type: String,
    values: ['info', 'success', 'error'],
    required: true
  },

  // error object (if type === 'error')
  error: {
    type: Object,
    default: () => ({})
  },

  // data field (if type !== 'error')
  data: {
    type: Object,
    default: () => ({})
  }
}
