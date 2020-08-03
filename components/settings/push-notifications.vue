<template lang="pug">
  .push-notification-settings-component
    .h2 Push notifications
    div is available: {{ isAvailable }}

    template(v-if="isAvailable")
      div worker registered: {{ isWorkerRegistered }}
      div is subscribed: {{ isSubscribed }}

      // error message
      div(v-if="errorMessage") {{ errorMessage }}

      template(v-if="isSubscribed")
        div
          a(href="#" @click.prevent="sendExample") send example push
        div
          a(href="#" @click.prevent="unregister") turn off
      template(v-else)
        div
          a(href="#" @click.prevent="subscribe") turn on
</template>

<script>
import { mapState } from 'vuex'
import { urlBase64ToUint8Array } from '@/plugins/push-helpers'

export default {
  name: 'push-notification-settings-component',
  data () {
    return {
      isActive: false,
      isWorkerRegistered: false,
      isSubscribed: false,
      errorMessage: null,

      pushManager: null
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
    isAvailable () {
      return 'serviceWorker' in navigator
    }
  },
  watch: {
    isSubscribed () {
      this.$emit('change', this.isSubscribed)
    }
  },
  mounted () {
    this.check()
  },
  methods: {
    async sendExample () {
      const subscription = await this.pushManager.getSubscription()
      // console.log('subscription', subscription)
      this.$store.dispatch('push/sendExample', {
        subscription
      })
    },
    async check () {
      const serviceWorkerRegistration = await this.register()
      console.log('serviceWorkerRegistration', serviceWorkerRegistration)
      this.pushManager = serviceWorkerRegistration.pushManager
      // console.log('this.pushManager', this.pushManager)
      const subscription = await this.pushManager.getSubscription()
      // console.log('subscription', subscription)
      if (subscription) {
        this.isSubscribed = true
      } else if (this.user.notifications) {
        this.subscribe()
      }
    },
    register () {
      return navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      }).then(serviceWorkerRegistration => {
        this.isWorkerRegistered = true
        return serviceWorkerRegistration
      }).catch(e => {
        console.warn('[worker registration]', e)
        this.isWorkerRegistered = false
        return null
      })
    },
    subscribe () {
      if (!this.pushManager) {
        this.isSubscribed = false
        return null
      }
      this.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.PUBLIC_VAPID_KEY)
      }).then(pushSubscription => {
        this.isSubscribed = true
        this.$store.dispatch('api/updateUser', {
          id: this.user._id,
          notifications: true
        })
        return pushSubscription
      }).catch(error => {
        console.warn('[worker subscription]', error)
        this.isSubscribed = false
        this.errorMessage = error
        return null
      })
    },
    async unregister () {
      const serviceWorkerRegistration = await this.register()
      serviceWorkerRegistration.unregister()
      this.$store.dispatch('api/updateUser', {
        _id: this.user._id,
        notifications: false
      })
      this.isSubscribed = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .push-notification-settings-component {
    //
  }
</style>
