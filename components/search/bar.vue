<template lang="pug">
  .search-bar-component(v-outside="reset")
    icon-search.icon(@click.native="$refs.input.focus")
    common-input.input(
      ref="input"
      type="alt"
      v-model="query"
      :placeholder="placeholder"
      @focus="onFocus"
      @input="search")

    transition
      .dropdown(v-if="isOpened")
        div
          .title(v-if="isLoading")
            common-loader(:show="isLoading")
          template(v-else)
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
                a.card(
                  v-for="card in response.cards"
                  :href="`/cards/${card._id}`"
                  @click.prevent="openCard(card._id)"
                  :key="card._id")
                  div {{ card.title }}

            .title(v-if="!response.boards.length && !response.cards.length") No items found.
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: 'Search by boards and cards...'
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
  watch: {
    '$route' () {
      this.query = ''
      this.reset()
    }
  },
  methods: {
    async openCard (id) {
      const board = await this.$store.dispatch('api/searchCardBoard', id)
      this.$router.push({
        path: `/boards/${board.alias}`,
        query: {
          card: id
        }
      })
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
      this.isOpened = true
      this.isLoading = true
      this.response = await this.$store.dispatch('api/search', this.query)
      this.isLoading = false
    },
    reset () {
      clearTimeout(this.timeout)
      this.isOpened = false
      this.isLoading = false
      if (!this.response.boards.length && !this.response.cards.length) {
        this.query = ''
      }
      // this.response = {
      //   boards: [],
      //   cards: []
      // }
      // Object.assign(this.$data, this.$options.data())
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
    width: 240px;
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
