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
    let div = document.getElementById(`__${this.baseurl}__container__`)
    console.log(div)
    if (!div) {
      console.log('create div')
      div = document.createElement('div')
      div.setAttribute('id', `__${this.baseurl}__container__`)
      document.getElementsByTagName('body')[0].appendChild(div)
    }
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.setAttribute('id', `__${this.baseurl}__iframe__`)
    iframe.style.display = 'none'
    div.appendChild(iframe)
  }

  _closeIframe() {
    const div = document.getElementById(`__${this.baseurl}__container__`)
    div.innerHTML = ''
  }

  _lazyExecute(fn, ...args) {
    fn = fn.bind(this)
    if (this._domReady) {
      fn(...args)
    } else {
      this._lazyFn.push({fn, args})
    }
  }

}
