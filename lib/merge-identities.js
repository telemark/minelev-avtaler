module.exports = (students, identities) => {
  return students.reduce((accumulator, current) => {
    const identity = identities.find(identity => identity.fnr === current.personalIdNumber)
    if (identity) {
      accumulator.push(Object.assign({}, current, identity))
    } else {
      accumulator.push(current)
    }
    return accumulator
  }, [])
}
