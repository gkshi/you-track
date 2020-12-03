<template lang="pug">
  common-modal.board-passcode-modal(:id="id" size="narrow" @open="onOpen")
    .h2(slot="title") This board is private.
    div Enter a passcode:
    form(id="board_passcode" @submit.prevent="check")
      common-input.passcode-field(v-model="passcode" placeholder="Passcode" :autocomplete="false")
      .error {{ error }}
    .buttons(slot="buttons")
      common-button(type="warning" form="board_passcode") Enter
      common-button(type="light" @click="exit") Cancel
</template>

<script>
import Cookie from 'js-cookie'

export default {
  name: 'board-passcode-modal',

  props: {
    data: {
      type: Object,
      default: () => ({})
    },

    board: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      id: 'board_passcode',
      passcode: '',
      error: ''
    }
  },

  watch: {
    passcode () {
      this.error = ''
    }
  },

  methods: {
    async check () {
      let hasAccess = true
      const res = await this.$store.dispatch('api/getBoard', {
        alias: this.board,
        payload: {
          passcode: this.passcode
        }
      }).catch(res => {
        hasAccess = false
        this.error = 'Wrong passcode'
        this.select()
        return res.data
      })

      if (hasAccess) {
        Cookie.set(`youtrack-board-${this.board}-passcode`, this.passcode)
        this.$emit('success', res)
        this.closeModal(this.id)
      }
    },

    select () {
      try {
        setTimeout(() => {
          const target = document.querySelector('.passcode-field').__vue__
          target.select()
        }, 100)
      } catch (e) {}
    },

    exit () {
      this.closeModal(this.id)
      this.$router.push('/')
    },

    onOpen () {
      this.select()
    }
  }
}
</script>

<style lang="scss" scoped>
  .board-passcode-modal {
    .error {
      margin-top: 10px;
      color: $color-warning;
    }
  }
</style>
