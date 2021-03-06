const translateStatus = {
  cancelled: '<i class="text-warning material-icons">cancel</i> Avbrutt',
  expired: '<i class="text-warning material-icons">watch_later</i> Utløpt',
  exception: '<i class="text-warning material-icons">receipt</i> Manuell',
  manual: '<i class="text-warning material-icons">receipt</i> Manuell',
  signed: '<i class="text-success material-icons">check_circle</i> Signert',
  unknown: '<i class="text-unknown material-icons">contact_support</i> Ukjent',
  unsigned: '<i class="text-unknown material-icons">error</i> Usignert'
}

module.exports = input => {
  let status = '<i class="text-unknown material-icons">contact_support</i> Ukjent'
  if (input && input.status) {
    status = input.status.split('/').map(item => translateStatus[item]).join(' / ')
  }
  return status
}
