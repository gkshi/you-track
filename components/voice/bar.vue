<template lang="pug">
  transition
    .voice-bar-component(v-if="isAvailable")
      div voice bar
      div(v-if="isReady")
        a(href="#" @click.prevent="startRecording") start
        a(href="#" @click.prevent="stopRecording") stop
      div(v-else)
        div not ready
</template>

<script>
export default {
  data () {
    return {
      stream: null,
      recorder: null
    }
  },
  computed: {
    isAvailable () {
      return !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia
    },
    isReady () {
      return !!this.recorder
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (!this.isAvailable) {
        return
      }
      navigator.mediaDevices.getUserMedia({
        audio: true
      }).then(stream => {
        console.log('then', stream)
        this.stream = stream
        this.recorder = new MediaRecorder(this.stream)
        this.addEventListeners()
      }).catch(err => {
        console.log('The following getUserMedia error occured: ' + err)
      })
    },
    addEventListeners () {
      this.recorder.ondataavailable = e => {
        console.log('ondataavailable', e)
        this.parseRecordedData(e)
      }
      this.recorder.onstop = e => {
        console.log('onstop', e)
      }
    },
    startRecording () {
      console.log('start')
      this.recorder.start()
      console.log(this.recorder.state)
    },
    stopRecording () {
      this.recorder.stop()
      console.log(this.recorder.state)
    },
    async parseRecordedData (data) {
      console.log('parseRecordedData', data)
      const res = await this.$axios({
        method: 'POST',
        url: 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize',
        headers: {
          'Cache-Control': 'no-cache'
        },
        params: {
          lang: 'ru-RU'
        },
        data
      })
      console.log('res', res)
    }
  }
}
</script>

<style lang="scss" scoped>
  .voice-bar-component {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
    padding: 10px;
    background: #ccc;
    transition: $transition-default;

    &.v-enter,
    &.v-leave-active {
      opacity: 0;
      transform: scale(.8);
    }
  }
</style>
