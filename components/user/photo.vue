<template lang="pug">
  .user-photo-component
    img(v-if="data.photo" :src="data.photo")
</template>

<script>
export default {
  name: 'user-photo-component',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-photo-component {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: $color-dark-highlight;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 50%;
    }
  }
</style>
