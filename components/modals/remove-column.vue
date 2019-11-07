<template lang="pug">
  commonModal.remove-column-modal(:id="id")
    div(slot="title") Column deletion
    div The column contains one or more cards inside.
    div Are you sure you want to delete this column?
    .buttons(slot="actions")
      commonButton(@click="$emit('submit')") Delete
      commonButton(type="light" @click="closeModal(id)") Cancel
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
