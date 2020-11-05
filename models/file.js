export default {
  _id: {
    type: String,
    hidden: true
  },

  card: String,

  source: {
    type: String,
    required: true
  },

  title: String,

  loading: {
    type: Boolean,
    default: false
  }
}
