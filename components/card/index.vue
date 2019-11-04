<template lang="pug">
  .task-component
    div {{ data.title }}
</template>

<script>
export default {
  name: 'task-component',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .task-component {
    padding: 10px 12px 20px;
    border-radius: $border-radius-default;
    background: $color-white;
    box-shadow: $box-shadow-light;
    transition: $transition-card;
    cursor: pointer;
    &:hover {
      background: darken($color-white, 1%);
      box-shadow: $box-shadow-light-hover;
    }
  }
</style>
