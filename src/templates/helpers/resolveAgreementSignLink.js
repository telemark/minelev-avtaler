module.exports = agreement => {
  let message = 'Finner ikke url for signering. Er dette et manuelt oppdrag?'
  if (agreement.requireDigitalSignature === true && agreement.status === 'unsigned' && agreement.readStatus !== 'IKKE_LEVERT') {
    message = `https://svarut.ks.no/forsendelse/${agreement.partId}/1/signering`
  } else if (agreement.status === 'signed') {
    message = 'oppdraget er allerede signert'
  } else if (agreement.requireDigitalSignature === false) {
    message = 'Oppdraget skal ikke signeres'
  } else if (agreement.agreementType === 'images') {
    message = 'Be eleven logge seg inn på https://meg.minelev.no'
  }
  return message
}
