<template lang="pug">
  .input-component(:class="{ 'input-component-error': error }")
    label(v-if="$slots.default" :for="localId")
      slot
    input(
      :id="localId"
      :type="type"
      :value="value"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder"
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
  mounted () {
    this.localId = this.localId || Math.random().toFixed(7).slice(2)
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
    }
  }
</style>
