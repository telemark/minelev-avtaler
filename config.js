if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
module.exports = {
  WEB_SERVER_PORT: process.env.WEB_SERVER_PORT || 8000,
  ORIGIN_URL: process.env.ORIGIN_URL || 'http://localhost:8000/signin',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  ENCRYPTOR_SECRET: process.env.ENCRYPTOR_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  JWT_SECRET: process.env.JWT_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  YAR_SECRET: process.env.YAR_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'https://auth.demo.t-fk.win',
  AUTH_SERVICE_SECRET: process.env.AUTH_SERVICE_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  LOGOUT_URL: process.env.LOGOUT_URL || false,
  BUDDY_SERVICE_URL: process.env.BUDDY_SERVICE_URL || 'https://buddy.minelev.no',
  BUDDY_SERVICE_SECRET: process.env.BUDDY_SERVICE_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  AVTALE_SERVICE_URL: process.env.AVTALE_SERVICE_URL || 'https://avtale.demo.minelev.no',
  AVTALE_SERVICE_SECRET: process.env.AVTALE_SERVICE_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  AVTALE_SERVICE_TYPE: process.env.AVTALE_SERVICE_TYPE || 'elevpc',
  USER_SERVICE_URL: process.env.USER_SERVICE_URL || 'https://auth.demo.t-fk.win/lookup',
  USER_SERVICE_SECRET: process.env.USER_SERVICE_SECRET || 'Louie Louie, oh no, I got to go Louie Louie, oh no, I got to go',
  ACCESS_GROUP: process.env.ACCESS_GROUP || 'TFK-TG-MinElevLeder',
  SAMTYKKER_SERVICE_URL: process.env.SAMTYKKER_SERVICE_URL,
  SAMTYKKER_SERVICE_SECRET: process.env.SAMTYKKER_SERVICE_SECRET,
  PAPERTRAIL_HOSTNAME: process.env.PAPERTRAIL_HOSTNAME || 'minelev-avtaler',
  PAPERTRAIL_HOST: process.env.PAPERTRAIL_HOST || 'logs.papertrailapp.com',
  PAPERTRAIL_PORT: process.env.PAPERTRAIL_PORT || 12345
}
