<template lang="pug">
  .color-picker-simple-component
    .color.flex.center(
      v-for="color in colors"
      :style="`background-color: ${color}`"
      @click="$emit('change', color)")
      common-checkbox(v-show="color === value" :checked="true")
</template>

<script>
const { colors } = require('@/app.config')

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      colors
    }
  },
  mounted () {
    if (!this.value) {
      this.$emit('change', colors[0])
    }
  }
}
</script>

<style lang="scss" scoped>
  .color-picker-simple-component {
    display: grid;
    grid-gap: 6px;
    grid-template-columns: repeat(4, 1fr);

    .color {
      width: 44px;
      height: 44px;
      border-radius: 2px;
      cursor: pointer;
    }

    ::v-deep .common-checkbox-component {
      [class*="box"] {
        padding-bottom: 2px;
      }
    }
  }
</style>
