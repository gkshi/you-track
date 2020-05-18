<template lang="pug">
  .column-component(:data-id="column._id" :class="{ 'column-empty': !column.cards.length }")
    .column-original.flex.column
      .header.flex.a-center.j-between.shrink
        editableArea.title.grow(ref="title" :value="column.title" @change="onColumnTitleChange")
        .drag-hint.flex.a-center
          iconDragPlace
          div Move
        contextMenu.menu
          a(href="#" @click.prevent="rename") Rename list
          a(href="#" @click.prevent="tryToRemoveColumn") Remove list

      .scroll-parent.grow(ref="scrollParent")
        cardList(
          :data="column.cards"
          :column="column._id"
          @order-update="onOrderUpdate"
          @add="onCardAdd"
          @remove="onCardRemove")

      .footer.shrink
        commonButton.add-button(
          v-if="!cardCreationOpened"
          type="ghost"
          size="large"
          @click.prevent="toggleCardCreation") + Add card
        addForm(
          v-else
          v-model="newCard.title"
          exception="add-button"
          placeholder="Enter a title for new card..."
          @submit="createCard"
          @close="closeCardCreation") Add card
</template>

<script>
import contextMenu from '@/components/context-menu'
import editableArea from '@/components/editable-area'
import cardList from './card-list'
import addForm from '@/components/add-form'
import iconDragPlace from '@/components/icons/drag-place'

export default {
  name: 'column-component',
  components: {
    contextMenu,
    editableArea,
    cardList,
    addForm,
    iconDragPlace
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // Component local data
      cardCreationOpened: false,

      // Column data
      column: this.$models.create('column', this.data),

      // Data for card creation
      newCard: this.$models.create('card')
    }
  },
  methods: {
    toggleCardCreation () {
      this.cardCreationOpened = !this.cardCreationOpened
    },
    closeCardCreation () {
      this.cardCreationOpened = false
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
      this.column.order = order
      this.column.cards = this.column.cards.filter(i => this.column.order.includes(i._id))
    },
    onCardAdd (card) {
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
    createCard () {
      this.newCard.column = this.column._id
      this.$store.dispatch('api/createCard', this.newCard).then(res => {
        const card = this.$models.create('card', res)
        this.column.cards.push(card)
        // TODO: вернуть метод reset() после фикса пакета nuxt-nodels
        // this.newCard.reset()
        this.newCard.title = ''
        this.scrollListToBottom()
      })
    },
    tryToRemoveColumn () {
      if (this.column.cards.length) {
        this.$emit('remove-request', this.column._id)
      } else {
        this.$emit('remove', this.column._id)
      }
    }
  },
  created () {
    this.column.cards = this.column.cards.map(i => this.$models.create('card', i))
  }
}
</script>

<style lang="scss">
  body {
    &.drag-mode {
      .column-component {
        .cards.empty {
          &:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            width: 100%;
            height: 100%;
            background: transparent;
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
        margin-right: 8px;
      }
    }
    .drag-hint {
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
    .footer {
      position: relative;
      padding: 0 $padding $padding;
      margin-top: -$padding;
    }
    .add-button {
      width: 100%;
    }

    &.sortable-ghost {
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
