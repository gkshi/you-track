<template lang="pug">
  .page.index
    .wrapper
      template(v-if="boards.length")
        div My boards:
        .boards.flex.column.a-start
          .board.flex(v-for="board in boards" :key="board.id")
            nuxt-link(:to="`/boards/${board.alias}`")
              div {{ board.title }}
            .actions
              span (
              a(href="#" @click.prevent="removeBoard(board)") remove
              span )
      div(v-if="!boards.length")
        div No boards yet.

      commonButton(@click="openModal('create_board')") Create

    modalCreateBoard(@success="onBoardCreate")
</template>

<script>
import modalCreateBoard from '@/components/modals/create-board'

export default {
  name: 'index-page',
  components: {
    modalCreateBoard
  },
  data () {
    return {
      boards: []
    }
  },
  methods: {
    onBoardCreate (board) {
      this.boards.push(board)
    },
    removeBoard (board) {
      this.$store.dispatch('api/removeBoard', board._id).then(() => {
        this.boards = this.boards.filter(i => i._id !== board._id)
      })
    }
  },
  created () {
    this.$store.dispatch('api/getBoards').then(res => {
      this.boards = res
    })
  }
}
</script>

<style lang="scss" scoped>
  .index {
    .boards {
      margin: 10px auto 30px;
    }
    .board {
      width: 300px;
      background: #f8f8f8;
      padding: 20px 20px;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      .actions {
        margin-left: 10px;
      }
    }
  }
</style>
