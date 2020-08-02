<template lang="pug">
  header.header-component.flex.a-center
    .wrapper.flex.a-center.j-between
      .side.flex.a-center
        .buttons.flex.a-center
          headerMenu
          commonButton(to="/" type="transparent" size="icon")
            iconHome
        h1.h2 {{ pageTitle }}
      .side.flex.a-center
        searchBar
        // themeToggler
        userBar
</template>

<script>
import { mapState } from 'vuex'
import iconHome from '@/components/icons/home'
import searchBar from '@/components/search-bar'
import themeToggler from '@/components/theme-toggler'
import userBar from '@/components/user-bar'
import headerMenu from './menu'

export default {
  components: {
    headerMenu,
    iconHome,
    searchBar,
    themeToggler,
    userBar
  },
  data () {
    return {
      isMenuOpened: false
    }
  },
  computed: {
    ...mapState({
      activeBoard: state => state.activeBoard
    }),
    pageTitle () {
      return this.activeBoard.title ? `${this.activeBoard.title} board` : this.$route.path === '/' ? 'Main page' : ''
    }
  },
  methods: {
    toggleMenu () {
      this.isMenuOpened = !this.isMenuOpened
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-component {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3000;
    width: 100%;
    height: $header-height;
    background: $color-dark;
    color: $color-text-light;
    & > * {
      width: 100%;
    }
    .side {
      & > *:not(:last-child) {
        margin-right: 32px;
      }
    }
    .buttons {
      & > *:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
</style>
