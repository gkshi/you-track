<template lang="pug">
  .personal-information-setting-component
    div
      common-input(type="white" v-model="name")
</template>

<script>
export default {
  name: 'personal-information-setting-component',
  data () {
    return {
      name: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .personal-information-setting-component {
    //
  }
</style>
