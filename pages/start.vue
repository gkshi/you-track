<template lang="pug">
  .page.start.flex.column.center
    h1 Hello. What's your name?
    form.flex.a-center(@submit.prevent="createUser")
      commonInput.grow(v-model="user" placeholder="Jack" autofocus)
      commonButton.shrink(native="submit" :disabled="!user") Next
</template>

<script>
export default {
  name: 'start-page',
  layout: 'simple',
  data () {
    return {
      user: ''
    }
  },
  methods: {
    createUser () {
      this.$store.dispatch('api/createUser', {
        name: this.user
      }).then(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page.start {
    h1 {
      margin-bottom: 24px;
    }
    .flex {
      .grow {
        width: 180px;
        margin-right: 10px;
      }
    }
  }
</style>
