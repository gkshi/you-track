<template lang="pug">
  .page.card
    div card page
</template>

<script>
export default {
  name: 'card-page',
  async middleware ({ store, params, redirect, error }) {
    const board = await store.dispatch('api/searchCardBoard', params.id).catch(() => null)
    if (board) {
      return redirect({
        path: `/boards/${board.alias}`,
        query: {
          card: params.id
        }
      })
    } else {
      return error({
        statusCode: 404,
        message: 'Card not found'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page.card {
    //
  }
</style>
