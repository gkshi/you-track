export default {
  _id: {
    type: String,
    hidden: true
  },

  title: {
    type: String,
    required: true
  },

  // Parent board id
  board: {
    type: String,
    hidden: true
  },

  // Card list
  cards: {
    type: Array,
    hidden: true
  },

  // Card order in column
  order: {
    type: Array
  }
}
