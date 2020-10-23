<template lang="pug">
  .label-component.flex.center(
    :style="`background-color: ${data.color}`"
    @click="$emit('click', $event)")
    div {{ data.color }}
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
    min-width: 80px;
    height: 32px;
    background: rgba($color-text-regular, .2);
    border-radius: $border-radius-small;
    font-size: $font-size-label;
    line-height: $line-height-label;
    font-weight: $font-weight-semibold;
    color: $color-text-white;
    cursor: pointer;
    transition: $transition-label;

    &:hover {
      background: rgba($color-text-regular, .25);
    }
  }
</style>
