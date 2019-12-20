<template lang="pug">
  .column-component(:data-id="column._id")
    .column-original.flex.column
      .header.flex.a-center.j-between.shrink
        div {{ column.title }}
        contextMenu
          a(href="#" @click.prevent) Rename
          a(href="#" @click.prevent="tryToRemoveColumn") Remove

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
          size="full"
          @click.prevent="toggleCardCreation") Add card
        addForm(
          v-else
          v-model="newCard.title"
          exception="add-button"
          placeholder="Enter a title for this card..."
          @submit="createCard"
          @close="closeCardCreation") Add card
</template>

<script>
import contextMenu from '@/components/context-menu'
import cardList from './card-list'
import addForm from '@/components/add-form'

export default {
  name: 'column-component',
  components: {
    contextMenu,
    cardList,
    addForm
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
      this.$store.dispatch('api/createCard', {
        title: this.newCard.title,
        column: this.column._id
      }).then(res => {
        const card = this.$models.create('card', res)
        this.column.cards.push(card)
        this.newCard.reset()
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
      background: $color-light;
      color: $color-text-regular;
      border-radius: $border-radius-default;
      box-shadow: $box-shadow-deep;
      cursor: default;
    }
    .header {
      font-weight: $font-weight-bold;
      padding: $padding $padding $padding 20px;
      cursor: pointer;
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
      padding: $padding;
      margin-top: -$padding;
      background: $color-light;
      border-radius: 0 0 $border-radius-default $border-radius-default;
    }
    .add-button {
      width: 100%;
    }

    &.sortable-ghost {
      .column-original {
        background: $color-bg;
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
  }
</style>
