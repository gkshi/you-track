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
        div
          .group(v-if="response.boards.length")
            .title Boards
            .boards
              nuxt-link.board(
                v-for="board in response.boards"
                :to="`/boards/${board.alias}`"
                :key="board._id") {{ board.title }}

          .group(v-if="response.cards.length")
            .title Cards
            .cards
              nuxt-link.card(
                v-for="card in response.cards"
                to="/"
                :key="card._id")
                div {{ card.title }}

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
    select () {
      this.$refs.input.select()
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
      this.response = await this.$store.dispatch('api/search', this.query)
      this.isOpened = true
      this.isLoading = false
    },
    onFocus () {
      if (this.query) {
        this.isOpened = true
        this.sendRequest()
        this.select()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-bar-component {
    position: relative;
    width: 176px;
    margin-bottom: 1px;

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

    .title {
      padding-left: 24px;
      padding-right: 24px;
    }

    .input {
      ::v-deep input {
        padding-left: 40px;
        text-align: right;
      }
    }

    .card,
    .board {
      display: block;
      padding: 10px 24px;
      text-decoration: none;
      &:hover {
        background: $color-bg;
      }
    }

    .group {
      &:not(:last-child) {
        margin-bottom: 24px;
      }
    }

    .dropdown {
      @extend %content-block;
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      z-index: 10;
      width: 360px;
      max-height: 320px;
      padding-left: 0;
      padding-right: 0;
      text-align: right;
      overflow: auto;
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
