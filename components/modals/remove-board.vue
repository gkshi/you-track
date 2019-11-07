<template lang="pug">
  commonModal.remove-column-modal(id="remove_board")
    div(slot="title") Board deletion
    div Are you sure you want to delete this board?
    .buttons(slot="actions")
      commonButton(@click="$emit('submit')") Delete board
      commonButton(type="light" @click="closeModal('remove_board')") Cancel
</template>

<script>
export default {
  name: 'remove-column-modal',
  props: {
    id: String,
    data: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
  .remove-column-modal {
    //
  }
</style>
