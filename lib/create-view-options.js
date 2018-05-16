const pkg = require('../package.json')
const features = require('../config/features')

module.exports = options => {
  const baseOptions = {
    version: pkg.version,
    versionName: pkg.louie.versionName,
    versionVideoUrl: pkg.louie.versionVideoUrl,
    systemName: pkg.louie.systemName,
    githubUrl: pkg.repository.url,
    features: features
  }

  return options ? Object.assign({}, baseOptions, options) : baseOptions
}
