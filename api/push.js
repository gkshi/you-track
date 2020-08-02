export default {
  sendExamplePush (data) {
    return this.do('POST', '/subscribe', data)
  }
}
