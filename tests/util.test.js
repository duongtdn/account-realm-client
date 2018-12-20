"use strict"

import { assert } from 'chai'

import util from '../src/util'

describe('Test util lib', () => {

  describe('Type check', function() {
    const obj = {
        Arguments : arguments,
        Array : [],
        Function : function () {},
        String : 'it is a string',
        Number : 123,
        Date : new Date(),
        RegExp : new RegExp("ab+c"),
        Object : {}
    }
    const types = ['Arguments', 'Array', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Object'];
    types.forEach( type => {
      describe(`is${type}`, function () {            
        types.forEach( name => {
          it (`Check ${type.toUpperCase()} as ${name.toUpperCase()}`, function() {
            assert.equal( util[`is${name}`](obj[type]), (type === name) );
          })
        });    
      });  
    });
  
  })

})