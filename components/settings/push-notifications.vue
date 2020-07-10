<template lang="pug">
  .push-notification-settings-component
    .h2 Push notifications
    div status: {{ status }}
    div
      a(href="#" @click.prevent="trigger") trigger
    div
      a(href="#" @click.prevent="startcron") startcron
    div
      a(href="#" @click.prevent="stopcron") stopcron
</template>

<script>
export default {
  name: 'push-notification-settings-component',
  data () {
    return {
      status: false
    }
  },
  methods: {
    async startcron () {
      const id = 'eyecare'
      const register = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.PUBLIC_VAPID_KEY)
      })
      await fetch('/api/startcron', {
        method: 'POST',
        body: JSON.stringify({
          id,
          subscription
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    async stopcron () {
      const id = 'eyecare'
      await fetch('/api/stopcron', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    urlBase64ToUint8Array (base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4)
      const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/')

      const rawData = window.atob(base64)
      const outputArray = new Uint8Array(rawData.length)

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
      }
      return outputArray
    },
    async trigger () {
      if ('serviceWorker' in navigator) {
        const register = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(process.env.PUBLIC_VAPID_KEY)
        })

        await fetch('/api/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } else {
        console.error('Service workers are not supported in this browser')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .push-notification-settings-component {
    //
  }
</style>
