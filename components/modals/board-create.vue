<template lang="pug">
  commonModal.board-create-modal(:id="id" size="narrow" @close="reset")
    .h1(slot="title") Create new board
    form(@submit.prevent="create")
      commonInput(v-model="board.title" placeholder="Title" autofocus)
      commonInput(v-model="board.alias" placeholder="Alias")
      commonTextarea(v-model="board.description" placeholder="Description")
      .buttons
        commonButton(native="submit" :disabled="isLoading") Create
        commonButton(type="light" @click="closeModal(id)") Cancel
</template>

<script>
export default {
  data () {
    return {
      id: 'board_create',
      isLoading: false,
      board: this.$models.create('board')
    }
  },
  methods: {
    async create () {
      this.isLoading = true
      const res = await this.$store.dispatch('api/createBoard', this.board)
      this.$emit('success', res)
      this.isLoading = false
      this.closeModal(this.id)
    },
    reset () {
      // TODO: заменить на метод reset()
      // после релиза новой версии пакета nuxt-models
      this.board = this.$models.create('board')
    }
  }
}
</script>

<style lang="scss" scoped>
  .board-create-modal {
    form > * {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }
</style>
