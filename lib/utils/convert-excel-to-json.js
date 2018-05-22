const convertExcel = require('excel-as-json').processFile
const inFile = 'lib/data/basisgrupper.xlsx'
const outFile = 'lib/data/basisgrupper.json'
convertExcel(inFile, outFile, false, (error, data) => {
  if (error) {
    console.error(error)
  } else {
    console.log(data)
  }
})
