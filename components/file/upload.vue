<template lang="pug">
  .file-upload-component
    label(ref="label")
      .label.flex.center
        icon-attachment.icon
        div Drop files here
        div
          strong &nbsp;or paste it&nbsp;
        div or select from your computer
      input(
        ref="input"
        type="file"
        accept="image/*"
        @change="$emit('change', $event.target.files)")
</template>

<script>
export default {
  mounted () {
    document.addEventListener('dragover', this.onDragover)
    this.$refs.label.addEventListener('drop', this.onDrop)
  },
  beforeDestroy () {
    document.removeEventListener('dragover', this.onDragover)
    this.$refs.label.removeEventListener('drop', this.onDrop)
  },
  methods: {
    onDragover (e) {
      e.preventDefault()
    },
    onDrop (e) {
      e.preventDefault()
      this.$emit('change', e.dataTransfer.files)
    }
  }
}
</script>

<style lang="scss" scoped>
  .file-upload-component {
    cursor: pointer;

    label {
      display: block;
      cursor: pointer;
    }

    .label {
      padding: 16px 0;
      background: $color-bg;
      border: 1px dashed darken($color-bg, 10%);
      color: $color-text-regular;
      border-radius: $border-radius-small;
      text-align: center;

      .icon {
        margin-right: 8px;
      }
    }

    input {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      border: 0;
    }
  }
</style>
