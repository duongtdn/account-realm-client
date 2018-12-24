"use strict"

import { isObject, isFunction } from './util'

import { get } from './xhttp'

export default class AuthProvider {
  constructor({ baseurl }) {
    this.baseurl = baseurl.replace(/\/+$/,'')
    this._lazyFn = [];
    document.addEventListener("DOMContentLoaded", (event) => {
      this._domReady = true
      this._lazyFn.forEach(f => f.fn(...f.args))
    });
  }

  get(path, query, done) {    
    if (isFunction(query)) {
      done = query
    }
    const url = this._constructURL(path, query)
    this._lazyExecute(this._openIframe, url)
    window.addEventListener("message", receiveMessage.bind(this), false);    
    function receiveMessage (event) {
      if (event.origin !== this.baseurl)
        return;
      const data = event.data
      done && done(data)
    }    
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
    path = path.replace(/^\/+|\/+$/gm,'').replace(/\/\//gm,'/')    
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

  _openIframe(url) {
    const body = document.getElementsByTagName('body')[0]
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.setAttribute('id', `__${this.baseurl}__`)
    iframe.style.display = 'none'
    body.appendChild(iframe)
  }

  _lazyExecute(fn, ...args) {
    if (this._domReady) {
      fn(...args)
    } else {
      this._lazyFn.push({fn: fn.bind(this), args})
    }
  }

}
