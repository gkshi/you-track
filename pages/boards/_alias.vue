<template lang="pug">
  .page.board
    .scroll-parent(ref="scrollParent")
      draggable.columns.flex.a-start.grow(
        ref="columnParent"
        :list="board.columns"
        ghost-class="ghost-block"
        @start="onDragStart")
        boardColumn.column(
          v-for="column in board.columns"
          :data="column"
          :key="column._id"
          @remove="onColumnRemove")
        .column.shrink
          a.add-column-link.ghost-block(v-if="!columnCreationOpened" href="#" @click.prevent="toggleColumnCreation")
            span Add column
          addForm(
            v-else
            v-model="columnTitle"
            placeholder="Enter a title for this column..."
            exception="add-column-link"
            @submit="createColumn"
            @close="toggleColumnCreation") Add column

    cardModal
</template>

<script>
import draggable from 'vuedraggable'
import boardColumn from '@/components/column'
import cardModal from '@/components/modals/card'
import addForm from '@/components/add-form'

export default {
  name: 'board-page',
  components: {
    draggable,
    boardColumn,
    cardModal,
    addForm
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
    },
    openCard (id) {
      this.$store.dispatch('changeActiveCard', id)
      this.openModal('card')
    },
    onDragStart (e) {
      console.log('e', e)
      this.$root.$emit('keyup-esc')
    },
    watchColumnHeight () {
      this.$nextTick(() => {
        try {
          this.$refs.columnParent.$el.style.height = `${this.$refs.scrollParent.offsetHeight}px`
        } catch (e) {
          console.warn(e)
        }
      })
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
  mounted () {
    // column height watcher
    this.watchColumnHeight()
    window.addEventListener('resize', this.watchColumnHeight)

    // open card modal trigger
    if (this.$route.query.card) {
      this.openCard(this.$route.query.card)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.watchColumnHeight)
  }
}
</script>

<style lang="scss" scoped>
  .page.board {
    height: calc(100vh - 60px);
    .scroll-parent {
      height: 100%;
      padding: 0 40px;
    }
    .columns {
      max-height: 100%;
      .column {
        flex-shrink: 0;
        width: 300px;
        &:not(:last-child) {
          margin-right: 20px;
        }
      }
      &:after {
        content: '';
        display: flex;
        width: 40px;
        height: 100%;
        flex-shrink: 0;
      }
    }
    .add-column-link {
      display: block;
      padding: 10px 20px;
      color: $color-text-light;
      font-weight: $font-weight-semibold;
      border-radius: $border-radius-default;
      &:hover {
        color: $color-text-regular;
      }
    }
  }
</style>
