<template lang="pug">
  .editable-area-component(@click="changeMode('edit')" :class="`editable-area-type-${type}`")
    template(v-if="mode === 'edit'")
      textarea.non-draggable(
        v-if="textarea"
        :value="value"
        :placeholder="placeholder"
        @change="update"
        v-outside="changeMode")
      input.non-draggable(
        v-else
        :value="value"
        :placeholder="placeholder"
        @change="update"
        @keypress.enter="onEnterPress"
        v-outside="changeMode")

    .preview(v-else)
      div(v-if="value") {{ value }}
      .placeholder(v-else) {{ placeholder }}
</template>

<script>
export default {
  name: 'editable-area-component',
  model: {
    event: 'change'
  },
  props: {
    value: [String, Number],
    type: {
      type: String,
      default: 'default'
    },
    placeholder: String,
    textarea: Boolean
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
  mounted () {
    this.$root.$on('keyup-esc', this.changeMode)
  },
  beforeDestroy () {
    this.$root.$off('keyup-esc')
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
  }
}
</script>

<style lang="scss" scoped>
  .editable-area-component {
    cursor: text;
    // line-height: $line-height-default;
    margin-left: -2px;
    margin-right: -2px;

    input,
    textarea {
      width: 100%;
      height: 100%;
      border-radius: 3px;
      border: 2px solid #edeef0;
      background: $color-bg;
      line-height: $line-height-default;
      outline: none;
    }

    .preview {
      height: 100%;
      cursor: text;
      border: 2px solid transparent;
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
      .preview {
        border-radius: $border-radius-small;
        &:hover {
          background: $color-bg;
        }
      }
      input,
      textarea {
        background: $color-content-bg;
        border-radius: $border-radius-small;
      }
    }
  }
</style>
