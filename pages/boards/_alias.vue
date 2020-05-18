<template lang="pug">
  .page.board
    .scroll-parent.flex.a-start(ref="scrollParent")
      .columns.flex.a-start.shrink(ref="columnParent")
        boardColumn.column(
          v-for="column in board.columns"
          :data="column"
          :key="column._id"
          @update="onColumnUpdate"
          @remove-request="onColumnRemoveRequest"
          @remove="onColumnRemove")
      .column.non-draggable.shrink
        commonButton.ghost-block(
          v-if="!columnCreationOpened"
          type="ghost"
          size="large"
          @click="toggleColumnCreation")
          span + Add another list
        addForm(
          v-else
          v-model="columnTitle"
          placeholder="Enter a title for new column..."
          exception="add-column-link"
          @submit="createColumn"
          @close="toggleColumnCreation") Add column

    cardModal
    columnRemoveModal(:data="activeColumn" @submit="onColumnRemove")
</template>

<script>
import { Sortable, AutoScroll } from 'sortablejs/modular/sortable.core.esm.js'
import boardColumn from '@/components/column'
import cardModal from '@/components/modals/card'
import columnRemoveModal from '@/components/modals/remove-column'
import addForm from '@/components/add-form'

Sortable.mount(new AutoScroll())

export default {
  components: {
    boardColumn,
    cardModal,
    columnRemoveModal,
    addForm
  },
  head () {
    return {
      title: `${this.board.title} board - YouTrack`
    }
  },
  data () {
    return {
      board: this.$models.create('board'),
      // sortable
      sortable: null,
      // column creation
      columnCreationOpened: false,
      columnTitle: '',
      // column to remove
      activeColumn: this.$models.create('column')
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
        board: this.board._id,
        data: {
          title: this.columnTitle
        }
      }).then(res => {
        const column = this.$models.create('column', res)
        this.board.columns.push(column)
        this.columnTitle = ''
      })
    },
    onColumnUpdate (column) {
      const target = this.board.columns.find(i => i._id === column._id)
      target.update(column)
    },
    onColumnRemoveRequest (id) {
      this.activeColumn.update(this.board.columns.find(i => i._id === id))
      this.openModal('column_remove')
    },
    async onColumnRemove (id = this.activeColumn._id) {
      await this.$store.dispatch('api/removeColumn', id)
      this.board.columns = this.board.columns.filter(i => i._id !== id)
      this.activeColumn.reset()
      this.closeModal('column_remove')
    },
    async openCard (id) {
      // const card = await this.$store.dispatch('api/getCard', id).catch(() => ({}))
      await this.$store.dispatch('changeActiveCard', id)
      if (this.$store.state.activeCard._id) {
        this.openModal('card')
      }
    },
    initSortable () {
      this.sortable = new Sortable(this.$refs.columnParent, {
        group: 'columns',
        store: {
          get: () => {
            return this.board.order
          },
          set: sortable => {
            // if order has changed, update board order
            if (JSON.stringify(sortable.toArray()) !== JSON.stringify(this.board.order)) {
              this.$store.dispatch('api/updateBoard', {
                board: this.board._id,
                data: {
                  order: sortable.toArray()
                }
              }).then(board => {
                this.board.order = board.order
              })
            }
          }
        },
        scroll: true,
        scrollSensitivity: 300,
        scrollSpeed: 16,
        bubbleScroll: true,
        forceFallback: true,
        fallbackTolerance: 10,
        animation: 150,
        handle: '.column .header',
        filter: '.non-draggable',
        preventOnFilter: false,
        direction: 'horizontal',
        onChoose: this.beforeDragStart
      })
    },
    beforeDragStart () {
      this.$root.$emit('keyup-esc')
    },
    watchColumnHeight () {
      this.$nextTick(() => {
        try {
          this.$refs.columnParent.style.height = `${this.$refs.scrollParent.offsetHeight}px`
        } catch (e) {
          console.warn(e)
        }
      })
    }
  },
  mounted () {
    this.$store.dispatch('api/getBoard', this.$route.params.alias).then(res => {
      this.board.update(res)
      // this.board.columns = this.board.columns.map(i => this.$models.create('column', i))
      this.$store.dispatch('changeActiveBoard', this.board.title)
      this.initSortable()
      if (!this.board.columns.length) {
        this.toggleColumnCreation()
      }
    }).catch(err => {
      return this.$nuxt.error({ statusCode: 404, message: err.message })
    })

    // Column height watcher
    this.watchColumnHeight()
    window.addEventListener('resize', this.watchColumnHeight)

    // Open card modal trigger
    if (this.$route.query.card) {
      this.openCard(this.$route.query.card)
    }
  },
  beforeDestroy () {
    this.$store.dispatch('changeActiveBoard', null)
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
      user-select: none;
      & > .column {
        &:last-child {
          width: 340px;
          padding-right: 40px;
        }
      }
    }
    .columns {
      max-height: 100%;
      .column {
        flex-shrink: 0;
        width: 300px;
        margin-right: 20px;
      }
    }
    ::v-deep .column.non-draggable {
       & > .button-component {
        width: 100%;
      }
    }
  }
</style>
