module.exports = agreement => {
  let message = ''
  if (agreement.agreementType === 'images') {
    message = ''
  } else if (agreement.status !== 'signed') {
    message = `<a href="/agreements/sign/${agreement.agreementId}" class="button button-primary">Trykk her for å sette avtale til signert</a>`
  }
  return message
}
