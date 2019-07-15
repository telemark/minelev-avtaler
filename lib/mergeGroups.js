'use strict'

module.exports = list => {
  var tmp = {}
  var newList = []

  list.forEach(item => {
    const key = Object.keys(item)[0]
    if (tmp[key]) {
      tmp[key].groups.push(item[key].group)
    } else {
      item[key].groups = [item[key].group]
      delete item[key].group
      tmp[key] = item[key]
    }
  })

  // Populates the new list
  Object.keys(tmp).forEach(function (thisKey) {
    const item = {}
    item[thisKey] = tmp[thisKey]
    newList.push(item)
  })

  return newList
}
