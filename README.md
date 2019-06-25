# account-realm-client

## Install

`npm install --save account-realm-client`

## How to use

```javascript
"use strict"

import AccountClient  from 'account-realm-client'

/* realm, app and baseurl are registered with account-realm-core */
const acc = new AccountClient({
  realm: 'realm',
  app: 'dev',
  baseurl: 'http://localhost:3100'
})

/* SSO automatically when script started */
acc.sso( (err,user) => {
  console.log(err)
  console.log(user)
})

/* register events */
acc
  .on('authenticating', () => console.log('authenticating...'))
  .on('authenticated', user => console.log(`authenticated: user: ${user}`))
  .on('unauthenticated', () => console.log('unauthenticated'))
  
  ```
### APIs

TBD, see src/account.js