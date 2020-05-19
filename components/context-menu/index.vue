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
      el: null,
      elHeight: null
    }
  },
  watch: {
    isOpened () {
      this.isOpened ? this.create() : this.destroy()
    }
  },
  mounted () {
    this.$root.$on('keyup', this.handleKeyup)
  },
  beforeDestroy () {
    this.$root.$off('keyup')
    this.destroy()
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
    },
    create () {
      this.el = this.$refs.dropdown
      const position = this.$refs.icon.getBoundingClientRect()
      this.el.classList.add('transparent')
      document.body.appendChild(this.el)

      this.$nextTick().then(() => {
        const bottomSpace = window.innerHeight - (position.top + position.height)
        if (!this.elHeight) {
          this.elHeight = this.$refs.dropdown.offsetHeight + 24
        }

        // Определение направления вверх/вниз
        if (bottomSpace - 24 < this.elHeight) {
          this.el.classList.add('dropdown-direction-top')
          this.el.style.bottom = `${window.innerHeight - position.y - position.height}px`
          this.el.style.left = `${position.x + position.width}px`
        } else {
          this.el.classList.add('dropdown-direction-bottom')
          this.el.style.top = `${position.y}px`
          this.el.style.left = `${position.x + position.width}px`
        }

        this.el.classList.remove('transparent')
        this.$emit('open')
      })
    },
    destroy () {
      try {
        document.body.removeChild(this.el)
      } catch (e) {}
      this.el = null
      this.$refs.dropdown.classList.remove('dropdown-direction-top')
      this.$refs.dropdown.classList.remove('dropdown-direction-bottom')
      this.$refs.dropdown.style.top = ''
      this.$refs.dropdown.style.bottom = ''
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
      transition: $transition-default;
      &.transparent {
        opacity: 0;
        visibility: hidden;
      }
      .list {
        min-width: 120px;
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
          // color: inherit;
          color: $color-text-regular;
          transition: $transition-default;
          &:last-child {
            border-radius: 0 0 $border-radius-default $border-radius-default;
          }
          &:only-child {
            border-radius: $border-radius-default;
          }
          &:hover {
            background: rgba($color-bg, .7);
            // color: $color-text-regular;
          }
        }
      }
      &.dropdown-direction {
        &-top {
          .list {
            padding-bottom: 24px;
          }
        }
        &-bottom {
          .list {
            padding-top: 24px;
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
