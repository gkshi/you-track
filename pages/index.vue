<template lang="pug">
  .page.index
    .wrapper
      template(v-if="boards.length")
        h2 My boards:
        .boards.flex.column.a-start
          .board.flex.j-between.a-start(v-for="board in boards" :key="board.id")
            nuxt-link(:to="`/boards/${board.alias}`")
              div {{ board.title }}
            contextMenu.options
              a(href="#" @click.prevent) Rename
              a(href="#" @click.prevent="requestBoardRemoving(board)") Remove
      .boards(v-if="!boards.length")
        div No boards yet.

      commonButton(@click="openModal('create_board')") Create board

    modalCreateBoard(@success="onBoardCreate")
    modalRemoveBoard(@submit="removeBoard" @close="activeBoard = null")
</template>

<script>
import contextMenu from '@/components/context-menu'
import modalCreateBoard from '@/components/modals/create-board'
import modalRemoveBoard from '@/components/modals/remove-board'

export default {
  name: 'index-page',
  components: {
    contextMenu,
    modalCreateBoard,
    modalRemoveBoard
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
    requestBoardRemoving (board) {
      this.activeBoard = board
      this.openModal('remove_board')
    },
    removeBoard (board = this.activeBoard) {
      this.$store.dispatch('api/removeBoard', board._id).then(() => {
        this.boards = this.boards.filter(i => i._id !== board._id)
        this.closeModal('remove_board')
      })
    }
  },
  created () {
    this.$store.dispatch('api/getBoards').then(res => {
      res.forEach(item => {
        const board = this.$models.create('board', item)
        this.boards.push(board)
      })
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
      box-shadow: $box-shadow-light;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      .actions {
        margin-left: 10px;
      }
    }
  }
</style>
