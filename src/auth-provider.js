"use strict"

import { isObject, isFunction } from './util'

class AuthProvider {
  constructor({ baseurl }) {
    this.baseurl = baseurl.replace(/\/+$/,'')
  }

  get(path, query, done) {    
    if (isFunction(query)) {
      done = query
    }
    const url = this._constructURL(path, query)

    console.log(url)
    console.log(done)
  }

  delete(path, done) {
    if (isFunction(query)) {
      done = query
    }
    const url = this._constructURL(path, query)

    console.log(url)
    console.log(done)
  }

  _constructURL(path, query) {
    if (isObject(query)) {
      let _query = '?'
      for (let t in query) {
        _query += `${t}=${query[t]}&`
      }
      _query = _query.replace(/&+$/,"")
      return `${this.baseurl}/${path}${_query}`
    } else {
      return `${this.baseurl}/${path}`
    }    
  }

}

module.exports = AuthProvider