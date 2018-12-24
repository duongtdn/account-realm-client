"use strict"

import AuthProvider  from "../src/auth-provider"

const auth = new AuthProvider({
  baseurl: 'http://localhost:3100'
})

describe('Test auth-provider.js', () => {

  describe('Class public methods', function() {
    describe('get', function() {
      it ('http get session with query', function(done) {
        auth.get('/apps/test/session', {t: 'test'}, function(data) {
          if (data && data.status == 200) {
            done()
          } else {
            done({error: `expecting status code 200, but received ${status}`})
          }
        })
      })  
    })
  })

})