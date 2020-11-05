<template lang="pug">
  common-modal.board-create-modal(:id="id" size="narrow" @close="reset")
    .h2(slot="head") Create new board

    form(@submit.prevent="create")
      common-input(
        v-model="board.title"
        placeholder="Title"
        @input="fillInAlias"
        autocomplete="false"
        autofocus)

      common-input(
        v-model="board.alias"
        :error="errors.alias"
        @input="manualAliasSetting = true"
        autocomplete="false"
        placeholder="Alias")

      common-textarea(
        v-model="board.description"
        placeholder="Description (optional)"
        autocomplete="false")

      .buttons(slot="buttons")
        common-button(native="submit" :disabled="isLoading || !board.title || !board.alias") Create
        common-button(type="light" @click="closeModal(id)") Cancel
</template>

<script>
export default {
  data () {
    return {
      id: 'board_create',
      isLoading: false,
      board: this.$models.create('board'),
      errors: {},
      manualAliasSetting: false
    }
  },
  watch: {
    'board.alias' () {
      this.errors = {}
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

      if (res.errors) {
        this.errors = res.errors
        return
      }

      this.$emit('success', res)
      this.isLoading = false
      this.closeModal(this.id)
    },

    reset () {
      // TODO: this.board.reset()
      this.board = this.$models.create('board')
      this.manualAliasSetting = false
      this.errors = {}
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
