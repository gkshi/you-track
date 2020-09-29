<template lang="pug">
  form.add-form-component(@submit.prevent="$emit('submit', value)" v-outside="tryToClose")
    common-input(
      ref="field"
      :value="value"
      :placeholder="placeholder"
      @input="$emit('input', $event)")
    .buttons.flex.a-center
      common-button(size="small" native="submit" :disabled="!value")
        slot
      common-button.close(size="icon" type="icon" @click="close")
        icon-cross
</template>

<script>
export default {
  name: 'add-form-component',
  props: {
    value: String,
    placeholder: String,
    exception: String
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.field.focus()
    })
    this.$root.$on('keyup-esc', this.close)
  },
  beforeDestroy () {
    this.$root.$off('keyup-esc', this.close)
  },
  methods: {
    tryToClose (e) {
      if (this.exception) {
        let parent = e.target.parentNode
        while (parent && parent.tagName.toLowerCase() !== 'body' && !parent.classList.contains(this.exception)) {
          parent = parent.parentNode
        }
        if (parent && parent.tagName.toLowerCase() === 'body') {
          this.close()
        }
      } else {
        this.close()
      }
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-form-component {
    @extend %content-block;
    .buttons {
      margin-top: 10px;
    }
    .close {
      color: $color-text-light;
      &:hover {
        color: $color-text-regular;
      }
    }
  }
</style>
