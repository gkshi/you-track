<template lang="pug">
  .column-component
    .column-original.flex.column
      .header.flex.a-center.j-between.shrink
        div {{ data.title }}
        contextMenu
          a(href="#" @click.prevent) Rename
          a(href="#" @click.prevent="tryToRemoveColumn") Remove
      .scroll-parent.grow(ref="scrollParent")
        .cards(ref="cards" :class="{ empty: !data.cards.length }")
          boardCard.card(
            v-for="card in data.cards"
            :data="card"
            @remove="onCardRemove"
            :key="card._id")
      .footer.shrink
        commonButton.add-button(
          v-if="!cardCreationOpened"
          type="ghost"
          size="full"
          @click.prevent="toggleCardCreation") Add card
        addForm(
          v-else
          v-model="card.title"
          exception="add-button"
          placeholder="Enter a title for this card..."
          @submit="createCard"
          @close="closeCardCreation") Add card

    removeColumnModal(
      :id="`remove_column_${data._id}`"
      :data="data"
      @submit="removeColumn")
</template>

<script>
import { Sortable, AutoScroll } from 'sortablejs/modular/sortable.core.esm.js'
import contextMenu from '@/components/context-menu'
import boardCard from '@/components/card'
import addForm from '@/components/add-form'
import removeColumnModal from '@/components/modals/remove-column'

Sortable.mount(new AutoScroll())

export default {
  name: 'column-component',
  components: {
    contextMenu,
    boardCard,
    addForm,
    removeColumnModal
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    board: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      sortable: null,
      cardCreationOpened: false,
      card: {
        title: ''
      }
    }
  },
  watch: {
    cardCreationOpened () {
      this.card.title = ''
    }
  },
  methods: {
    toggleCardCreation () {
      this.cardCreationOpened = !this.cardCreationOpened
    },
    closeCardCreation () {
      this.cardCreationOpened = false
    },
    scrollColumn () {
      this.$nextTick(() => {
        this.$refs.scrollParent.scrollTop = this.$refs.scrollParent.scrollHeight
      })
    },
    beforeDragStart () {
      this.$root.$emit('keyup-esc')
    },
    createCard () {
      this.$store.dispatch('api/createCard', {
        column: this.data._id,
        data: {
          title: this.card.title
        }
      }).then(res => {
        this.data.cards.push(res)
        this.card.title = ''
        this.scrollColumn()
      })
    },
    moveCard (id, to) {
      console.log('moveCard', id, 'to', to)
      // const card = await this.$store.dispatch('api/moveCard', {
      //   id
      // })
    },
    async updateColumnOrder (order) {
      const column = await this.$store.dispatch('api/updateColumn', {
        id: this.data._id,
        data: { order }
      })
      this.$emit('update', column)
    },
    tryToRemoveColumn () {
      if (this.data.cards.length) {
        this.openModal(`remove_column_${this.data._id}`)
      } else {
        this.removeColumn()
      }
    },
    removeColumn () {
      this.$store.dispatch('api/removeColumn', {
        board: this.board,
        id: this.data._id
      }).then(() => {
        this.$emit('remove', this.data._id)
      })
    },
    onCardRemove (card) {
      this.data.cards = this.data.cards.filter(i => i._id !== card)
    },
    onDragStart () {
      document.body.classList.add('drag-mode')
    },
    onDragEnd () {
      document.body.classList.remove('drag-mode')
    }
  },
  mounted () {
    // Sortable init
    this.sortable = new Sortable(this.$refs.cards, {
      group: 'cards',
      store: {
        get: () => {
          // return []
          return this.data.cards
        },
        set: sortable => {
          const cardIds = this.data.cards.map(i => i._id)
          if (sortable.toArray().length !== cardIds.length) {
            // if card moved to other column
            // update card
            // update both columns order
            console.log('Moving between columns detected.')
            console.log('Need to update card.')
            console.log('Need to update both columns order.')
            this.moveCard()
            this.updateColumnOrder(sortable.toArray())
          } else if (JSON.stringify(sortable.toArray()) !== JSON.stringify(cardIds)) {
            // if order has changed, update column order
            console.log('Card order changing detected.')
            console.log('Need to update column order.')
            this.updateColumnOrder(sortable.toArray())
          }
        }
      },
      handle: '.card',
      direction: 'vertical',
      scroll: true,
      scrollSensitivity: 100,
      scrollSpeed: 12,
      bubbleScroll: true,
      forceFallback: true,
      fallbackTolerance: 10,
      animation: 150,
      onChoose: this.beforeDragStart,
      onStart: this.onDragStart,
      onEnd: this.onDragEnd
    })
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
            background: rgba(red, .1);
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
