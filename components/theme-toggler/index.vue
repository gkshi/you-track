<template lang="pug">
  .theme-toggler-component.flex.a-center
    div
      iconSun
    div
      iconMoon
</template>

<script>
import iconSun from '@/components/icons/sun'
import iconMoon from '@/components/icons/moon'

export default {
  components: {
    iconSun,
    iconMoon
  }
}
</script>

<style lang="scss" scoped>
  .theme-toggler-component {
    //
  }
</style>
