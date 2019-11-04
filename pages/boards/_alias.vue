<template lang="pug">
  .page.board
    .wrapper.flex.column
      .scroll-parent
        .columns.flex.grow
          boardColumn.column(
            v-for="column in board.columns"
            :data="column"
            :key="column._id"
            @remove="onColumnRemove")
          .column
            a(v-if="!columnCreationOpened" href="#" @click.prevent="toggleColumnCreation") +add column
            div(v-else)
              commonInput(v-model="columnTitle" placeholder="Column title")
              .buttons
                commonButton(@click="createColumn" :disabled="!columnTitle") Add
                commonButton(type="light" @click="toggleColumnCreation") Cancel
</template>

<script>
import boardColumn from '@/components/column'

export default {
  name: 'board-page',
  components: {
    boardColumn
  },
  data () {
    return {
      board: {
        columns: []
      },

      // column creation
      columnCreationOpened: false,
      columnTitle: ''
    }
  },
  watch: {
    columnCreationOpened () {
      this.columnTitle = ''
    }
  },
  methods: {
    toggleColumnCreation () {
      this.columnCreationOpened = !this.columnCreationOpened
    },
    createColumn () {
      this.$store.dispatch('api/createColumn', {
        board: this.$route.params.alias,
        data: {
          title: this.columnTitle
        }
      }).then(res => {
        this.board.columns.push(res)
        this.toggleColumnCreation()
      })
    },
    onColumnRemove (id) {
      this.board.columns = this.board.columns.filter(i => i._id !== id)
    }
  },
  created () {
    this.$store.dispatch('api/getBoard', this.$route.params.alias).then(res => {
      this.board = { ...this.board, ...res }
      this.$store.dispatch('changeActiveBoard', res.title)
    }).catch(err => {
      return this.$nuxt.error({ statusCode: 404, message: err.message })
    })
  },
  beforeDestroy () {
    this.$store.dispatch('changeActiveBoard', null)
  }
}
</script>

<style lang="scss" scoped>
  .page.board {
    height: 100%;
    .wrapper {
      height: 100%;
    }
    .scroll-parent {
      height: 100%;
    }
    .columns {
      height: 100%;
      .column {
        flex-shrink: 0;
        width: 300px;
        &:not(:last-child) {
          margin-right: 20px;
        }
      }
    }
  }
</style>
