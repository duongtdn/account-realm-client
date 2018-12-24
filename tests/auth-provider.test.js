"use strict"

import AuthProvider  from "../src/auth-provider"

const auth = new AuthProvider({
  baseurl: 'http://localhost:3100'
})

describe('Test auth-provider.js', () => {

  describe('Class public methods', function() {
    describe('method: get', function() {
      it ('http get with query', function(done) {
        auth.get('/apps/test/auth-provider-with-query', {t: 'test'}, function(data) {
          if (data && data.status == 200) {
            if (data.query && data.query.t === 'test') {
              done()
            } else {
              done({error: `expecting receive query t = 'test', but received t = '${data.query.t}'`})  
            }     
          } else {
            done({error: `expecting status code 200, but received ${status}`})
          }
        })
      })  
      it ('http get without query', function(done) {
        auth.get('/apps/test/auth-provider-without-query', function(data) {
          if (data && data.status == 200) {
            if (data.query === null) {
              done()
            } else {
              done({error: `expecting no received query, but received '${data.query}'`})  
            }     
          } else {
            done({error: `expecting status code 200, but received ${status}`})
          }
        })
      })  
    })
  })

})