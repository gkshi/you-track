<template lang="pug">
  .textarea-component(:class="{ 'textarea-component-error': error }")
    label(v-if="$slots.default" :for="localId")
      slot
    textarea(
      :id="localId"
      :value="value"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value)"
      @focus="$emit('focus', $event.target.value)"
      @blur="$emit('blur', $event.target.value)"
      @paste="paste")
    .error(v-if="error") {{ errorText }}
</template>

<script>
export default {
  name: 'textarea-component',
  props: {
    id: String,
    value: [String, Number],
    error: [String, Boolean],
    placeholder: String,
    readonly: Boolean,
    disabled: Boolean
  },
  data () {
    return {
      localId: this.id
    }
  },
  computed: {
    errorText () {
      return typeof this.error === 'string' ? this.error : 'Error'
    }
  },
  methods: {
    paste (e) {
      e.preventDefault()
      const value = e.clipboardData.getData('Text')
      this.$emit('input', value)
      this.$emit('paste', value)
    }
  },
  mounted () {
    this.localId = this.localId || Math.random().toFixed(7).slice(2)
  }
}
</script>

<style lang="scss" scoped>
  .textarea-component {
    label {
      display: block;
    }
    textarea {
      display: block;
      width: 100%;
      padding: 11px 20px 12px;
      border: none;
      border-radius: $border-radius-default;
      box-shadow: $box-shadow-light;
      outline: none;
      transition: $transition-field;

      &:focus {
        box-shadow: $box-shadow-light-focus;
      }
    }
  }
</style>
