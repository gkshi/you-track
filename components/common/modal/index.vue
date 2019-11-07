<template lang="pug">
  transition(name="modal")
    .modal-component(v-if="show" @click.self="close")
      dialog(:open="show")
        .close(@click="close")
          div X

        .h2(v-if="$slots.title")
          slot(name="title")

        .content
          slot Modal default content

        .actions(v-if="$slots.actions")
          slot(name="actions")
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'modal-component',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState({
      modals: state => state.modals
    }),
    show () {
      return this.modals.includes(this.id)
    }
  },
  watch: {
    show () {
      this.show
        ? this.$emit('open')
        : this.$emit('close')
    }
  },
  methods: {
    close () {
      this.$store.dispatch('closeModal', this.id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .modal-component {
    background: rgba(40, 50, 60, 0.62);
    dialog {
      border-radius: $border-radius-default;
      box-shadow: $box-shadow-deep;
      user-select: text;
    }
  }
</style>
