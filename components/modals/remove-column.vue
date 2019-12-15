<template lang="pug">
  commonModal.remove-column-modal(:id="id")
    div(slot="title") Column deletion
    div Column {{ data.title }} includes one or more cards.
    div Are you sure you want to delete this column with all cards inside?
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
