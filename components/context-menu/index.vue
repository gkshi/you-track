<template lang="pug">
  .context-menu-component(:class="{ opened: isOpened }" v-outside="close")
    .icon.flex.center(ref="icon" @click="toggle")
      iconDots
    .context-menu-dropdown(ref="dropdown" v-show="isOpened")
      .list(@click="close")
        slot
</template>

<script>
// import Vue from 'vue'
import iconDots from '@/components/icons/dots'

export default {
  components: {
    iconDots
  },
  data () {
    return {
      isOpened: false,
      el: null
    }
  },
  watch: {
    isOpened () {
      this.isOpened ? this.create() : this.destroy()
    }
  },
  beforeDestroy () {
    this.destroy()
  },
  methods: {
    toggle () {
      this.isOpened = !this.isOpened
    },
    close () {
      this.isOpened = false
    },
    create () {
      this.el = this.$refs.dropdown
      // detect position
      const position = this.$refs.icon.getBoundingClientRect()
      this.el.style.top = `${position.y}px`
      this.el.style.left = `${position.x + position.width}px`

      document.body.appendChild(this.el)
      this.$emit('open')
    },
    destroy () {
      try {
        document.body.removeChild(this.el)
      } catch (e) {}
      this.el = null
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
  body {
    & > .context-menu-dropdown {
      position: absolute;
      z-index: 2000;
      display: block !important;
      transform: translate(-100%, 0);
    }
    .context-menu-dropdown {
      .list {
        min-width: 120px;
        padding-top: 24px;
        background: $color-content-bg;
        border-radius: $border-radius-default;
        box-shadow: $box-shadow-ghost;
        font-size: $font-size-small;
        line-height: $line-height-small;
        color: $color-text-light;
        text-align: right;
        & > * {
          display: block;
          padding: 13px 18px;
          text-decoration: none;
          color: inherit;
          transition: $transition-default;
          &:hover {
            background: rgba($color-bg, .7);
            color: $color-text-regular;
          }
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .context-menu-component {
    position: relative;
    z-index: 2001;
    user-select: none;
    transition: $transition-default;
    .icon {
      position: relative;
      z-index: 3;
      width: 24px;
      height: 24px;
      cursor: pointer;
      border-radius: $border-radius-small;
      &:hover {
        background: $color-bg;
        color: $color-text-regular;
      }
    }

    &.opened {
      opacity: 1 !important;
      visibility: visible !important;
      .icon {
        background: transparent;
      }
    }
  }
</style>
