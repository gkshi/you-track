<template lang="pug">
  nuxt-link.user-bar-component.flex.a-center(to="/settings")
    user-photo(:data="user")
    .name {{ user.name }}
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      user: state => state.user
    })
  }
}
</script>

<style lang="scss" scoped>
  .user-bar-component {
    color: $color-text-light;
    text-decoration: none;

    .name {
      margin-left: 10px;
    }

    &:hover {
      color: $color-text-white;
    }
  }
</style>
