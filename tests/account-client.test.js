"use strict"

const args = process.argv.slice(2)
if (args.length > 0) {
  console.log('# Test arguments')
  args.forEach(arg => {
    console.log(`   - ${arg}`)
  });
}


// const AuthProvider = require("../dist/auth-provider")

// const auth = new AuthProvider({
//   baseurl: 'https://account-realm.com'
// })

// // auth.get('session/new', {template: 'default', theme: 'material'})

// // auth.get('session/new', function(err, data) {
// //   console.log(data)
// // })

// auth.get('session/new', {template: 'default', theme: 'material'}, function(err, data) {
//   console.log(data)
// })

import AccountClient  from "../src/account-client"

const acc = new AccountClient({
  baseurl: 'https://account-realm.com'
})

acc.sso()