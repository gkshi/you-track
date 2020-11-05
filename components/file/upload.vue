<template lang="pug">
  .file-upload-component
    label
      .label Click to upload a file or paste it (Cmd + V)
      input(
        type="file"
        accept="image/*"
        @change="$emit('change', $event.target.files)")
</template>

<script>
export default {
  //
}
</script>

<style lang="scss" scoped>
  .file-upload-component {
    cursor: pointer;

    label {
      cursor: pointer;
    }

    .label {
      padding: 16px 0;
      background: $color-white;
      border: 1px dashed darken($color-bg, 10%);
      color: $color-text-regular;
      border-radius: $border-radius-small;
      text-align: center;
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
