<template lang="pug">
  .board-component
    nuxt-link(:to="`/boards/${data.alias}`")
      .title {{ data.title }}
      div {{ data.description }}
      div {{ data.columns.length }} lists
    contextMenu.menu
      nuxt-link(to="/") Open
      a(href="#" @click.prevent) Edit
      a(href="#" @click.prevent) Delete
</template>

<script>
import contextMenu from '@/components/context-menu'

export default {
  components: {
    contextMenu
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
  .board-component {
    @extend %content-block;
    position: relative;
    padding: 0;
    width: $column-narrow;
    a {
      display: block;
      padding: 16px 18px;
      text-decoration: none;
      color: inherit;
    }
    ::v-deep .menu {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 1000;
    }
  }
</style>
