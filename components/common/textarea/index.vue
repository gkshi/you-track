<template lang="pug">
  .textarea-component(:class="[{ 'textarea-component-error': error }, `textarea-color-${color}`]")
    label(v-if="$slots.default" :for="localId")
      slot
    textarea(
      :id="localId"
      :value="value"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
      :rows="rows"
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
    color: {
      type: String,
      default: 'default'
    },
    value: [String, Number],
    error: [String, Boolean],
    rows: {
      type: [String, Number],
      default: 4
    },
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
  mounted () {
    this.localId = this.localId || Math.random().toFixed(7).slice(2)
  },
  methods: {
    paste (e) {
      e.preventDefault()
      const value = e.clipboardData.getData('Text')
      this.$emit('input', value)
      this.$emit('paste', value)
    }
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
    }
  }
</style>
