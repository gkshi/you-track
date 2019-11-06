<template lang="pug">
  commonModal.card-modal(id="card" @close="onClose")
    div card modal
    div {{ activeCard.title }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'card-modal',
  computed: {
    ...mapState({
      activeCard: state => state.activeCard
    })
  },
  methods: {
    onClose () {
      this.$store.dispatch('changeActiveCard', null)
    }
  },
  beforeDestroy () {
    this.onClose()
  }
}
</script>

<style lang="scss" scoped>
  .card-modal {
    //
  }
</style>
