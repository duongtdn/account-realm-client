"use strict"

const html = require('./template')

const origin = {
  dev: 'http://localhost:3200',
  test: 'http://localhost:3300',
}

const users = []
const sessions = []

const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const app = express()

app.use(cookieParser())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use('/assets', express.static('tests/server'))

app.get('/:realm/apps/:app/session/new/:uid', function(req, res) {
  const uid = req.params.uid
  const clientId = Math.random().toString(36).substr(2,9)
  const session = { uid, clientId }
  sessions.push(session)
  const cookie = JSON.stringify(session)
  res.cookie('session', cookie, { httpOnly: true }) // secure: true if production
  res.end(`Created new session uid: ${uid}, clientId: ${clientId}`)
  console.log(`Created new session uid: ${uid}, clientId: ${clientId}`)
})

/* sso */
app.get('/session', function (req, res) {
  if (!(req.query && req.query.realm && req.query.app)) {
    console.log('Request error: missing realm or app in query')
    res.end(html.sso({targetOrigin: undefined, status: 403, message: {error:'noapp'}, script: "/assets/client.js"}))
    return
  }
  const realm = req.query.realm
  const app = req.query.app
  console.log(`Request from app: ${app}`)
  console.log(req.query)
  const cookies = req.cookies  
  res.writeHead( 200, { "Content-Type": "text/html" } )
  if (!origin[app]) {
    res.end(html.sso({targetOrigin: origin[app], status: 403, message: {error:'noapp'}, script: "/assets/client.js"}))
    return
  }
  if (!cookies || !cookies.session) {
    res.end(html.sso({targetOrigin: origin[app], status: 404, message: {error:'nosession'}, script: "/assets/client.js"}))  
    return
  }
  
  const session = JSON.parse(cookies.session)
  // if ( sessions.some(ses => ses.uid === session.uid && ses.clientId === session.clientId) ) {
  //   res.end(html.sso({targetOrigin: origin[app], status: 200, message: {session:{user: session.uid, token: 'secret'}}, script: "/assets/client.js"}))
  // } else {
  //   // expires session
  //   res.end(html.sso({targetOrigin: origin[app], status: 404, message: {error:'expired'}, script: "/assets/client.js"}))
  // }
  res.end(html.sso({targetOrigin: origin[app], status: 200, message: {session:{user: session.uid, token: 'secret'}}, script: "/assets/client.js"}))
})

/* signout 
   security? can xxs logout user
*/
app.get('/clean', function (req, res) {
  if (!(req.query && req.query.realm && req.query.app)) {
    console.log('Request error: missing realm or app in query')
    res.end(html.sso({targetOrigin: undefined, status: 403, message: {error:'noapp'}, script: "/assets/client.js"}))
    return
  }
  const realm = req.query.realm
  const app = req.query.app
  if (!origin[app]) {
    console.log(`app ${app} is not registered`)
    res.end(html.sso({targetOrigin: origin[app], status: 403, message: {error:'noapp'}, script: "/assets/client.js"}))
    return
  }
  console.log('clear session cookie')
  res.clearCookie('session')
  res.end(html.sso({targetOrigin: origin[app], status: 200, message: {session: null}, script: "/assets/client.js"}))
})

/* get sign up form */
app.get('/users/new', function(req, res) {
  if (!(req.query && req.query.realm && req.query.app)) {
    console.log('Request error: missing realm or app in query')
    res.end(html.sso({targetOrigin: undefined, status: 403, message: {error:'noapp'}, script: "/assets/client.js"}))
    return
  }
  const realm = req.query.realm
  const app = req.query.app
  console.log(`Received request for sign up form from ${realm}/${app}`)
  res.writeHead( 200, { "Content-Type": "text/html" } )
  res.end(html.authenForm('/users', {realm, app}))
})  

/* create new user */
app.post('/users', function(req, res) {
  const realm = req.body.realm
  const app = req.body.app
  console.log(`Request from ${realm}/${app}. Creating new user`)
  console.log(req.body.username + '/' + req.body.password)
  const uid = req.body.username
  users.push({
    username: req.body.username,
    password: req.body.password
  })
  const clientId = Math.random().toString(36).substr(2,9)
  const session = { uid, clientId }
  sessions.push(session)
  const cookie = JSON.stringify(session)
  res.cookie('session', cookie, { httpOnly: true })
  res.end(html.sso({targetOrigin: origin[app], status: 200, message: {session:{user: uid, token: 'secret'}}, script: "/assets/client.js"}))
  console.log(`Created new user: ${uid} and session with clientId: ${clientId}`)
})

/* get sign in form */
app.get('/session/new', function(req, res) {
  if (!(req.query && req.query.realm && req.query.app)) {
    console.log('Request error: missing realm or app in query')
    res.end(html.sso({targetOrigin: undefined, status: 403, message: {error:'noapp'}, script: "/assets/client.js"}))
    return
  }
  const realm = req.query.realm
  const app = req.query.app
  console.log(`Received request for sign in form from ${realm}/${app}`)
  res.writeHead( 200, { "Content-Type": "text/html" } )
  res.end(html.authenForm('/session', {realm, app}))
})

/* create new session for logged user */
app.post('/session', function(req, res) {
  const realm = req.body.realm
  const app = req.body.app
  console.log(`Request from ${realm}/${app}. Creating new session for user ${req.body.username}`)
  console.log(req.body.username + '/' + req.body.password)
  const uid = req.body.username
  if (users.some(record => record.username === uid && record.password === req.body.password)) {
    const clientId = Math.random().toString(36).substr(2,9)
    const session = { uid, clientId }
    sessions.push(session)
    const cookie = JSON.stringify(session)
    res.cookie('session', cookie, { httpOnly: true })
    res.end(html.sso({targetOrigin: origin[app], status: 200, message: {session:{user: uid, token: 'secret'}}, script: "/assets/client.js"}))
    console.log(`Created new session with clientId: ${clientId} for user: ${uid}`)
  } else {
    res.end(html.sso({targetOrigin: origin[app], status: 403, message: {error:'forbidden'}, script: "/assets/client.js"})) 
    console.log(`Failed to created new session for user: ${uid}. Invalid credential`)
  }
})

/* for unit test */

app.get('/apps/:app/iframe-with-query', function (req, res) {
  const app = req.params.app
  res.end(html.sso({targetOrigin: origin[app], status: 200, message: {query: req.query}, script: "/assets/client.js"}))
})

app.get('/apps/:app/iframe-without-query', function (req, res) {
  const app = req.params.app
  if (req.query && Object.keys(req.query).length > 0) {
    res.end(html.sso({targetOrigin: origin[app], status: 200, message: {query: req.query}, script: "/assets/client.js"}))
  } else {
    res.end(html.sso({targetOrigin: origin[app], status: 200, message: {query: null}, script: "/assets/client.js"}))
  }
})

app.listen(3100, function (err) {
  console.log('Auth server is running at 3100')
})

