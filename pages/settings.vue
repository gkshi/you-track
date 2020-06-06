<template lang="pug">
  .page.settings
    .wrapper.narrow
      // section
        .h1 Account photo
        div content

      section
        .h1 Notification settings
        pushNotifications
</template>

<script>
import pushNotifications from '@/components/settings/push-notifications'

export default {
  components: {
    pushNotifications
  }
}
</script>

<style lang="scss" scoped>
  .page.settings {
    //
  }
</style>
