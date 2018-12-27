"use strict"

import Iframe  from "../src/iframe"

const iframe = new Iframe({
  baseurl: 'http://localhost:3100'
})

describe('Test iframe.js', () => {


  describe('Test open iframe', function() {
    it ('url include query', function(done) {
      iframe.open({
        path: '/apps/test/iframe-with-query',
        query: { t: test },
        done: (data) => {
          if (data && data.status == 200) {
            if (data.query && data.query.t === 'test') {
              done()
            } else {
              done({error: `expecting receive query t = 'test', but received t = '${data.query.t}'`})  
            }     
          } else {
            done({error: `expecting status code 200, but received ${status}`})
          }
        }
      })
    })  
    it ('url not include query', function(done) {
      iframe.open({
        path: '/apps/test/iframe-without-query',
        done: (data) => {
          if (data && data.status == 200) {
            if (data.query === null) {
              done()
            } else {
              done({error: `expecting no received query, but received '${data.query}'`})  
            }     
          } else {
            done({error: `expecting status code 200, but received ${status}`})
          }
        }
      })
    })  
  })


})