<template lang="pug">
  header.header-component
    .wrapper.flex
      nuxt-link(to="/") Home
      template(v-if="activeBoard")
        span &nbsp;>&nbsp;
        span {{ activeBoard }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'header-component',
  computed: {
    ...mapState({
      activeBoard: state => state.activeBoard
    })
  }
}
</script>

<style lang="scss" scoped>
  .header-component {
    background: $color-light;
    padding: 20px 0;
    margin-bottom: 20px;
  }
</style>
