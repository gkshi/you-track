<template lang="pug">
  form.add-form-component(@submit.prevent="$emit('submit', value)")
    commonInput(
      ref="field"
      :value="value"
      @input="$emit('input', $event)"
      placeholder="Enter a title for this card...")
    .buttons.flex.a-center
      commonButton(size="small" native="submit" :disabled="!value")
        slot
      commonButton(size="square" type="ghost" @click="close")
        iconCross
</template>

<script>
import iconCross from '@/components/icons/cross'

export default {
  name: 'add-form-component',
  components: {
    iconCross
  },
  props: {
    value: String,
    placeholder: String
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.field.focus()
    })
    this.$root.$on('keyup-esc', this.close)
  },
  beforeDestroy () {
    this.$root.$off('keyup-esc', this.close)
  }
}
</script>

<style lang="scss">
  .add-form-component {
    input {
      &:focus {
        box-shadow: $box-shadow-light !important;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .add-form-component {
    .buttons {
      margin-top: 10px;
    }
  }
</style>
