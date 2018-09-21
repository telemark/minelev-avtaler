const test = require('ava')
const { getGroups } = require('tfk-schools-info')
const getMyClasses = require('../../src/lib/get-my-classes')
const schoolId = 'SKOVS'
const mySchools = [
  {
    id: schoolId
  }
]

test('it returns expected classes', t => {
  const classes = getMyClasses(mySchools)
  t.deepEqual(getGroups(schoolId).length, classes.length, 'classes ok')
})
