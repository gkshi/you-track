<template lang="pug">
  .board-component
    nuxt-link(:to="`/boards/${board.alias}`")
      .title {{ board.title }}
      .description {{ board.description }}
      .counters.flex.a-center
        div {{ board.order.length }} lists
        div ,&nbsp;
        div {{ board.cards }} cards

    context-menu.menu
      nuxt-link(:to="`/boards/${board.alias}`") Open board
      a(href="#" @click.prevent="edit") Edit board
      a(href="#" @click.prevent="requestRemoving") Delete board

    modal-board-remove(@submit="remove")
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      board: this.$models.create('board', this.data)
    }
  },
  watch: {
    data: {
      handler () {
        this.board.update(this.data)
      },
      deep: true
    }
  },
  methods: {
    edit () {
      this.$store.dispatch('changeActiveBoard', this.data)
      this.openModal('board_edit')
    },
    requestRemoving () {
      this.openModal('board_remove')
    },
    async remove () {
      const res = await this.$store.dispatch('api/removeBoard', this.board._id)
      if (res) {
        this.$emit('remove', this.data)
        this.closeModal('board_remove')
      }
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
    .title {
      padding-right: 20px;
      font-size: $font-size-smaller;
      line-height: $line-height-smaller;
    }
    .counters {
      margin-top: 2px;
      // text-decoration: underline;
    }
    ::v-deep .menu {
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }
</style>
