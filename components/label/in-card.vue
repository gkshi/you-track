<template lang="pug">
  .label-in-card-component(:style="`background-color: ${data.color}`")
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
  .label-in-card-component {
    width: 32px;
    height: 7px;
    border-radius: 7px;
  }
</style>
