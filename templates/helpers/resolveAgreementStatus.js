const translateStatus = {
  cancelled: '<i class="text-warning material-icons">cancel</i> Avbrutt',
  expired: '<i class="text-warning material-icons">watch_later</i> Utløpt',
  signed: '<i class="text-success material-icons">check_circle</i> Signert',
  unknown: '<i class="text-unknown material-icons">contact_support</i> Ukjent',
  unsigned: '<i class="text-unknown material-icons">error</i> Usignert'
}

module.exports = input => !input ? '<i class="material-icons">contact_support</i> Ukjent' : translateStatus(input.status)
