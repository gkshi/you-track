<template lang="pug">
  .button-component(@click="click" :class="{ disabled }")
    a.button(
      v-if="href"
      :class="classList"
      role="button"
      :href="href"
      :target="target"
      @focus="$emit('focus')"
      @blur="$emit('blur')")
      slot
    nuxt-link.button(
      v-else-if="to"
      :class="classList"
      role="button"
      :to="to"
      @focus="$emit('focus')"
      @blur="$emit('blur')")
      slot
    button.button(
      v-else
      :class="classList"
      role="button"
      :type="native"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      :disabled="disabled")
      slot
</template>

<script>
export default {
  name: 'button-component',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'default'
    },
    native: {
      type: String,
      default: 'button' // native button type (submit, confirm)
    },
    href: String,
    to: String,
    target: {
      type: String,
      default: '_blank' // _blank, _self
    },
    disabled: Boolean
  },
  computed: {
    classList () {
      return `button-type-${this.type} button-size-${this.size}`
    }
  },
  methods: {
    click (e) {
      if (this.disabled) {
        return e
      }
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
  .button-component {
    .button {
      border-radius: 3px;
      outline: none;
      font-weight: $font-weight-semibold;
      transition: $transition-button;

      // types
      &.button-type-ghost {
        &:hover {
          box-shadow: none;
        }
      }

      // sizes
      &.button-size-full {
        width: 100%;
        justify-content: center;
      }
      &.button-size-square {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        color: rgba($color-text-light, .5);
        svg {
          width: 14px;
          height: 14px;
          margin: 0;
        }
        &:hover {
          background: transparent;
          color: $color-text-light;
        }
      }

      &:hover {
        box-shadow: $box-shadow-light-focus;
      }
    }
  }
</style>
