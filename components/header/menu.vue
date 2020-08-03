<template lang="pug">
  .header-menu-component(v-outside="close")
    common-button(type="transparent" size="icon" @click="toggle")
      icon-menu

    transition
      .dropdown(v-if="isOpened" @click="toggle")
        // a(href="https://github.com/gkshi/you-track" target="_blank") Show in GitHub
        a(href="https://gkshi.github.io/" target="_blank") More projects
</template>

<script>
export default {
  name: 'header-menu-component',
  data () {
    return {
      isOpened: false
    }
  },
  mounted () {
    this.$root.$on('keyup', this.handleKeyup)
  },
  beforeDestroy () {
    this.$root.$off('keyup')
  },
  methods: {
    handleKeyup (key) {
      if (key === 'esc') {
        this.close()
      }
    },
    toggle () {
      this.isOpened = !this.isOpened
    },
    close () {
      this.isOpened = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-menu-component {
    position: relative;
    .dropdown {
      position: absolute;
      top: calc(100% + 10px);
      left: 0;
      min-width: 140px;
      background: $color-content-bg;
      border-radius: $border-radius-default;
      box-shadow: $box-shadow-ghost;
      font-size: $font-size-small;
      line-height: $line-height-small;
      color: $color-text-light;
      transition: $transition-default;
      & > * {
        display: block;
        padding: 13px 18px;
        text-decoration: none;
        color: $color-text-regular;
        transition: $transition-default;
        &:first-child {
          border-radius: $border-radius-default $border-radius-default 0 0;
        }
        &:last-child {
          border-radius: 0 0 $border-radius-default $border-radius-default;
        }
        &:only-child {
          border-radius: $border-radius-default;
        }
        &:hover {
          background: $color-bg;
        }
      }

      &.v-enter,
      &.v-leave-active {
        opacity: 0;
        transform: translate(0, -3px);
      }
    }
  }
</style>
