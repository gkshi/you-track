<template lang="pug">
  common-modal.board-create-modal(:id="id" size="narrow" @open="onOpen" @close="reset")
    .h2(slot="head") Edit board
    form(@submit.prevent="update")
      common-input(v-model="board.title" placeholder="Title" autofocus)
      common-input(v-model="board.alias" placeholder="Alias")
      common-textarea(v-model="board.description" placeholder="Description")
      .buttons(slot="buttons")
        common-button(native="submit" :disabled="isLoading || !board.title || !board.alias") Update
        common-button(type="light" @click="closeModal(id)") Cancel
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      id: 'board_edit',
      isLoading: false,
      board: this.$models.create('board')
    }
  },
  computed: {
    ...mapState({
      activeBoard: state => state.activeBoard
    })
  },
  watch: {
    activeBoard: {
      handler () {
        this.board.update(this.activeBoard)
      },
      deep: true
    }
  },
  methods: {
    onOpen () {
      this.board.update(this.activeBoard)
    },
    async update () {
      this.isLoading = true
      const res = await this.$store.dispatch('api/updateBoard', this.board).catch(() => null)
      if (res) {
        this.$emit('update', res)
      }
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
