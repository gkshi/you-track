<template lang="pug">
  .loader-component(v-if="localShow")
    div Loading...
</template>

<script>
export default {
  name: 'loader-component',
  props: {
    show: Boolean
  },
  data () {
    return {
      localShow: this.show
    }
  },
  watch: {
    show () {
      this.localShow = this.show
    }
  },
  created () {
    if (!this.$options.propsData.show) {
      this.localShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .loader-component {
    //
  }
</style>
