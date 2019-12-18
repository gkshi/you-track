<template lang="pug">
  .messages-component
    transition-group
      .message(v-for="message in messages" :key="message.id")
        div {{ message.type }}

        div(v-if="message.error")
          div {{ message.error }}

        div(v-if="message.content")
          div {{ message.content }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'messages-component',
  computed: {
    ...mapState({
      messages: state => state.messages
    })
  }
}
</script>

<style lang="scss" scoped>
  .messages-component {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 1000;
    .message {
      padding: 10px 20px;
      border-radius: $border-radius-default;
      background: $color-text-regular;
      color: $color-white;
      box-shadow: $box-shadow-light;
    }
  }
</style>
