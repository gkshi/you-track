<template lang="pug">
  .search-bar-component
    .input
      input(ref="field" v-model="query" type="search" placeholder="Search...")
      iconSearch.icon(v-show="!query" @click.native="focus")
</template>

<script>
import iconSearch from '@/components/icons/search'

export default {
  name: 'search-bar-component',
  components: {
    iconSearch
  },
  data () {
    return {
      query: ''
    }
  },
  watch: {
    query () {
      console.log('query', this.query)
    }
  },
  methods: {
    focus () {
      this.$refs.field.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-bar-component {
    width: 200px;
    .input {
      position: relative;
      width: 100%;
      height: 100%;
      input {
        display: block;
        width: 100%;
        height: 100%;
        padding: 5px 20px 7px;
        border: none;
        border-radius: 30px;
        background: $color-bg;
        outline: none;
        transition: $transition-field;
        &:focus {
          background: darken($color-bg, 2%);
        }
      }
    }
    .icon {
      position: absolute;
      top: 9px;
      right: 18px;
      height: 14px;
      color: $color-text-ghost;
      cursor: text;
    }
  }
</style>
