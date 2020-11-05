  <template lang="pug">
    common-modal.file-modal(id="file" size="clean")
      img.image(:src="preview")
  </template>

<script>
import mixinFile from '@/mixins/file'

export default {
  name: 'file-modal',
  mixins: [mixinFile],
  data () {
    return {
      data: {}
    }
  },
  mounted () {
    this.$root.$on('open-file-modal', this.onOpen)
  },
  beforeDestroy () {
    this.$root.$off('open-file-modal')
  },
  methods: {
    onOpen (file) {
      this.data = file
      this.openModal('file')
    }
  }
}
</script>

  <style lang="scss" scoped>
    .file-modal {
      .image {
        max-width: 100%;
        max-height: 80vh;
      }

      ::v-deep {
        dialog {
          padding: 0;
        }
        .close {
          display: none;
        }
      }
    }
  </style>
