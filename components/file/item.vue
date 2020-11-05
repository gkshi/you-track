<template lang="pug">
  .file-component.flex(
    :class="{ loading: data.loading }"
    @click="open")
    .preview.shrink
      img(v-if="preview" :src="preview")
      span(v-else) no preview

    .grow
      template(v-if="data.loading")
        div Uploading...

      template(v-else)
        .title {{ data.title || 'no title' }}
        // div
          a.download(:href="preview" :download="data.title") Download
</template>

<script>
import mixinFile from '@/mixins/file'

export default {
  mixins: [mixinFile],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    open () {
      this.$root.$emit('open-file-modal', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .file-component {
    position: relative;
    padding: 10px;
    max-width: 207px;
    background: $color-bg;
    border-radius: $border-radius-small;
    text-decoration: none;
    color: $color-text-regular;
    transition: $transition-file;
    cursor: pointer;

    &:hover {
      background: darken($color-bg, 2%);
    }

    .preview {
      width: 60px;
      height: 50px;
      margin-right: 16px;
      background: darken($color-bg, 2%);
      border-radius: $border-radius-small;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: $border-radius-small;
      }
    }

    .grow {
      width: calc(100% - 76px);
    }

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .download {
      font-size: $font-size-extrasmall;
      line-height: $line-height-extrasmall;
      text-decoration: none;
    }

    &.loading {
      opacity: .8;
      pointer-events: none;
    }
  }
</style>
