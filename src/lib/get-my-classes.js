const { getGroups } = require('tfk-schools-info')

module.exports = mySchools => {
  const mySchoolIds = mySchools.map(school => school.id)
  const allGroups = mySchoolIds.map(id => Object.assign({}, { schoolId: id, groups: getGroups(id) }))
  const groups = allGroups.reduce((prev, curr) => {
    const classes = curr.groups.map(group => Object.assign({}, { id: `${curr.schoolId}:${group.id}`, schoolId: curr.schoolId, group: group.id, name: group.name }))
    prev = prev.concat(classes)
    return prev
  }, [])
  return groups
}
