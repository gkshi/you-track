<template lang="pug">
  .input-component(:class="[{ 'input-component-error': error }, `input-color-${color}`]")
    label(v-if="$slots.default" :for="localId")
      slot
    input(
      ref="input"
      :id="localId"
      :type="type"
      :value="value"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
      :autofocus="autofocus"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value)"
      @focus="$emit('focus', $event.target.value)"
      @blur="$emit('blur', $event.target.value)")
    .error(v-if="error") {{ errorText }}
</template>

<script>
export default {
  name: 'input-component',
  props: {
    id: String,
    type: {
      type: String,
      default: 'text'
    },
    color: {
      type: String,
      default: 'default'
    },
    value: [String, Number],
    error: [String, Boolean],
    placeholder: String,
    autofocus: Boolean,
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
    focus () {
      this.$refs.input.focus()
    }
  },
  mounted () {
    this.localId = this.localId || Math.random().toFixed(7).slice(2)
    if (this.autofocus) {
      this.$nextTick(() => {
        this.focus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .input-component {
    label {
      display: block;
    }
    input {
      display: block;
      padding: 11px 20px 12px;
      border: none;
      border-radius: $border-radius-default;
      outline: none;
      transition: $transition-field;
    }
  }
</style>
