<template lang="pug">
  .card-list-component
    .cards(ref="cards" :class="{ empty: !data.length }")
      card-item.card(
        v-for="card in data"
        :data="card"
        :key="card._id"
        @remove="$emit('remove', card._id)")
</template>

<script>
import { Sortable, AutoScroll } from 'sortablejs/modular/sortable.core.esm.js'

Sortable.mount(new AutoScroll())

export default {
  name: 'card-list-component',
  props: {
    // Card list
    data: {
      type: Array,
      default: () => []
    },
    // Parent column id
    column: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      sortable: null,
      lastCardAdded: null
    }
  },
  mounted () {
    // Sortable init
    this.sortable = new Sortable(this.$refs.cards, {
      group: 'cards',
      store: {
        get: () => {
          return this.data
        },
        set: sortable => {
          const cardIds = this.data.map(i => i._id)
          // if card added to column from another column
          if (sortable.toArray().length > cardIds.length) {
            this.$emit('order-update', sortable.toArray())
            this.moveCard(sortable.toArray())
          }
          // if card removed from column to another column
          if (sortable.toArray().length < cardIds.length) {
            this.$emit('order-update', sortable.toArray())
          }
          // if card order has changed, update column order
          if (sortable.toArray().length === cardIds.length && JSON.stringify(sortable.toArray()) !== JSON.stringify(cardIds)) {
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
      onEnd: this.onDragEnd,
      onAdd: this.onDragAdd
    })
  },
  methods: {
    beforeDragStart () {
      this.$root.$emit('keyup-esc')
    },
    onDragStart () {
      document.body.classList.add('drag-mode')
    },
    onDragEnd () {
      document.body.classList.remove('drag-mode')
    },
    onDragAdd (e) {
      this.lastCardAdded = e.item
    },
    moveCard (order) {
      this.$emit('add', this.lastCardAdded.__vue__.data)
      this.$store.dispatch('api/moveCard', {
        card: this.lastCardAdded.dataset.id,
        column: {
          id: this.column,
          order
        }
      })
    },
    async updateColumnOrder (order) {
      this.$emit('order-update', order)
      await this.$store.dispatch('api/updateColumn', {
        id: this.column,
        data: {
          order
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-list-component {
    .cards {
      overflow-x: hidden;
      padding: 10px;
      .card {
        margin-bottom: 10px;
      }
    }
  }
</style>
