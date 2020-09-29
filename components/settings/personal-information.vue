<template lang="pug">
  .personal-information-setting-component
    common-input(type="white" v-model="user.name" readonly)
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'personal-information-setting-component',
  computed: {
    ...mapState({
      user: state => state.user
    })
  }
}
</script>

<style lang="scss" scoped>
  .personal-information-setting-component {
    //
  }
</style>
