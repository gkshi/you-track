<template lang="pug">
  common-modal.remove-column-modal(:id="id" size="narrow")
    .h2(slot="title") Warning!
    div All cards in the list will be deleted.
    .buttons(slot="buttons")
      common-button(@click="$emit('submit')") Delete
      common-button(type="light" @click="closeModal(id)") Cancel
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
