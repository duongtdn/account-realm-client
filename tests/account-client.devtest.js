"use strict"

const args = process.argv.slice(2)
if (args.length > 0) {
  console.log('# Test arguments')
  args.forEach(arg => {
    console.log(`   - ${arg}`)
  });
}


import AccountClient  from "../src/account-client"

const acc = new AccountClient({
  realm: 'realm',
  app: 'dev',
  baseurl: 'http://localhost:3100'
})

acc.sso()

// import { del } from "../src/xhttp"

// del({
//   baseurl: 'http://localhost:3100',
//   path: '/session',
//   done: (status, data) => console.log(status + '/' + data)
// })