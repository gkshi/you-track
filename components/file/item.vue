<template lang="pug">
  .file-component.flex(:class="{ loading: data.loading }")
    .preview.shrink
      img(v-if="preview" :src="preview")
      span(v-else) no preview

    .info.grow
      template(v-if="data.loading")
        div Uploading...

      .flex.column.a-start(v-else)
        .title(@click="open") {{ data.title || 'no title' }}
        .actions
          a(href="#" @click.prevent="remove") Remove
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
    },
    async remove () {
      const res = await this.$store.dispatch('api/removeFile', this.data._id)
      if (!res.errors) {
        this.$emit('remove', this.data._id)
      }
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

    .info {
      width: calc(100% - 76px);
      font-size: $font-size-small;
      line-height: $line-height-small;

      .actions {
        position: relative;
        z-index: 2;

        a {
          color: $color-primary;
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .actions {
      margin-top: 4px;
      font-size: $font-size-extrasmall;
      line-height: $line-height-extrasmall;
    }

    .title {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }
    }

    &.loading {
      opacity: .8;
      pointer-events: none;
    }
  }
</style>
