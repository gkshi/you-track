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

  // Parent column id
  column: {
    type: String,
    hidden: true
  }
}
