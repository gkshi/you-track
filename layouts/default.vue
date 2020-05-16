<template lang="pug">
  #app
    vHeader
    main
      nuxt
</template>

<script>
import vHeader from '@/components/header'

export default {
  components: {
    vHeader
  }
}
</script>

<style lang="scss">
  #app {
    height: 100vh;
    main {
      margin-top: 64px;
    }
  }
</style>
