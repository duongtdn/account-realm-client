"use strict"

import { isObject } from './util'
import Iframe from './iframe'

const SESSION = 'SESSION'

export default class AccountClient {
  constructor(props) {
    this._props = {
      cookie: false
    }
    this.set(props)
    if (!this._props.baseurl) {
      throw new Error('missing prop: baseurl')
    }
    if (!this._props.realm) {
      throw new Error('missing prop: realm')
    }
    if (!this._props.app) {
      throw new Error('missing prop: app')
    }
    this.iframe = new Iframe({ baseurl: this._props.baseurl })
    this._eventHandlers = {}
  }

  get(prop) {
    return this._props[prop]
  }

  set(props) {
    if (isObject(props)) {
      for (let p in props) {
        this._props[p] = props[p]
      }
    } else {
      throw new Error('Require props to be an Object')
    }
    return this
  }

  emit(event, ...args) {
    if (this._eventHandlers[event]) {
      this._eventHandlers[event].forEach(fn => fn.call(this, ...args))
    }
    return this
  }

  on(event, callback) {
    if (!this._eventHandlers[event]) {
      this._eventHandlers[event] = []
    }
    this._eventHandlers[event].push(callback)
    return this
  }

  sso(done) {
    this.emit('authenticating')
    this._setTimeout(done)
    this.iframe.open({
      path: '/session',
      query: { realm: this.get('realm'), app: this.get('app') },
      onLoaded: () => this._clearTimeout(),
      done: (data) => {
        this.iframe.close()
        if (data && data.status == 200) {
          if (data.session && data.session.user && data.session.token) {
            this._setLocalSession(data.session)
            this.emit('authenticated', data.session.user)
            done & done(200, data.session.user)
            return
          }
          if (data.session === null) {
            this.signoutLocally()
            done & done(404, null)
            return
          }
        }
      }
    })
    return this
  }

  signup(done) {
    this._setTimeout(done)
    this.iframe.open({
      path: '/users/new',
      query: { realm: this.get('realm'), app: this.get('app') },
      props: { display: 'block' },
      onLoaded: () => this._clearTimeout(),
      done: (data) => {
        // this.iframe.close()
        if (data && data.status == 200) {
          this._setLocalSession(data.session)
          this.emit('authenticated', data.session.user)
          done & done(200, data.session.user)
          return
        }
        /* what to be processed if signup failed? what status code of failure? */
        // if (data && data.status == 404) {
        //   this.signout()
        //   return
        // }
      }
    })
    return this
  }

  signin(done) {
    this._setTimeout(done)
    this.iframe.open({
      path: '/session/new',
      query: { realm: this.get('realm'), app: this.get('app') },
      props: { display: 'block' },
      onLoaded: () => this._clearTimeout(),
      done: (data) => {
        if (data && data.status == 200) {
          // this.iframe.close()
          this._setLocalSession(data.session)
          this.emit('authenticated', data.session.user)
          done & done(200, data.session.user)
          return
        }
        /* what to be processed if signin failed? what status code of failure? */
        if (data && data.status == 403) {
          this.emit('unauthenticated')
          done & done(403, data.session.user)
          return
        }
      }
    })
    return this
  }

  signout(done) {
    this._setTimeout(done)
    this.iframe.open({
      path: '/session/clean',
      query: { realm: this.get('realm'), app: this.get('app') },
      onLoaded: () => this._clearTimeout(),
      done: (data) => {
        this.iframe.close()
        if (data && data.status == 200) {
          this.signoutLocally()
          done & done(200, null)
        } else {
          throw new Error(data)
        }
      }
    })
    return this
  }

  signoutLocally() {
    this._clearLocalSession()
    this.emit('unauthenticated')
    return this
  }

  lso(done) {
    if (typeof(Storage) === "undefined") {
      // Sorry! No Web Storage support..
      throw new Error("No Web Storage support")
    }
    const session = JSON.parse(localStorage.getItem(SESSION))
    if (session && session.user && session.token) {
      this.set({ ...session })
      this.emit('authenticated', session.user)
      done & done(200, session.user)
    } else {
      this.emit('unauthenticated')
      done & done(404, null)
    }
    return this
  }

  _clearLocalSession() {
    this.set({ user: undefined, token: undefined })
    if (typeof(Storage) === "undefined") {
      // Sorry! No Web Storage support..
      throw new Error("No Web Storage support")
    }
    localStorage.removeItem(SESSION);
    return this
  }

  _setLocalSession(session) {
    this.set({ ...session })    // {user, token}
    if (typeof(Storage) === "undefined") {
      // Sorry! No Web Storage support..
      throw new Error("No Web Storage support")
    }
    localStorage.setItem(SESSION, JSON.stringify(session));
    return this
  }

  _setTimeout(done) {
    // TImeout code: 503 Service Unavailable
    const timeout = this.get('timeout') || 2000
    this._to = setTimeout(() => {
      this.iframe.close()
      done & done(503, null)
    }, timeout) 
  }

  _clearTimeout() {
    clearTimeout(this._to)
  }

  /* in future, set local cookie may be needed for server-side rendering */

  // _setCookie(cname, cvalue, exdays) {
  //   let expires = exdays ? `expires=${exdays}` : '';
  //   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  //   return this
  // }

  // _clearCookie(cname) {
  //   const expires = 'Thu, 01 Jan 1970 00:00:00 UTC';
  //   this._setCookie(cname, '', expires)
  //   return this
  // }

}
