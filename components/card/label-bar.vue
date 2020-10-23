<template lang="pug">
  .card-label-bar-component.inline-flex.column
    .flex.a-center(@click="toggle")
      label-bar(:data="cardLabels")
      common-button.plus(type="light" size="icon")
        icon-plus

    transition
      .dropdown(v-if="isOpened" v-outside="close")
        div all board labels:
        label-feature(
          v-for="label in board.labels"
          :data="label"
          :selected="card.labels.includes(label._id)"
          :key="label._id"
          @click="toggleLabel(label._id)")
</template>

<script>
export default {
  props: {
    board: {
      type: Object,
      default: () => ({})
    },
    card: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isOpened: false
    }
  },
  computed: {
    cardLabels () {
      const labels = []
      this.card.labels.forEach(id => {
        const label = this.board.labels.find(i => i._id === id)
        labels.push(this.$models.create('label', label))
      })
      return labels
    }
  },
  methods: {
    toggle () {
      this.isOpened = !this.isOpened
    },
    close () {
      this.isOpened = false
    },
    toggleLabel (id) {
      this.$store.dispatch('api/toggleLabel', {
        label: id,
        card: this.card._id
      })

      if (this.card.labels.includes(id)) {
        this.card.labels = this.card.labels.filter(i => i !== id)
      } else {
        const label = this.board.labels.find(i => i._id === id)
        this.card.labels = [...this.card.labels, label._id]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-label-bar-component {
    position: relative;

    .dropdown {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 10;
      transform: translate(0, 100%);
      background: $color-white;
      padding: 10px;
      border-radius: $border-radius-default;
    }

    .plus {
      margin-left: 10px;
    }
  }
</style>
