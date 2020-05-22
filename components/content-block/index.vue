<template lang="pug">
  .content-block-component
    .title {{ data.title }}
    div
      pre {{ data.content }}
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
  .content-block-component {
    @extend %content-block;
    &:hover {
      box-shadow: $box-shadow-default;
    }
  }
</style>
