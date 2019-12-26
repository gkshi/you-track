<template lang="pug">
  header.header-component.shrink
    .flex.a-center
      nuxt-link.button.flex.center(to="/")
        iconHome.icon
      .delimiter
      .grow
        span {{ activePage }}
      searchBar
      .delimiter
      .user.flex.a-center
        .photo
          img.object(v-if="user.photo" :src="user.photo")
          .thumb.flex.center(v-else)
            iconUser
        .name {{ user.name }}
      .delimiter
      .button.flex.center
        iconMoon.icon
</template>

<script>
import { mapState } from 'vuex'
import searchBar from '@/components/search-bar'
import iconHome from '@/components/icons/home'
import iconUser from '@/components/icons/user'
import iconMoon from '@/components/icons/moon'

export default {
  name: 'header-component',
  components: {
    searchBar,
    iconHome,
    iconUser,
    iconMoon
  },
  computed: {
    ...mapState({
      activeBoard: state => state.activeBoard,
      user: state => state.user
    }),
    activePage () {
      return this.activeBoard ? `${this.activeBoard} board` : 'Home page'
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-component {
    height: 60px;
    background: $color-light;
    color: $color-text-light;

    & > .flex {
      height: 100%;
    }

    .button {
      width: 60px;
      height: 60px;
      color: $color-text-light;
      cursor: pointer;
      &:hover {
        color: $color-primary;
      }
      & + .delimiter {
        margin-left: 0;
      }
    }
    .icon {
      height: 20px;
    }

    .thumb {
      width: 100%;
      height: 100%;
      background-image: linear-gradient(-45deg,#fab66f,#db237c);
      color: $color-bg;
      svg {
        height: 14px;
      }
    }

    .user {
      .photo {
        width: 32px;
        height: 32px;
        margin-right: 10px;
        border-radius: 50%;
        overflow: hidden;
      }
    }

    .delimiter {
      width: 1px;
      height: 100%;
      margin: 0 20px;
      background: $color-bg;
      & + .button {
        margin-left: -20px;
      }
    }
  }
</style>
