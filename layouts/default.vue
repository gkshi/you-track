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
  }
}
</script>

<style lang="scss" scoped>
  .layout {
    height: 100vh;
  }
</style>
