<template lang="pug">
  .messages-component
    div
      transition-group
        vMessage(v-for="message in messages" :data="message" :key="message.id")
</template>

<script>
import { mapState } from 'vuex'
import vMessage from './message'

export default {
  name: 'messages-component',
  components: {
    vMessage
  },
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
    max-height: calc(100vh - 100px);
    overflow: auto;
  }
</style>
