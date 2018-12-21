"use strict"

const args = process.argv.slice(2)
if (args.length > 0) {
  console.log('# Test arguments')
  args.forEach(arg => {
    console.log(`   - ${arg}`)
  });
}


import AuthProvider  from "../src/auth-provider"

const auth = new AuthProvider({
  baseurl: 'http://localhost:3100'
})

// auth.get('session/new', {template: 'default', theme: 'material'})

// auth.get('session/new', function(err, data) {
//   console.log(data)
// })

auth.get('apps/tests/session', {template: 'default', theme: 'material'}, function(err, data) {
  console.log(data)
})

// import AccountClient  from "../src/account-client"

// const acc = new AccountClient({
//   baseurl: 'https://account-realm.com'
// })

// acc.sso()