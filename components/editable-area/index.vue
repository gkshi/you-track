<template lang="pug">
  .editable-area-component(@click="changeMode('edit')")
    template(v-if="mode === 'edit'")
      textarea.non-draggable(
        v-if="textarea"
        :value="value"
        @change="update"
        @keypress.enter="onEnterPress"
        v-outside="changeMode")
      input.non-draggable(
        v-else
        :value="value"
        @change="update"
        @keypress.enter="onEnterPress"
        v-outside="changeMode")
    div(v-else ref="text") {{ value }}
</template>

<script>
export default {
  name: 'editable-area-component',
  props: {
    value: [String, Number],
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
        console.log('update', e.target.value)
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
    input,
    textarea {
      width: 100%;
      // border: 2px solid #edeef0;
      border-radius: 3px;
      background: #edeef0;
      outline: none;
    }
  }
</style>
