<template lang="pug">
  .page.boards
</template>

<script>
export default {
  name: 'boards-page',
  middleware ({ redirect }) {
    return redirect('/')
  }
}
</script>

<style lang="scss" scoped>
  .page.boards {
    //
  }
</style>
