<template lang="pug">
  .column-component
    .column-original.flex.column
      .header.flex.a-center.j-between.shrink
        div {{ data.title }}
        contextMenu
          a(href="#" @click.prevent) Rename
          a(href="#" @click.prevent="removeColumn") Remove
      .scroll-parent.grow(ref="scrollParent")
        .cards(ref="cards")
          boardCard.card(
            v-for="card in data.cards"
            :data="card"
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
</template>

<script>
import { Sortable, AutoScroll } from 'sortablejs/modular/sortable.core.esm.js'
import contextMenu from '@/components/context-menu'
import boardCard from '@/components/card'
import addForm from '@/components/add-form'

Sortable.mount(new AutoScroll())

export default {
  name: 'column-component',
  components: {
    contextMenu,
    boardCard,
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
    removeColumn () {
      this.$store.dispatch('api/removeColumn', this.data._id).then(() => {
        this.$emit('remove', this.data._id)
      })
    }
  },
  mounted () {
    // Sortable init
    this.sortable = new Sortable(this.$refs.cards, {
      scroll: true,
      scrollSensitivity: 100,
      scrollSpeed: 12,
      bubbleScroll: true,
      forceFallback: true,
      fallbackTolerance: 10,
      animation: 150,
      group: 'cards',
      handle: '.card',
      onChoose: this.beforeDragStart
    })
  }
}
</script>

<style lang="scss" scoped>
  $padding: 10px;
  .column-component {
    height: 100%;
    .column-original {
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
      padding: $padding;
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
