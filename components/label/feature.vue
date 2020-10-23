<template lang="pug">
  .label-feature-component.flex.a-center(
    :style="`background-color: ${data.color}`"
    @click="$emit('click', $event)")
    div
      input(type="checkbox" :checked="selected")
    div {{ data.color }}
      // input(:value="data.title" @change="onChange" placeholder="Label name")
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    selected: Boolean
  },
  methods: {
    onChange (e) {
      console.log('onChange', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .label-feature-component {
    min-width: 80px;
    height: 32px;
    background: rgba($color-text-regular, .2);
    border-radius: $border-radius-small;
    cursor: pointer;
    transition: $transition-label;

    &:hover {
      background: rgba($color-text-regular, .25);
    }
  }
</style>
