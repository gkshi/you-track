export default {
  sendExamplePush (data) {
    return this.do('POST', '/push-test', data)
  }
}
