<template lang="pug">
  .editable-area-component(@click="changeMode('edit')" :class="`editable-area-type-${type}`")
    template(v-if="mode === 'edit'")
      textarea.non-draggable(
        v-if="textarea"
        :value="value"
        :placeholder="placeholder"
        @change="update"
        @keypress.enter="onEnterPress"
        v-outside="changeMode")
      input.non-draggable(
        v-else
        :value="value"
        :placeholder="placeholder"
        @change="update"
        v-outside="changeMode")

    .preview(v-else)
      div(v-if="value") {{ value }}
      .placeholder(v-else) {{ placeholder }}
</template>

<script>
export default {
  name: 'editable-area-component',
  props: {
    value: [String, Number],
    type: {
      type: String,
      default: 'default'
    },
    placeholder: String,
    textarea: Boolean
  },
  model: {
    event: 'change'
  },
  data () {
    return {
      mode: 'show' // show, edit
    }
  },
  watch: {
    mode () {
      if (this.mode === 'edit') {
        this.focus()
      }
    }
  },
  methods: {
    changeMode (mode = 'show') {
      this.mode = mode
    },
    focus () {
      this.$nextTick(() => {
        const target = this.textarea ? 'textarea' : 'input'
        this.$el.querySelector(target).focus()
        this.$el.querySelector(target).select()
      })
    },
    onEnterPress (e) {
      this.update(e)
    },
    update (e) {
      if (e.target.value !== this.value) {
        this.$emit('change', e.target.value)
      }
      this.changeMode('show')
    }
  },
  mounted () {
    this.$root.$on('keyup-esc', this.changeMode)
  },
  beforeDestroy () {
    this.$root.$off('keyup-esc')
  }
}
</script>

<style lang="scss" scoped>
  .editable-area-component {
    cursor: text;
    line-height: $line-height-default;
    input,
    textarea {
      width: 100%;
      height: 100%;
      border-radius: 3px;
      // border: 2px solid #edeef0;
      background: $color-bg;
      line-height: $line-height-default;
      outline: none;
    }
    .preview {
      height: 100%;
      cursor: text;
    }
    .placeholder {
      color: $color-text-light;
    }

    &.editable-area-type-default {
      .preview {
        background: $color-bg;
      }
    }

    &.editable-area-type-light {
      input,
      textarea {
        background: $color-content-bg;
      }
    }
  }
</style>
