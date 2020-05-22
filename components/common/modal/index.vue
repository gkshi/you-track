<template lang="pug">
  transition(name="modal")
    .modal-component(v-if="show" :class="`modal-size-${size}`" @click.self="close")
      dialog(:open="show")
        .close.flex.center(@click="close")
          iconCross

        .title.h2(v-if="$slots.title")
          slot(name="title")

        .content
          slot Modal default content

        .actions(v-if="$slots.actions")
          slot(name="actions")
</template>

<script>
import { mapState } from 'vuex'
import iconCross from '@/components/icons/cross'

export default {
  name: 'modal-component',
  components: {
    iconCross
  },
  props: {
    id: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'default'
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
    //
  }
</style>
