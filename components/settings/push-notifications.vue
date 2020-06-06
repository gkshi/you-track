<template lang="pug">
  .push-notification-settings-component
    .h2 Push notifications
    div status: {{ status }}
</template>

<script>
export default {
  name: 'push-notification-settings-component',
  data () {
    return {
      status: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .push-notification-settings-component {
    //
  }
</style>
