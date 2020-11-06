<template lang="pug">
  .page.settings
    .wrapper.narrow
      section.account
        .h1 Account information
        setting-personal-information

      section.notifications
        .h1 Notification settings
        div (soon)
        // setting-push-notifications-new.setting-block(@change="onPushStatusChange")
        // setting-eye-care.setting-block(:disabled="!isPushActive")

      section
        div v1.3.1
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
