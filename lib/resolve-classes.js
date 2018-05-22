const schools = require('./data/schools.json')

module.exports = options => {
  const school = schools.find(s => s.id === options.schoolId)
  const list = school.basicGroups.map(group => {
    return Object.assign({}, {id: `${options.schoolId}:${group.id}`, schoolId: options.schoolId, group: group.id, name: group.name})
  })

  return list
}
