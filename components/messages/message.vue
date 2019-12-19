<template lang="pug">
  .message-component(@click="close")
    div
      div(v-if="data.error")
        div {{ data.error }}

      div(v-if="data.content")
        div {{ data.content }}

    .actions(v-if="showActions")
      commonButton(size="small" @click="reload") Reload page
</template>

<script>
export default {
  name: 'message-component',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    showActions () {
      return this.data.type === 'error'
    }
  },
  methods: {
    close () {
      if (this.showActions) {
        return
      }
      this.$store.dispatch('hideMessage', this.data.id)
    },
    reload () {
      window.location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
  .message-component {
    padding: 12px 20px 20px;
    border-radius: $border-radius-default;
    background: $color-text-regular;
    color: $color-white;
    box-shadow: $box-shadow-light;
    transition: $transition-message;
    cursor: pointer;
    &:not(:last-child) {
      margin-bottom: 10px;
    }

    .actions {
      margin-top: 10px;
    }

    &.v-enter,
    &.v-leave-active {
      opacity: 0;
      transform: translate(0, -4px) scale(.95);
    }
  }
</style>
