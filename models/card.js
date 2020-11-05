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

  // Label list
  labels: {
    type: Array
  },

  // file list
  files: {
    type: Array,
    hidden: true
  },

  // Column parent ID
  column: {
    type: String,
    required: true
  },

  // Board ID
  board: {
    type: String,
    hidden: true
  }
}
