<template lang="pug">
  .search-bar-component(v-outside="reset")
    iconSearch.icon(@click.native="$refs.input.focus")
    commonInput.input(
      ref="input"
      type="alt"
      v-model="query"
      :placeholder="placeholder"
      @focus="onFocus"
      @input="search")

    transition
      .dropdown(v-if="isOpened")
        div(v-if="response.boards.length")
          div Boards
          div(v-for="board in response.boards" :key="board._id") {{ board._id }}

        div(v-if="response.cards.length")
          div Cards
          div(v-for="card in response.cards" :key="card._id") {{ card._id }}

        div(v-if="!response.boards.length && !response.cards.length") No items found.
</template>

<script>
import iconSearch from '@/components/icons/search'

export default {
  components: {
    iconSearch
  },
  props: {
    placeholder: {
      type: String,
      default: 'Search by cards...'
    },
    delay: {
      type: Number,
      default: 500
    }
  },
  data () {
    return {
      isOpened: false,
      isLoading: false,
      query: '',
      timeout: null,
      response: {
        boards: [],
        cards: []
      }
    }
  },
  methods: {
    reset () {
      clearTimeout(this.timeout)
      this.isOpened = false
      this.isLoading = false
      this.response = {
        boards: [],
        cards: []
      }
      // Object.assign(this.$data, this.$options.data())
    },
    search () {
      if (!this.query) {
        this.reset()
        return
      }
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.sendRequest()
      }, this.delay)
    },
    async sendRequest () {
      if (this.isLoading) {
        return
      }
      this.isLoading = true
      const res = await this.$store.dispatch('api/search', this.query)
      console.log('res', res)
      this.isOpened = true
      this.isLoading = false
    },
    onFocus () {
      if (this.query) {
        this.isOpened = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-bar-component {
    position: relative;
    width: 176px;

    .icon {
      position: absolute;
      top: 9px;
      left: 14px;
      z-index: 0;
      cursor: text;
      &:hover + .input {
        ::v-deep input {
          background: lighten($color-dark, 5%);
        }
      }
    }

    .input {
      ::v-deep input {
        padding-left: 40px;
        text-align: right;
      }
    }

    .dropdown {
      @extend %content-block;
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      z-index: 10;
      width: 360px;
      text-align: right;
      transition: $transition-default;
      box-shadow: $box-shadow-default-hover;

      &.v-enter,
      &.v-leave-active {
        opacity: 0;
        transform: translate(0, -3px);
      }
    }
  }
</style>
