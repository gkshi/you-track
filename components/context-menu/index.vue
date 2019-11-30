<template lang="pug">
  .context-menu-component.inline-flex.shrink(@click="toggle" v-outside="close")
    .button.flex.center(:class="{ active: isOpened }")
      iconDots
    transition
      .list(v-if="isOpened")
        slot
</template>

<script>
import iconDots from '@/components/icons/dots'

export default {
  name: 'context-menu-component',
  components: {
    iconDots
  },
  data () {
    return {
      isOpened: false
    }
  },
  watch: {
    isOpened () {
      this.$emit(this.isOpened ? 'open' : 'close')
    }
  },
  methods: {
    toggle () {
      this.isOpened = !this.isOpened
    },
    close () {
      this.isOpened = false
    }
  },
  mounted () {
    this.$root.$on('keyup-esc', this.close)
  },
  beforeDestroy () {
    this.$root.$off('keyup-esc', this.close)
  }
}
</script>

<style lang="scss">
  .context-menu-component {
    .list {
      & > * {
        display: block;
        padding: 10px 20px;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .context-menu-component {
    position: relative;
    user-select: none;
    .button {
      width: 24px;
      height: 24px;
      border-radius: $border-radius-default;
      color: $color-text-ghost;
      transition: $transition-button;
      cursor: pointer;
      &:hover {
        color: $color-text-regular;
      }
      &.active {
        background: $color-bg;
        color: $color-text-regular;
      }
      svg {
        height: 12px;
      }
    }
    .list {
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      z-index: 100;
      background: $color-white;
      border-radius: $border-radius-default;
      transition: $transition-context-menu;
      white-space: nowrap;
      box-shadow: $box-shadow-deep;
      &.v-enter,
      &.v-leave-active {
        opacity: 0;
        transform: translate(0, -5px);
      }
    }
  }
</style>
