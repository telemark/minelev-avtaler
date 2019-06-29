const pkg = require('../package.json')

module.exports = options => {
  const baseOptions = {
    version: pkg.version,
    githubUrl: pkg.repository.url
  }

  return options ? Object.assign({}, baseOptions, options) : baseOptions
}
