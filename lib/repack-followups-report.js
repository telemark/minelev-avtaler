'use strict'

function classSort (a, b) {
  let num = 0
  if (a.id < b.id) {
    num = -1
  }

  if (a.id > b.id) {
    num = 1
  }

  return num
}

function nameSort (a, b) {
  let num = 0

  if (a.studentName.split(' ').pop() < b.studentName.split(' ').pop()) {
    num = -1
  }

  if (a.studentName.split(' ').pop() > b.studentName.split(' ').pop()) {
    num = 1
  }

  if (num === 0) {
    if (a.period < b.period) {
      num = -1
    }

    if (a.period > b.period) {
      num = 1
    }
  }

  return num
}

function addToClasses (a, b) {
  if (Object.keys(a).includes(b.studentMainGroupName)) {
    a[b.studentMainGroupName].students.push(b)
    a[b.studentMainGroupName].students.sort(nameSort)
  } else {
    a[b.studentMainGroupName] = { id: b.studentMainGroupName, students: [b] }
  }

  return a
}

module.exports = data => {
  const tmp = []

  data.forEach(item => {
    if (item.documentCategory === 'fag') {
      item.coursesList.split('\n').forEach(course => {
        tmp.push({
          documentId: item._id,
          studentName: item.studentName,
          userName: item.userName,
          period: item.period,
          category: course,
          date: item.timeStamp,
          studentMainGroupName: item.studentMainGroupName
        })
      })
    } else {
      tmp.push({
        documentId: item._id,
        studentName: item.studentName,
        userName: item.userName,
        period: item.period,
        category: item.documentCategory,
        date: item.timeStamp,
        studentMainGroupName: item.studentMainGroupName
      })
    }
  })

  const classes = tmp.reduce(addToClasses, {})

  const report = Object.keys(classes).map(key => classes[key])

  report.sort(classSort)

  return report
}
