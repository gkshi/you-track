export default {
  computed: {
    preview () {
      if (this.data?.source) {
        return this.data.source.indexOf('data:') === 0
          ? this.data.source
          : `data:${this.data.type || 'image/png'};base64,${this.data.source}`
      }
      return ''
    }
  }
}
