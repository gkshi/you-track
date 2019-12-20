export default {
  _id: String,

  title: {
    type: String,
    required: true
  },

  // Parent board id
  board: String,

  // Card list
  cards: Array,

  // Card order in column
  order: Array
}
