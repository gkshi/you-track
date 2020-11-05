<template lang="pug">
  section.card-section-files-component
    .section-title Files:

    .loading
      common-loader(:show="isLoading")

      div(v-if="!isLoading")
        .upload
          file-upload(@change="onUploaderChange")

        .files
          file-item(
            v-for="(file, i) in files"
            :data="file"
            :key="i"
            @remove="onFileRemove")
</template>

<script>
import { mapState } from 'vuex'

function fileToBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

export default {
  data () {
    return {
      isLoading: false,
      files: []
    }
  },
  computed: {
    ...mapState({
      card: state => state.activeCard
    })
  },
  mounted () {
    document.addEventListener('paste', this.onPaste)
    this.getFiles()
  },
  beforeDestroy () {
    document.removeEventListener('paste', this.onPaste)
  },
  methods: {
    async getFiles () {
      if (!this.card?._id) {
        return
      }
      this.isLoading = true
      const res = await this.$store.dispatch('api/getFiles', this.card._id)
      this.files = res || []
      this.isLoading = false
    },

    async upload (file) {
      const data = new FormData()
      data.append('file', file)
      const res = await this.$store.dispatch('api/uploadFile', {
        card: this.card._id,
        data
      })
      return res
    },

    onPaste (e) {
      this.onUploaderChange(e.clipboardData.files)
    },

    async onUploaderChange (files) {
      let i = 1
      for (const file of files) {
        const base64 = await fileToBase64(file)
        const entity = this.$models.create('file', {
          _id: i,
          source: base64,
          type: file.type,
          loading: true
        })
        this.files.push(entity)
        const uploaded = await this.upload(file)
        this.files = this.files.filter(j => j._id !== i)
        this.files.push(uploaded)
        i++
      }
    },

    onFileRemove (id) {
      console.log('onFileRemove', id)
      this.files = this.files.filter(i => i._id !== id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .card-section-files-component {
    .upload {
      margin-bottom: 10px;
    }

    .loading {
      min-height: 54px;
    }

    .files {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
