<template lang="pug">
  .label-bar-component
    div card labels:
    div
      div(v-for="")

    br

    div all board labels:
    div
      div(v-for="label in board.labels" :key="label._id") {{ label.title }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'label-bar',
  props: {
    board: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapState({
      // boardLabels: state
    })
  }
}
</script>

<style lang="scss" scoped>
  .label-bar-component {
    //
  }
</style>
