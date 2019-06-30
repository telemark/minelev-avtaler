[![Build Status](https://travis-ci.org/telemark/minelev-avtaler.svg?branch=master)](https://travis-ci.org/telemark/minelev-avtaler)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

# minelev-avtaler

Frontend for avtaler in MinElev

## Development

Add a `.env` file and configure it for your environment

```
NODE_ENV=development
ENCRYPTOR_SECRET=secret-for-temporary-storage
COOKIE_SECRET=cookie-secret-for-this-service
YAR_SECRET=yar-secret-for-this-service
JWT_SECRET=secret-for-this-service
AUTH_SERVICE_URL=url-for-auth-service
AUTH_SERVICE_SECRET=secret-for-auth-service
USER_SERVICE_URL=url-for-userservice-lookup
USER_SERVICE_SECRET=secret-for-userservice-lookup
BUDDY_SERVICE_URL=url-for-buddy-service
BUDDY_SERVICE_SECRET=secret-for-buddy-service
AVTALE_SERVICE_URL=url-for-agreement-service
AVTALE_SERVICE_SECRET=secret-for-agreement-service
AVTALE_SERVICE_TYPE=agreement-type
ACCESS_GROUP=access-group
SAMTYKKER_SERVICE_URL=consent-service-url
SAMTYKKER_SERVICE_SECRET=consent-service-secret
PAPERTRAIL_HOST=your-papertrail-host
PAPERTRAIL_PORT=your-papertrail-post
PAPERTRAIL_HOSTNAME=your-papertrail-hostname
DEV_USER_ID=userid-for-dev-environment
DEV_USER_NAME=user-name-for-dev-environment
DEV_USER_COMPANY=company-for-dev-environment
```

## Deploy

## License

[MIT](LICENSE)