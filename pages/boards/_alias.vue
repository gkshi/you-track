<template lang="pug">
  .page.board(:class="{ loading: isLoading }")
    .scroll-parent.flex.a-start(ref="scrollParent")
      .columns.flex.a-start.shrink(ref="columnParent")
        column-item.column(
          v-for="column in board.columns"
          :data="column"
          :key="column._id"
          @update="onColumnUpdate"
          @remove-request="requestColumnRemove"
          @remove="removeColumn")
      .column.non-draggable.shrink
        common-button.ghost-block(
          v-if="!columnCreationOpened"
          type="ghost"
          size="large"
          @click="toggleColumnCreation")
          span + Add another list
        add-form(
          v-else
          v-model="columnTitle"
          placeholder="Enter a title for new list..."
          exception="add-column-link"
          @submit="createColumn"
          @close="toggleColumnCreation") Add list

    modal-card(@update="onCardUpdate")
    modal-column-remove(:data="activeColumn" @submit="removeColumn")
</template>

<script>
import { mapState } from 'vuex'
import { Sortable, AutoScroll } from 'sortablejs/modular/sortable.core.esm.js'

Sortable.mount(new AutoScroll())

export default {
  async asyncData ({ route, store, error }) {
    // Убираем из хранилища активную доску
    store.dispatch('changeActiveBoard', {})
    const res = await store.dispatch('api/getBoard', route.params.alias).catch(() => null)
    if (!res) {
      return error({ statusCode: 404, message: 'Not found' })
    }
    return { response: res }
  },
  data () {
    return {
      response: {},
      // board: this.$models.create('board', this.response),
      board: {},

      // sortable
      sortable: null,

      // column creation
      columnCreationOpened: false,
      columnTitle: '',

      // column to remove
      activeColumn: this.$models.create('column')
    }
  },
  computed: {
    ...mapState({
      activeBoardInStore: state => state.activeBoard
    }),
    isLoading () {
      return !this.activeBoardInStore._id
    }
  },
  watch: {
    '$route.query' () {
      this.checkQuery()
    },
    columnCreationOpened () {
      this.columnTitle = ''
    }
  },
  created () {
    this.$store.dispatch('changeActiveBoard', this.response)
  },
  mounted () {
    this.board = this.$models.create('board', this.response)
    // this.board.update(this.response)
    this.initSortable()
    if (!this.board.columns.length) {
      this.toggleColumnCreation()
    }
    // Column height watcher
    this.watchColumnHeight()
    window.addEventListener('resize', this.watchColumnHeight)

    this.checkQuery()
  },
  beforeDestroy () {
    this.$store.dispatch('changeActiveBoard', {})
    window.removeEventListener('resize', this.watchColumnHeight)
  },
  methods: {
    checkQuery () {
      // Open card modal trigger
      if (this.$route.query.card) {
        // Timeout для фикса "прыжка" модалки из-за анимации перехода между страницами
        setTimeout(() => {
          this.openCard(this.$route.query.card)
        }, 300)
      }
    },
    scrollBoardToRight () {
      this.$nextTick(() => {
        this.$refs.scrollParent.scrollLeft = this.$refs.scrollParent.scrollWidth
      })
    },
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
        // const column = this.$models.create('column', res)
        this.board.columns.push(res)
        this.columnTitle = ''
        this.scrollBoardToRight()
      })
    },
    onColumnUpdate (column) {
      const target = this.board.columns.find(i => i._id === column._id)
      Object.assign(target, column)
    },
    requestColumnRemove (id) {
      this.activeColumn.update(this.board.columns.find(i => i._id === id))
      this.openModal('column_remove')
    },
    async removeColumn (id = this.activeColumn._id) {
      await this.$store.dispatch('api/removeColumn', id)
      this.board.columns = this.board.columns.filter(i => i._id !== id)
      // TODO: this.activeColumn.reset()
      this.activeColumn = this.$models.create('column')
      this.closeModal('column_remove')
    },
    async openCard (id) {
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
                _id: this.board._id,
                order: sortable.toArray()
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
    },
    onCardUpdate (card) {
      this.board.columns.every(column => {
        let found = false
        const target = column.cards.find(i => i._id === card._id)
        if (target) {
          target.description = card.description
          // TODO: вручную перебираем свойства объекта и заменяем в цели
          Object.keys(target).forEach(key => {
            if (card[key]) {
              target[key] = card[key]
            }
          })
        }
        found = !!target
        return !found
      })
    }
  },
  head () {
    return {
      title: `${this.board.title} board - YouTrack`
    }
  }
}
</script>

<style lang="scss" scoped>
  .page.board {
    margin-bottom: 0;
    height: calc(100vh - #{$header-height});
    .scroll-parent {
      position: relative;
      height: 100%;
      padding: 0 40px;
      user-select: none;
      overflow-y: hidden;
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

    &.loading {
      .scroll-parent {
        opacity: .5;
        pointer-events: none;
      }
    }
  }
</style>
