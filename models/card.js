export default {
  _id: String,

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: false
  },

  // Parent column id
  column: String
}
