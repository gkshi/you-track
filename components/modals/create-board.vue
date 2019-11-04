<template lang="pug">
  commonModal.create-board-modal(id="create_board")
    div create_board
    .form
      .row
        commonInput(v-model="board.title" placeholder="Title")
      .row
        commonInput(v-model="board.alias" placeholder="Alias")
      .row
        commonTextarea(v-model="board.description" placeholder="Description")
      .row
        commonButton(@click="create" :disabled="!board.title || !board.alias") Create
</template>

<script>
export default {
  name: 'create-board-modal',
  data () {
    return {
      board: {
        title: '',
        alias: '',
        description: ''
      }
    }
  },
  methods: {
    create () {
      console.log('create', this.board)
      this.$store.dispatch('api/createBoard', this.board).then(res => {
        console.log('res', res)
        this.$emit('success', res)
      }).catch(err => {
        console.warn(err)
        this.$emit('error', err)
      }).then(() => {
        this.closeModal('create_board')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .create-board-modal {
    //
  }
</style>
