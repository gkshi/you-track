<template lang="pug">
  #app
    v-header
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
    document.addEventListener('keyup', this.handleKeyup)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    handleKeyup (e) {
      if (e.which === 27) {
        this.$root.$emit('keyup', 'esc')
      }
    }
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
