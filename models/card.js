export default {
  _id: {
    type: String,
    hidden: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  // Column parent ID
  column: {
    type: String,
    required: true
  }
}
