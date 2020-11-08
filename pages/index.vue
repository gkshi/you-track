<template lang="pug">
  .page.index
    .wrapper.narrow
      .columns.flex.a-start.j-center
        .left
          h1 Personal Boards

          template(v-if="isLoading")
            common-loader(:show="isLoading")

          template(v-else)
            .boards
              board-item(
                v-for="board in boards"
                :data="board"
                :key="board._id"
                @update="onBoardUpdate"
                @remove="onBoardRequestRemoving(board._id)")
            .no-boards(v-if="!boards.length") No created boards yet.
            div
              common-button(@click="openModal('board_create')") Create a board

        .grow
          h1 News and updates
          .news-list
            content-block(v-for="(item, i) in newsList" :data="item" :key="i")

    modal-board-create(@success="onBoardCreate")
    modal-board-edit(@update="onBoardUpdate")
    modal-board-remove(@submit="removeBoard")
</template>

<script>
import newsList from '@/updates'

export default {
  data () {
    return {
      newsList,

      isLoading: false,
      boards: [],
      activeBoard: null
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
    async removeBoard () {
      const res = await this.$store.dispatch('api/removeBoard', this.activeBoard)
      if (res) {
        this.closeModal('board_remove')
        this.onBoardRemove()
      }
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
    onBoardRequestRemoving (id) {
      this.activeBoard = id
    },
    onBoardRemove () {
      this.boards = this.boards.filter(i => i._id !== this.activeBoard)
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

    .no-boards {
      margin-bottom: 16px;
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
