// label colors
const colors = [
  '#50B8E1',
  '#48D289',
  '#E5C83F',
  '#F5A02A',
  '#DE5361',
  '#F271B5',
  '#A25ADD',
  '#3E4D63'
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
