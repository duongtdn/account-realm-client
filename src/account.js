"use strict"

import { isObject } from './util'
import Iframe from './iframe'

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

  sso() {
    this.emit('authenticating')
    this.set({sso: true}) // enable sso flag sothat single sign-out will be used when user signed out
    this.iframe.open({
      path: `${this.get('realm')}/apps/${this.get('app')}/session`,
      done: (data) => {
        if (data && data.status == 200) {
          this._setLocalSession(data.session)
          this.emit('authenticated', data.session.user)
          return
        }
        if (data && data.status == 404) {
          this.signoutLocally().emit('unauthenticated')
          return
        }
      }
    })
    return this
  }

  signup() {
    this.iframe.open({
      path: `${this.get('realm')}/apps/${this.get('app')}/users/new`,
      props: { display: 'block', width: 500, height: 500 },
      done: (data) => {
        if (data && data.status == 200) {
          this._setLocalSession(data.session)
          this.emit('authenticated', data.session.user)
          return
        }
        if (data && data.status == 404) {
          this.signout()
          return
        }
      }
    })
    return this
  }

  signin() {
    this.iframe.open({
      path: `${this.get('realm')}/apps/${this.get('app')}/session/new`,
      done: (data) => {
        if (data && data.status == 200) {
          this._setLocalSession(data.session)
          this.emit('authenticated', data.session.user)
          return
        }
        if (data && data.status == 404) {
          this.signout()
          return
        }
      }
    })
    return this
  }

  signout() {
    this.signoutLocally()
    if (this.get('sso')) {
      this.iframe.open({
        path: `${this.get('realm')}/apps/${this.get('app')}/session/clean`,
        done: (data) => {
          if (data && data.status == 200) {
            this.emit('unauthenticated')
          } else {
            throw new Error(data)
          }
        }
      })
    }
    return this
  }

  signoutLocally() {
    this._clearLocalSession()
    return this
  }

  _clearLocalSession() {
    this._props.user = undefined
    this._props.token = undefined
    return this
  }

  _setLocalSession(session) {
    this._props.user = session.user
    this._props.token = session.token
    return this
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
