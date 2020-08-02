import API from '@/api'

export const actions = {
  sendExample (context, data) {
    return API.sendExamplePush(data)
  }
}

export default {
  actions
}
