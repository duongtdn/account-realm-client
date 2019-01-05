"use strict"

import { isObject, isFunction } from './util'

export default class Iframe {
  constructor({ baseurl }) {
    this.baseurl = baseurl.replace(/\/+$/,'')
    this._lazyFn = []
    this._done = null
    this._onIframeLoaded = null
    this._iframeClosed = true
    document.addEventListener("DOMContentLoaded", (event) => {
      this._domReady = true
      this._lazyFn.forEach(f => f.fn(...f.args))
      this._lazyFn = []
    }, false)
    window.addEventListener("message", (event) => {
      if (event.origin !== this.baseurl)
        return
      const data = event.data
      /* iframe loaded */
      if (data.code === 'iframe.loaded') {
        this._onIframeLoaded && this._onIframeLoaded()
        return
      }
      /* iframe close command */
      if (data.code === 'iframe.loaded') {
        this._closeIframe()
        return
      }
      /* iframe finish all processing */
      if (data.code === 'iframe.done') {
        this._done && this._done(data)
        // execute other iframe.open in queue if any
        if (this._lazyFn.length > 0) {
          const f = this._lazyFn.pop()
          f.fn(...f.args)
        }
      }
    }, false)
  }

  open({path, query, props, onLoaded, done}) {   
    this._lazyExecute(function({path, query, props, done}) {
      const url = this._constructURL(path, query)
      console.log(`GET ${url} HTTP / 1.1`)
      this._openIframe(url, props)
      this._onIframeLoaded = onLoaded
      this._done = done 
    }, {path, query, props, done})
  }

  close() {
    this._closeIframe()
  }

  _openIframe(url, props) {   
    this._iframeClosed = false
    let div = document.getElementById(`__${this.baseurl}__container__`)
    if (!div) {
      div = document.createElement('div')
      div.setAttribute('id', `__${this.baseurl}__container__`)
      document.getElementsByTagName('body')[0].appendChild(div)
    }
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.setAttribute('id', `__${this.baseurl}__iframe__`)
    if (props) {
      for (let attr in props) {
        if (attr === 'display') { continue }
        iframe.setAttribute(attr, props[attr])
      }
    }
    iframe.style.display = props && props.display ? props.display : 'none'
    iframe.style.border = 'none'
    div.appendChild(iframe)
  }

  _closeIframe() {
    const div = document.getElementById(`__${this.baseurl}__container__`)
    div.innerHTML = ''
    this._iframeClosed = true
  }

  _lazyExecute(fn, ...args) {
    fn = fn.bind(this)
    if (this._domReady && this._iframeClosed) {
      fn(...args)
    } else {
      this._lazyFn.push({fn, args})
    }
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


}
