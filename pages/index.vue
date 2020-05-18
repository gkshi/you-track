<template lang="pug">
  .page.index
    .columns.flex.a-start.j-center
      div
        h1 Personal Boards
        .boards
          vBoard(
            v-for="board in boards"
            :data="board"
            :key="board._id"
            @remove="onBoardRemove")
        div
          commonButton(@click="openModal('board_create')") Create a board
      div
        h1 News and updates
        .news-list
          contentBlock(v-for="(item, i) in newsList" :data="item" :key="i")

    modalCreateBoard(@success="onBoardCreate")
</template>

<script>
import newsList from '@/updates'
import vBoard from '@/components/board'
import contentBlock from '@/components/content-block'
import modalCreateBoard from '@/components/modals/board-create'

export default {
  components: {
    vBoard,
    contentBlock,
    modalCreateBoard
  },
  data () {
    return {
      newsList,
      boards: []
    }
  },
  methods: {
    onBoardCreate (board) {
      this.boards.push(this.$models.create('board', board))
    },
    onBoardRemove () {
      console.log('onBoardRemove')
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
  .page.index {
    .columns {
      & > *:last-child {
        margin-left: 128px;
      }
    }
    h1 {
      display: block;
      margin-bottom: 16px;
    }
    .news-list {
      width: 400px;
    }
    .boards {
      margin-bottom: 24px;
      ::v-deep {
        & > *:not(:last-child) {
          margin-bottom: 16px;
        }
      }
    }
  }
</style>
