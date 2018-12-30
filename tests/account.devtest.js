"use strict"

const args = process.argv.slice(2)
if (args.length > 0) {
  console.log('# Test arguments')
  args.forEach(arg => {
    console.log(`   - ${arg}`)
  });
}


import AccountClient  from "../src/account"

const acc = new AccountClient({
  realm: 'realm',
  app: 'dev',
  baseurl: 'http://localhost:3100'
})

acc
  .on('authenticating', () => console.log('authenticating...'))
  .on('authenticated', user => console.log(`authenticated: user: ${user}`))
  .on('unauthenticated', () => console.log('unauthenticated'))

acc.sso()

setTimeout(() => acc.signout(), 1000)

// what happens if signup or signin even when has signed in
setTimeout(() => acc.signup(), 1000)

// import { del } from "../src/xhttp"

// del({
//   baseurl: 'http://localhost:3100',
//   path: '/session',
//   done: (status, data) => console.log(status + '/' + data)
// })