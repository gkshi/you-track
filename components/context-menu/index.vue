<template lang="pug">
  .context-menu-component(:class="{ opened: isOpened }" v-outside="close")
    .icon.flex.center(ref="icon" @click="toggle")
      iconDots
    //- .dropdown(v-if="isOpened")
      .list
        slot
</template>

<script>
import Vue from 'vue'
import iconDots from '@/components/icons/dots'

export default {
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
      this.isOpened ? this.create() : this.destroy()
    }
  },
  mounted () {
    console.log(this.$slots.default)
  },
  methods: {
    toggle () {
      this.isOpened = !this.isOpened
    },
    close () {
      this.isOpened = false
    },
    create () {
      // generate DOM
      const dropdown = document.createElement('div')
      dropdown.classList.add('dropdown')
      const menu = document.createElement('div')
      menu.classList.add('menu')
      dropdown.appendChild(menu)

      // create child items
      // this.$slots.default.forEach(i => {
      //   console.log('i', i)
      //   window.asd = i
      // })

      const el = this.$createElement('div', {}, this.$slots.default)
      console.log('el', el)

      const Com = Vue.component('manual-menu', {
        render (createElement) {
          return createElement(
            'div', // tag name
            this.$slots.default // array of children
          )
        }
      })
      console.log('Com', Com)
      const comf = new Com().$mount()
      console.log('comf', comf.$el)
      document.body.appendChild(comf.$el)

      // const Extender = Vue.extend({
      //   template: '<div><slot /></div>'
      //   render (createElement) {
      //     return createElement(el)
      //   }
      // })
      // const component = new Extender().$mount()
      // console.log('component', component)

      // detect position
      const position = this.$refs.icon.getBoundingClientRect()
      dropdown.style.top = `${position.y}px`
      dropdown.style.left = `${position.x}px`

      document.body.appendChild(dropdown)
    },
    destroy () {
      console.log('destroy')
    }
  }
}
</script>

<style lang="scss" scoped>
  .context-menu-component {
    position: relative;
    user-select: none;
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
    .dropdown {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 2;
    }
    .list {
      min-width: 120px;
      background: $color-content-bg;
      border-radius: $border-radius-default;
      box-shadow: $box-shadow-ghost;
    }

    &.opened {
      .icon {
        background: transparent;
        color: $color-text-regular;
      }
    }
  }
</style>
