const colors = [
  '#8C939F',
  '#73CAF7',
  '#68E8A6',
  '#A181F1',
  '#F8B857',
  '#F75E7C'
]

module.exports = {
  colors,

  defaultLabelSet: () => {
    const arr = []
    colors.forEach((color, i) => {
      arr.push({
        _id: i + 1,
        title: '',
        color
      })
    })
    return arr
  }
}
