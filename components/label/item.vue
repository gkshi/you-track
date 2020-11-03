<template lang="pug">
  .label-component.flex.center(
    :style="`background-color: ${data.color}`"
    @click="$emit('click', $event)")
    div {{ data.title }}
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
  .label-component {
    @extend %label;
    min-width: 80px;
    height: 32px;
    padding: 0 10px;
    background: rgba($color-text-regular, .2);
    border-radius: $border-radius-label;

    &:hover {
      background: rgba($color-text-regular, .25);
    }
  }
</style>
