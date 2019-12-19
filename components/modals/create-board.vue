<template lang="pug">
  commonModal.create-board-modal(id="create_board" @open="focus")
    template(slot="title") Board creation
    form.form(id="create_board_form" @submit.prevent="create")
      .row
        commonInput(ref="firstField" v-model="board.title" placeholder="Title")
      .row
        commonInput(v-model="board.alias" placeholder="Alias")
      .row
        commonTextarea(v-model="board.description" placeholder="Description")
    .buttons(slot="actions")
      commonButton(native="submit" form="create_board_form" :disabled="!board.validation") Create
      commonButton(type="light" @click="closeModal('create_board')") Cancel
</template>

<script>
export default {
  name: 'create-board-modal',
  data () {
    return {
      board: this.$models.create('board')
    }
  },
  methods: {
    focus () {
      this.$nextTick(() => {
        this.$refs.firstField.focus()
      })
    },
    create () {
      this.$store.dispatch('api/createBoard', this.board).then(res => {
        this.$emit('success', res)
        this.reset()
      }).catch(error => {
        this.$store.dispatch('showMessage', {
          type: 'error',
          error
        })
        this.$emit('error', error)
      }).then(() => {
        this.closeModal('create_board')
      })
    },
    reset () {
      Object.assign(this.board, this.$options.data().board)
    }
  }
}
</script>

<style lang="scss" scoped>
  .create-board-modal {
    //
  }
</style>
