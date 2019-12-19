export default {
  // type of message
  type: {
    type: String,
    default: 'info',
    validation: value => ['info', 'success', 'error'].includes(value),
    required: true
  },

  // error object (if type === 'error')
  error: {
    type: Object,
    default: null
  },

  // data field (if type !== 'error')
  data: {
    type: Object,
    default: null
  }
}
