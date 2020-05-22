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
  },
  mounted () {
    document.addEventListener('keyup', e => {
      if (e.which === 27) {
        this.$root.$emit('keyup', 'esc')
      }
    })
  }
}
</script>

<style lang="scss">
  #app {
    height: 100vh;
    main {
      height: 100%;
      padding-top: $header-height;
    }
  }
</style>
