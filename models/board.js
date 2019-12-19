export default {
  _id: {
    type: String
  },

  title: {
    type: String,
    required: true
  },

  alias: {
    type: String,
    validation: value => !/[а-яА-я]/g.test(value),
    required: true
  },

  description: String
}
