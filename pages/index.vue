<template lang="pug">
  .page.index
    .wrapper.narrow
      .columns.flex.a-start.j-center
        .left
          h1 Personal Boards
          commonLoader(v-if="isLoading")
          template(v-else)
            .boards
              vBoard(
                v-for="board in boards"
                :data="board"
                :key="board._id"
                @update="onBoardUpdate"
                @remove="onBoardRemove")
            div
              commonButton(@click="openModal('board_create')") Create a board
        .grow
          h1 News and updates
          .news-list
            contentBlock(v-for="(item, i) in newsList" :data="item" :key="i")

    modalCreateBoard(@success="onBoardCreate")
    modalEditBoard(@update="onBoardUpdate")
</template>

<script>
import newsList from '@/updates'
import vBoard from '@/components/board'
import contentBlock from '@/components/content-block'
import modalCreateBoard from '@/components/modals/board-create'
import modalEditBoard from '@/components/modals/board-edit'

export default {
  components: {
    vBoard,
    contentBlock,
    modalCreateBoard,
    modalEditBoard
  },
  data () {
    return {
      newsList,

      isLoading: false,
      boards: []
    }
  },
  created () {
    this.getBoards()
  },
  methods: {
    async getBoards () {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      const boards = await this.$store.dispatch('api/getBoards')
      this.boards = [...boards]
      this.isLoading = false
    },
    onBoardUpdate (data) {
      const target = this.boards.find(i => i._id === data._id)
      if (target) {
        target.merge(data)
      }
    },
    onBoardCreate (board) {
      this.boards.push(board)
    },
    onBoardRemove (board) {
      this.boards = this.boards.filter(i => i._id !== board._id)
    }
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
    .left {
      min-width: 250px;
    }
    h1 {
      display: block;
      margin-bottom: 16px;
    }
    .news-list {
      // width: 400px;
    }
    ::v-deep .news-list > * {
      &:not(:last-child) {
        margin-bottom: 16px;
      }
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
