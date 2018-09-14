const translateStatus = {
  cancelled: '<i class="text-warning material-icons">cancel</i> Ikke gitt samtykke',
  expired: '<i class="text-warning material-icons">cancel</i> Ikke gitt samtykke',
  exception: '<i class="text-warning material-icons">cancel</i> Ikke gitt samtykke',
  manual: '<i class="text-warning material-icons">cancel</i> Ikke gitt samtykke',
  signed: '<i class="text-success material-icons">check_circle</i> Gitt samtykke',
  delivered: '<i class="text-warning material-icons">cancel</i> Ikke gitt samtykke',
  unknown: '<i class="text-warning material-icons">cancel</i> Ikke fått samtykke',
  unsigned: '<i class="text-warning material-icons">cancel</i> Ikke gitt samtykke'
}

module.exports = input => {
  let status = '<i class="text-warning material-icons">cancel</i> Ikke fått samtykke'
  if (input && input.status) {
    status = input.status.split('/').map(item => translateStatus[item]).join(' / ')
  }
  return status
}
