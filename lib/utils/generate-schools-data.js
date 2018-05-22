const schools = require('../data/schools-data.json')
const groups = require('../data/basisgrupper.json')
const basic = groups.reduce((prev, curr) => {
  if (!prev.hasOwnProperty(curr.Enhet)) {
    prev[curr.Enhet] = []
  }
  prev[curr.Enhet].push({
    id: curr.Basisgruppe,
    name: curr.Basisgruppenavn
  })
  return prev
}, {})

const data = schools.map(school => Object.assign({}, school, {basicGroups: basic[school.id]}))

console.log(JSON.stringify(data, null, 2))
