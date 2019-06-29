module.exports = (agreement, parent) => {
  let message = ''
  if (agreement.agreementType === 'images') {
    message = ''
  } else if (agreement.status !== 'signed') {
    message = `<br /><br /><a href="/agreements/sign/${agreement.agreementId}?classId=${parent.classID}" class="button primary">Trykk her for å sette avtalen til signert</a>`
  }
  return message
}
