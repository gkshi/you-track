<template lang="pug">
  .label-in-card-component.flex.center(:class="{ compact }" :style="`background-color: ${data.color}`")
    div(v-show="!compact") {{ data.title }}
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    compact: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .label-in-card-component {
    @extend %label;
    border-radius: $border-radius-label;

    &:not(.compact) {
      min-width: 64px;
      height: 17px;
      padding: 0 7px 2px;
    }

    &.compact {
      width: 32px;
      height: 7px;
      border-radius: 7px;
    }
  }
</style>
