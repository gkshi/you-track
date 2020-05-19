export default {
  _id: {
    type: String,
    hidden: true
  },

  title: {
    type: String,
    required: true
  },

  alias: {
    type: String,
    required: true,
    validation: value => !/[а-яА-я]/g.test(value)
  },

  description: {
    type: String
  },

  // Column list
  columns: {
    type: Array,
    hidden: true
  },

  // Column order in board
  order: {
    type: Array
  }
}
