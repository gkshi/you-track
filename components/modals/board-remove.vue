<template lang="pug">
  common-modal.remove-board-modal(:id="id" size="narrow")
    .h2(slot="head") Warning!
    div All lists and cards in the board will be deleted.
    .buttons(slot="buttons")
      common-button(type="warning" @click="$emit('submit')") Delete
      common-button(type="light" @click="closeModal(id)") Cancel
</template>

<script>
export default {
  name: 'remove-board-modal',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      id: 'board_remove'
    }
  }
}
</script>

<style lang="scss" scoped>
  .remove-board-modal {
    //
  }
</style>
