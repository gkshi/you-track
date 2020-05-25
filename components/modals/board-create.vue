<template lang="pug">
  commonModal.board-create-modal(:id="id" size="narrow" @close="reset")
    .h1(slot="title") Create new board
    form(@submit.prevent="create")
      commonInput(
        v-model="board.title"
        placeholder="Title"
        @input="fillInAlias"
        autofocus)
      commonInput(
        v-model="board.alias"
        @input="manualAliasSetting = true"
        placeholder="Alias")
      commonTextarea(v-model="board.description" placeholder="Description (optional)")
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
      board: this.$models.create('board'),
      manualAliasSetting: false
    }
  },
  methods: {
    fillInAlias () {
      if (!this.manualAliasSetting) {
        const alias = this.board.title
          .trim()
          .toLowerCase()
          .replace(/\s/g, '-')
          .replace(/[^a-z0-9-_]/g, '')
        this.board.alias = alias
      }
    },
    async create () {
      this.isLoading = true
      const res = await this.$store.dispatch('api/createBoard', this.board)
      this.$emit('success', res)
      this.isLoading = false
      this.closeModal(this.id)
    },
    reset () {
      // TODO: this.board.reset()
      this.board = this.$models.create('board')
      this.manualAliasSetting = false
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
