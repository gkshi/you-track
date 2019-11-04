<template lang="pug">
  .layout.flex.column
    vHeader
    main.grow
      nuxt
</template>

<script>
import vHeader from '@/components/header'

export default {
  components: {
    vHeader
  },
  methods: {
    watchKeypress (evt) {
      evt = evt || window.event
      let isEscape = false
      if ('key' in evt) {
        isEscape = (evt.key === 'Escape' || evt.key === 'Esc')
      } else {
        isEscape = (evt.keyCode === 27)
      }
      if (isEscape) {
        this.$root.$emit('keyup', 'esc')
      }
    }
  },
  mounted () {
    document.addEventListener('keyup', this.watchKeypress)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.watchKeypress)
  }
}
</script>

<style lang="scss" scoped>
  .layout {
    height: 100vh;
  }
</style>
