<template lang="pug">
  commonModal.remove-board-modal(:id="id" size="narrow")
    span(slot="title") Warning!
    div All lists and cards in the board will be deleted.
    .buttons(slot="actions")
      commonButton(@click="$emit('submit')") Delete
      commonButton(type="light" @click="closeModal(id)") Cancel
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
