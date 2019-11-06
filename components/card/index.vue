<template lang="pug">
  .card-component(@click="open")
    div {{ data.title }}
</template>

<script>
export default {
  name: 'card-component',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    open () {
      this.$store.dispatch('changeActiveCard', this.data._id)
      this.openModal('card')
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-component {
    padding: 10px 12px 20px;
    border-radius: $border-radius-default;
    background: $color-white;
    box-shadow: $box-shadow-light;
    transition: $transition-card;
    cursor: pointer;
    &:hover {
      background: darken($color-white, 1%);
      box-shadow: $box-shadow-light-hover;
    }
  }
</style>
