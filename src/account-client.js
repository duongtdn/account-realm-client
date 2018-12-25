"use strict"

import { isObject } from './util'
import AuthProvider from './auth-provider'

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
    this.auth = new AuthProvider({ baseurl: this._props.baseurl })
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
    this.set({sso: true}) // enable sso flag sothat single sign-out will be used when user signed out
    this.auth.get(`${this.get('realm')}/apps/${this.get('app')}/session`, (data) => {
      if (data && data.status == 200) {
        this._setLocalSession(data.session)
        this._setCookie(data.session)
        console.log(data.session)
        return
      }
      if (data && data.status == 404) {
        console.log(data)
        this._signoutLocally()
        return
      }
    })
    return this
  }

  signup() {
    this.auth.get('users/new', (err, user) => {

    })
  }

  signin() {
    this.auth.get('session/new', (err, user) => {

    })
  }

  signout() {
    this._signoutLocally()
    if (this.get('sso')) {
      this.auth.delete('session', (err) => {
        
      })
    }
  }


  _getLocalSession() {

  }

  _setLocalSession() {

  }

  _clearLocalSession() {
    return this
  }

  _getCookie() {

  }

  _setCookie() {

  }

  _clearCookie() {

  }

  _signoutLocally() {
    this._clearLocalSession()._clearCookie()
    return this
  }


}
