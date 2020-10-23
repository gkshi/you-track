<template lang="pug">
  .label-bar-component.flex.a-center
    label-item(
      v-for="label in data"
      :data="label"
      :key="label._id")
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
  .label-bar-component {
    & > * {
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
</style>
