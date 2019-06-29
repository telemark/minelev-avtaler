module.exports = input => {
  input = input.toLowerCase()
  input = input.replace(/\s/g, '')
  input = input.replace(/\//g, '')
  input = input.replace(/,/g, '')
  input = input.replace(/å/g, 'a')
  input = input.replace(/ø/g, 'o')
  input = input.replace(/æ/g, 'e')

  return input
}
