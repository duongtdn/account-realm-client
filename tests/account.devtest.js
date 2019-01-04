"use strict"

const args = process.argv.slice(2)
if (args.length > 0) {
  console.log('# Test arguments')
  args.forEach(arg => {
    console.log(`   - ${arg}`)
  });
}


const done = {
  sso(status, user) {
    switch (status) {
      case 200:
        console.log(`sign-in user: ${user}`)
        break
      case 404:
        console.log('no sign-in user')
        break
      case 503:
        console.log(`Network timeout: Service unavailable`)
        break
      default:
        console.log(`Unexpected return code: ${status}`)
        break
    }
  },
  lso(status, user) {
    switch (status) {
      case 200:
        console.log(`sign-in user: ${user}`)
        break
      case 404:
        console.log('no sign-in user')
        break
      default:
        console.log(`Unexpected return code: ${status}`)
        break
    }
  },
  signup(status, user) {
    switch (status) {
      case 200:
        console.log(`sign-in user: ${user}`)
        break
      case 404:
        console.log('no sign-in user')
        break
      case 503:
        console.log(`Network timeout: Service unavailable`)
        break
      default:
        console.log(`Unexpected return code: ${status}`)
        break
    }
  },
  signin(status, user) {
    switch (status) {
      case 200:
        console.log(`sign-in user: ${user}`)
        break
      case 403:
        console.log('no sign-in user')
        break
      case 503:
        console.log(`Network timeout: Service unavailable`)
        break
      default:
        console.log(`Unexpected return code: ${status}`)
        break
    }
  },
  signout(status, user) {
    switch (status) {
      case 200:
        console.log(`user has signed out`)
        break
      case 503:
        console.log(`Network timeout: Service unavailable`)
        break
      default:
        console.log(`Unexpected return code: ${status}`)
        break
    }
  }
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

document.addEventListener("DOMContentLoaded", (event) => {
  const btn = ['sso', 'lso', 'signup', 'signin', 'signout']
  btn.forEach( fn => $(fn).onclick = function() { acc[fn](done[fn]) })
}, false)

function $(id) {
  return document.getElementById(id)
} 

// acc.sso()

// setTimeout(() => acc.signout(), 1000)

// what happens if signup or signin even when has signed in
// setTimeout(() => acc.signup(), 1000)

// setTimeout(() => acc.signin(), 1000)

// import { del } from "../src/xhttp"

// del({
//   baseurl: 'http://localhost:3100',
//   path: '/session',
//   done: (status, data) => console.log(status + '/' + data)
// })