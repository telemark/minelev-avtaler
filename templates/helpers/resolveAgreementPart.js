module.exports = agreement => {
  let part = 'foresatt'
  if (agreement.agreementUserId === agreement.partUserId) {
    part = 'elev'
  }
  return part
}
