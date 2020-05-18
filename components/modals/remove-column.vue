<template lang="pug">
  commonModal.remove-column-modal(:id="id" size="narrow")
    div(slot="title") Column deletion
    div Warning: all cards in the column will be deleted.
    .buttons(slot="actions")
      commonButton(@click="$emit('submit')") Delete
      commonButton(type="light" @click="closeModal(id)") Cancel
</template>

<script>
export default {
  name: 'remove-column-modal',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      id: 'column_remove'
    }
  }
}
</script>

<style lang="scss" scoped>
  .remove-column-modal {
    //
  }
</style>
