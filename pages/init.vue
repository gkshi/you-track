<template lang="pug">
  .page.init
    div
      h1 Create your user at first
    div
      commonInput(v-model="user")
    div
      commonButton(@click="createUser" :disabled="!user") Continue
</template>

<script>
export default {
  name: 'init-page',
  layout: 'init',
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
  .page.init {
    //
  }
</style>
