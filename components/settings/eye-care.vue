<template lang="pug">
  .eye-care-settings-component(:class="{ disabled }")
    .h2 Eye care
    div is active: {{ isActive }}

    // error message
    div(v-if="errorMessage") {{ errorMessage }}

    template(v-if="isActive")
      div
        a(href="#" @click.prevent="sendExample") send example push
      div
        a(href="#" @click.prevent) turn off
    template(v-else)
      div
        a(href="#" @click.prevent) turn on
</template>

<script>
export default {
  name: 'eye-care-settings-component',
  props: {
    disabled: Boolean
  },
  data () {
    return {
      isActive: false,
      errorMessage: null,
      pushManager: null
    }
  },
  computed: {
    //
  },
  mounted () {
    this.check()
  },
  methods: {
    async sendExample () {
      //
    },
    async check () {
      //
    }
  }
}
</script>

<style lang="scss" scoped>
  .eye-care-settings-component {
    //
  }
</style>
