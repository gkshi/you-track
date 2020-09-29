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
          a(href="#" @click.prevent="enable") turn on
</template>

<script>
// import * as firebase from 'firebase/app'
// import 'firebase/auth'
import 'firebase/messaging'
import { mapState } from 'vuex'

export default {
  name: 'push-notification-settings-component',
  data () {
    return {
      isActive: false,
      isWorkerRegistered: false,
      isSubscribed: false,
      errorMessage: null,

      firebase: null,
      messaging: null
    }
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
    isAvailable () {
      return 'serviceWorker' in navigator && 'Notification' in window
    }
  },
  watch: {
    isSubscribed () {
      this.$emit('change', this.isSubscribed)
    }
  },
  mounted () {
    if (this.user.notifications) {
      this.enable()
    }
  },
  methods: {
    async enable () {
      await this.register()
      this.request()
    },
    register () {
      return new Promise((resolve, reject) => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        }).then(serviceWorkerRegistration => {
          this.isWorkerRegistered = true
          this.registration = serviceWorkerRegistration

          if (!this.user.notifications) {
            this.$store.dispatch('api/updateUser', {
              id: this.user._id,
              notifications: true
            })
          }

          resolve(this.registration)
        }).catch(e => {
          console.warn('[worker registration]', e)
          this.isWorkerRegistered = false
          reject(e)
        })
      })
    },
    unregister () {
      this.registration.unregister()
      this.$store.dispatch('api/updateUser', {
        _id: this.user._id,
        notifications: false
      })
      this.isSubscribed = false
    },
    request () {
      if (!this.isWorkerRegistered) {
        return
      }
      window.Notification.requestPermission()
        .then(() => {
          this.isSubscribed = true
        })
        .catch(() => {
          this.isSubscribed = false
        })
    },
    sendExample () {
      // const subscription = await this.pushManager.getSubscription()
      console.log('sendExample', this.registration)
      this.registration.pushManager.getSubscription().then(subscription => {
        console.log('subscription', subscription)
        this.$store.dispatch('push/sendExample', {
          subscription
        })
      }).catch(err => {
        console.warn('err', err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .push-notification-settings-component {
    //
  }
</style>
