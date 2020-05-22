<template lang="pug">
  .column-component(:data-id="column._id" :class="{ 'column-empty': !column.cards.length }")
    .column-original.flex.column(ref="original")
      .header.flex.a-center.j-between.shrink
        editableArea.title.grow(
          ref="title"
          type="light"
          :value="column.title"
          @change="onColumnTitleChange")
        .drag-hint.flex.a-center
          iconDragPlace
          div Move
        contextMenu.menu
          a(href="#" @click.prevent="rename") Rename list
          a(href="#" @click.prevent="tryToRemoveColumn") Remove list

      .scroll-parent.grow(ref="scrollParent" :class="{ 'no-scroll': !scrollStatus }")
        cardList(
          :data="column.cards"
          :column="column._id"
          @order-update="onOrderUpdate"
          @add="onCardAdd"
          @remove="onCardRemove")

      columnFooter.shrink(:columnId="column._id" @create="onCardCreate" :margin="footerInteraction")
</template>

<script>
import contextMenu from '@/components/context-menu'
import editableArea from '@/components/editable-area'
import cardList from './card-list'
import iconDragPlace from '@/components/icons/drag-place'
import columnFooter from './footer'

export default {
  name: 'column-component',
  components: {
    contextMenu,
    editableArea,
    cardList,
    iconDragPlace,
    columnFooter
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // Column data
      column: this.$models.create('column', this.data),
      scrollStatus: true,
      footerInteraction: true
    }
  },
  watch: {
    data: {
      handler () {
        this.column.update(this.data)
      },
      deep: true
    }
  },
  created () {
    // this.column.cards = this.column.cards.map(i => this.$models.create('card', i))
  },
  mounted () {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    this.$root.$on('disableColumnScroll', this.disableScrollStatus)
    this.$root.$on('enableColumnScroll', this.enableScrollStatus)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize)
    this.$root.$off('disableColumnScroll')
    this.$root.$off('enableColumnScroll')
  },
  methods: {
    handleResize () {
      this.$nextTick(() => {
        this.footerInteraction = this.$refs.original.offsetHeight >= this.$el.offsetHeight
      })
    },
    disableScrollStatus () {
      this.scrollStatus = false
    },
    enableScrollStatus () {
      this.scrollStatus = true
    },
    scrollListToBottom () {
      this.$nextTick(() => {
        this.$refs.scrollParent.scrollTop = this.$refs.scrollParent.scrollHeight
      })
    },
    rename () {
      this.$refs.title.changeMode('edit')
    },
    onColumnTitleChange (title) {
      this.column.update({
        title
      })
      this.$store.dispatch('api/updateColumn', {
        id: this.column._id,
        data: { title }
      }).catch(error => {
        this.$store.dispatch('showMessage', {
          type: 'error',
          error
        })
      })
    },
    onOrderUpdate (order) {
      console.log('onOrderUpdate', order)
      console.log('this.column.cards', this.column.cards)
      this.column.order = order
      this.column.cards = this.column.cards.filter(i => this.column.order.includes(i._id))
    },
    onCardCreate (data) {
      // const card = this.$models.create('card', data)
      this.column.cards.push(data)
      this.$emit('update', data)
      this.scrollListToBottom()
    },
    onCardAdd (card) {
      console.log('onCardAdd')
      const ordered = []
      this.column.order.forEach(i => {
        if (card._id === i) {
          ordered.push(card)
        } else {
          ordered.push(this.column.cards.find(j => j._id === i))
        }
      })
      this.column.cards = ordered
    },
    onCardRemove (id) {
      this.column.cards = this.column.cards.filter(i => i._id !== id)
    },
    tryToRemoveColumn () {
      if (this.column.cards.length) {
        this.$emit('remove-request', this.column._id)
      } else {
        this.$emit('remove', this.column._id)
      }
    }
  }
}
</script>

<style lang="scss">
  body {
    &.drag-mode {
      .column-component {
        .cards {
          &::after {
            content: '';
            position: absolute;
            left: 0;
            z-index: 10;
            width: 100%;
            background: transparent;
          }
          &:not(.empty) {
            &::after {
              bottom: 0;
              height: 60px;
            }
          }
          &.empty {
            &:after {
              top: 0;
              height: 100%;
            }
          }
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  $padding: 10px;
  .column-component {
    height: 100%;
    .column-original {
      position: relative;
      max-height: 100%;
      // background: $color-light;
      color: $color-text-regular;
      border-radius: $border-radius-default;
      // box-shadow: $box-shadow-deep;
      cursor: default;
    }
    .header {
      font-weight: $font-weight-semibold;
      padding: 0 $padding 0 20px;
      color: $color-text-light;
      cursor: pointer;
      .menu {
        opacity: 0;
        visibility: hidden;
      }
      & > *:not(:last-child) {
        margin-right: 24px;
      }
    }
    .drag-hint {
      margin-bottom: 1px;
      font-weight: $font-weight-normal;
      font-size: $font-size-small;
      line-height: $line-height-small;
      opacity: 0;
      visibility: hidden;
      cursor: grab;
      transition: $transition-default;
      ::v-deep svg {
        margin-top: 1px;
      }
      & > *:not(:last-child) {
        margin-right: 4px;
      }
    }
    .title {
      padding: 12px 0;
      color: $color-text-regular;
    }
    .cards {
      overflow-x: hidden;
      padding: $padding $padding 0;
      .card {
        margin-bottom: 10px;
      }
    }

    &.sortable-ghost {
      padding-bottom: 30px;
      .column-original {
        border: 2px dashed rgba($color-text-light, .3);
        box-shadow: none;
        & > * {
          opacity: 0;
        }
      }
    }
    &.sortable-drag {
      transform: rotate(4deg);
    }

    .header:hover {
      .drag-hint {
        opacity: 1;
        visibility: visible;
      }
      .menu {
        opacity: 1;
        visibility: visible;
      }
    }
  }
</style>
