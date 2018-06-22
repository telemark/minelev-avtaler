const { getGroups } = require('tfk-schools-info')

module.exports = options => {
  const groups = getGroups(options.schoolId)
  const list = groups.map(group => Object.assign({}, {id: `${options.schoolId}:${group.id}`, schoolId: options.schoolId, group: group.id, name: group.name}))

  return list
}
