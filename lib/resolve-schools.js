'use strict'

const schools = require('./data/schools.json')

const isInGroup = group => {
  return function (line) {
    const match = new RegExp(group)
    return match.test(line)
  }
}

module.exports = data => {
  const memberships = data.memberOf || []
  const myScools = []

  schools.forEach(school => {
    const isInThisGroup = isInGroup(school.accessGroup)
    const list = memberships.filter(isInThisGroup)

    if (list.length > 0) {
      myScools.push(Object.assign({id: school.id, name: school.name}))
    }
  })

  return myScools
}
