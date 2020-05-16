<template lang="pug">
  .page.board
    div board page
</template>

<script>
export default {
  head () {
    return {
      title: `${this.board.title} board - YouTrack`
    }
  },
  data () {
    return {
      board: this.$models.create('board')
    }
  },
  methods: {
    toggleColumnCreation () {
      console.log('toggleColumnCreation')
    },
    initSortable () {
      console.log('initSortable')
    }
  },
  mounted () {
    this.$store.dispatch('api/getBoard', this.$route.params.board).then(res => {
      this.board.update(res)
      // this.board.columns = this.board.columns.map(i => this.$models.create('column', i))
      this.$store.dispatch('changeActiveBoard', this.board.title)
      this.initSortable()
      if (!this.board.columns.length) {
        this.toggleColumnCreation()
      }
    }).catch(err => {
      return this.$nuxt.error({ statusCode: 404, message: err.message })
    })
  },
  beforeDestroy () {
    this.$store.dispatch('changeActiveBoard', null)
    // window.removeEventListener('resize', this.watchColumnHeight)
  }
}
</script>

<style lang="scss" scoped>
  .page.board {
    //
  }
</style>
