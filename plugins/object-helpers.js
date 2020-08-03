function _copyObjectValues (target, data) {
  Object.keys(target).forEach(key => {
    if (Array.isArray(data[key])) {
      target[key] = Array.from(data[key])
    } else if (typeof data[key] === 'object') {
      _copyObjectValues(target[key], data[key])
    } else {
      target[key] = data[key]
    }
  })
}

// eslint-disable-next-line no-extend-native
Object.defineProperty(Object.prototype, 'merge', {
  value (data = {}) {
    Object.keys(this).forEach(key => {
      if (Array.isArray(data[key])) {
        this[key] = Array.from(data[key])
      } else if (typeof data[key] === 'object') {
        _copyObjectValues(this[key], data[key])
      } else {
        this[key] = data[key]
      }
    })
  },
  configurable: true,
  enumerable: false
})
