<template lang="pug">
  .page.board
    .scroll-parent.flex.a-start(ref="scrollParent")
      .columns.flex.a-start.shrink(ref="columnParent")
        boardColumn.column(
          v-for="column in board.columns"
          :board="board"
          :data="column"
          :key="column._id"
          @remove="onColumnRemove")
      .column.non-draggable.shrink
        a.add-column-link.ghost-block(
          v-if="!columnCreationOpened"
          href="#"
          @click.prevent="toggleColumnCreation")
          span + Add column
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
import { Sortable, AutoScroll } from 'sortablejs/modular/sortable.core.esm.js'
import boardColumn from '@/components/column'
import cardModal from '@/components/modals/card'
import addForm from '@/components/add-form'

Sortable.mount(new AutoScroll())

export default {
  name: 'board-page',
  components: {
    boardColumn,
    cardModal,
    addForm
  },
  data () {
    return {
      board: {},

      // sortable
      sortable: null,

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
        board: this.board,
        data: {
          title: this.columnTitle
        }
      }).then(res => {
        console.log('res', res)
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
  created () {
    this.$store.dispatch('api/getBoard', this.$route.params.alias).then(res => {
      this.board = { ...this.board, ...res }
      this.$store.dispatch('changeActiveBoard', res.title)
    }).catch(err => {
      return this.$nuxt.error({ statusCode: 404, message: err.message })
    })
  },
  mounted () {
    // Sortable init
    this.sortable = new Sortable(this.$refs.columnParent, {
      scroll: true,
      scrollSensitivity: 300,
      scrollSpeed: 16,
      bubbleScroll: true,
      forceFallback: true,
      fallbackTolerance: 10,
      animation: 150,
      handle: '.column .header',
      filter: '.non-draggable',
      direction: 'horizontal',
      onChoose: this.beforeDragStart
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
    window.removeEventListener('resize', this.watchColumnHeight)
  }
}
</script>

<style lang="scss" scoped>
  .page.board {
    height: calc(100vh - 60px);
    user-select: none;
    .scroll-parent {
      height: 100%;
      padding: 0 40px;
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
    .add-column-link {
      display: block;
      padding: 12px 10px 12px 20px;
      border-radius: $border-radius-default;
      background: rgba($color-light, .5);
      color: $color-text-regular;
      box-shadow: $box-shadow-light;
      font-weight: $font-weight-semibold;
      transition: $transition-button;
      &:hover {
        text-decoration: none;
        background: $color-light;
        color: $color-text-regular;
      }
    }
  }
</style>
