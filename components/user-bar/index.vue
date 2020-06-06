<template lang="pug">
  nuxt-link.user-bar-component.flex.a-center(to="/settings")
    .photo.shrink
      img(v-if="user.photo" :src="user.photo")
    div {{ user.name }}
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

    &:hover {
      color: $color-text-white;
    }

    .photo {
      width: 32px;
      height: 32px;
      margin-right: 10px;
      border-radius: 50%;
      background: $color-dark-highlight;
    }
  }
</style>
