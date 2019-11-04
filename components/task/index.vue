<template lang="pug">
  .task-component
    div {{ data.title }}
</template>

<script>
export default {
  name: 'task-component',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .task-component {
    background: #f1f1f1;
    padding: 10px;
  }
</style>
