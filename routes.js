module.exports = [
  {
    method: 'GET',
    path: '/hello',
    handler: function (request, h) {
      return 'hello world'
    }
  }
]
