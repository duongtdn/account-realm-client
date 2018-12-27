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
app.get('/:realm/apps/:app/session', function (req, res) {
  const app = req.params.app
  console.log(`Request from app: ${app}`)
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
app.get('/:realm/apps/:app/session/clean', function (req, res) {
  const app = req.params.app
  // res.writeHead( 200, { "Content-Type": "text/html" } )
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
  console.log('Received request for sign up form')
  res.writeHead( 200, { "Content-Type": "text/html" } )
  res.end(html.signup())
})

/* store signup */
app.post('/users/new', function(req, res) {
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
  res.cookie('session', cookie)
  res.end(`Created new user: ${uid} and session with clientId: ${clientId}`)
  console.log(`Created new user: ${uid} and session with clientId: ${clientId}`)
})

/* for unit test */

app.get('/apps/:app/auth-provider-with-query', function (req, res) {
  const app = req.params.app
  res.end(html.sso({targetOrigin: origin[app], status: 200, message: {query: req.query}, script: "/assets/client.js"}))
})

app.get('/apps/:app/auth-provider-without-query', function (req, res) {
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

