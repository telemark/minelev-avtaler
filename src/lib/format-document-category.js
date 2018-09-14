module.exports = documentCategory => {
  let category = documentCategory
  if (documentCategory === 'yff-lokalplan') {
    category = 'Lokal læreplan'
  } else if (documentCategory === 'yff-tilbakemelding') {
    category = 'Tilbakemeldingsskjema'
  } else if (documentCategory === 'yff-bekreftelse') {
    category = 'Bekreftelse utplassering - elev'
  } else if (documentCategory === 'yff-bekreftelse-bedrift') {
    category = 'Bekreftelse utplassering - bedrift'
  } else if (documentCategory === 'fag') {
    category = 'Varselbrev fag'
  } else if (documentCategory === 'atferd') {
    category = 'Varselbrev atferd'
  } else if (documentCategory === 'orden') {
    category = 'Varselbrev orden'
  } else if (documentCategory === 'samtale') {
    category = 'Elevsamtale'
  }
  return category
}
