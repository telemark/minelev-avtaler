const generateId = require('./generate-id')
const schools = require('./data/schools.json')

module.exports = data => {
  const companyId = generateId(data.company)
  const myScools = []

  schools.forEach(school => {
    if (school.companies.includes(companyId)) {
      myScools.push(Object.assign({}, {id: school.id, name: school.name}))
    }
  })

  return myScools
}
