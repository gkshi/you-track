<template lang="pug">
  .label-feature-component.flex.a-center(:style="`background-color: ${data.color}`")
    .intro.flex.a-center(@click="$emit('click', $event)")
      // select
      div
        common-checkbox(type="simple" :checked="selected")
        // input(type="checkbox" :checked="selected")

      // title
      .title {{ data.title }}

    // edit button
    .actions
      common-button.edit(type="icon" size="icon" @click="$emit('edit')")
        icon-edit
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    selected: Boolean
  }
}
</script>

<style lang="scss" scoped>
  .label-feature-component {
    position: relative;
    min-width: 80px;
    height: 32px;
    background: rgba($color-text-regular, .2);
    border-radius: $border-radius-small;
    cursor: pointer;
    transition: $transition-label;

    .intro {
      @extend %label;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      padding: 0 6px;
    }

    .title {
      margin-left: 8px;
    }

    .actions {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      z-index: 2;
    }

    .edit {
      ::v-deep [class*="common-button"] {
        &:hover {
          background: rgba($color-dark, .1);
        }
      }
    }

    &:hover {
      background: rgba($color-text-regular, .25);
    }
  }
</style>
