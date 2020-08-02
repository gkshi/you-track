<template lang="pug">
  .page.settings
    .wrapper.narrow
      section
        .h1 Account information
        div
          div name
          div photo

      section.notifications
        .h1 Notification settings
        settings-push-notifications.setting-block(@change="onPushStatusChange")
        // settings-eye-care.setting-block(:disabled="!isPushActive")
</template>

<script>
export default {
  data () {
    return {
      isPushActive: false
    }
  },
  methods: {
    onPushStatusChange (state = false) {
      this.isPushActive = state
    }
  }
}
</script>

<style lang="scss" scoped>
  .page.settings {
    section {
      margin-bottom: 48px;
    }

    .h1 {
      display: block;
      margin-bottom: 16px;
    }

    .setting-block {
      margin-bottom: 16px;
    }
  }
</style>
