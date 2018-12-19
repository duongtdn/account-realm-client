"use strict"

import { isObject, isFunction } from './util'

class AuthProvider {
  constructor({ baseurl }) {
    this.baseurl = baseurl
  }

  get(path, query, done) {
    let _endpoint = `${this.baseurl}/${path}`
    let _query = ''
    let _done = null
    if (isFunction(query)) {
      _done = query
    }
    if (isObject(query)) {
      _query = '?'
      for (let t in query) {
        // _query += `${t}=${query}`
      }
    }
  }

  delete(path, done) {
    
  }

}

module.exports = AuthProvider