<template lang="pug">
  .page.init
    h1 Hello. What's your name?
    form.flex.a-center(@submit.prevent="createUser")
      commonInput.grow(v-model="user" placeholder="Jack" autofocus)
      commonButton.shrink(native="submit" :disabled="!user") Next
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
  },
  mounted () {
    console.log('DB_USERNAME', process.env.DB_USERNAME)
    console.log('DB_PASSWORD', process.env.DB_PASSWORD)
  }
}
</script>

<style lang="scss" scoped>
  .page.init {
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
