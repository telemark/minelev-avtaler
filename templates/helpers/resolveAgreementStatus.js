const translateStatus = {
  cancelled: '<i class="material-icons">cancel</i> Avbrutt',
  expired: '<i class="material-icons">watch_later</i> Utløpt',
  signed: '<i class="material-icons">check_circle</i> Signert',
  unknown: '<i class="material-icons">contact_support</i> Ukjent',
  unsigned: '<i class="material-icons">error</i> Usignert'
}

module.exports = input => !input ? '<i class="material-icons">contact_support</i> Ukjent' : translateStatus(input.status)
