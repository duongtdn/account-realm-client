"use strict"

const origin = {
  dev: 'http://localhost:3200',
  test: 'http://localhost:3300',
}

const sessions = []

const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(cookieParser())
app.use('/assets', express.static('tests/server'))

app.get('/apps/:app/session/new/:uid', function(req, res) {
  const uid = req.params.uid
  const clientId = Math.random().toString(36).substr(2,9)
  const session = { uid, clientId }
  sessions.push(session)
  const cookie = JSON.stringify(session)
  res.cookie('session', cookie)
  res.end(`Created new session uid: ${uid}, clientId: ${clientId}`)
  console.log(`Created new session uid: ${uid}, clientId: ${clientId}`)
})

app.get('/apps/:app/session', function (req, res) {
  const app = req.params.app
  console.log(`Request from app: ${app}`)
  const cookies = req.cookies
  console.log(cookies)  
  res.writeHead( 200, { "Content-Type": "text/html" } );
  if (origin[app]) {
    if (cookies && cookies.session) {
      res.end(html({targetOrigin: origin[app], status: 200, message: {session:{user: 'awesome', token: 'secret'}}, script: "/assets/client.js"}))
    } else {
      res.end(html({targetOrigin: origin[app], status: 404, message: {error:'nosession'}, script: "/assets/client.js"}))  
    }    
  } else {
    res.end(html({targetOrigin: origin[app], status: 403, message: {error:'noapp'}, script: "/assets/client.js"}))
  } 
})

app.get('/apps/:app/auth-provider-with-query', function (req, res) {
  const app = req.params.app
  res.end(html({targetOrigin: origin[app], status: 200, message: {query: req.query}, script: "/assets/client.js"}))
})

app.get('/apps/:app/auth-provider-without-query', function (req, res) {
  const app = req.params.app
  if (req.query && Object.keys(req.query).length > 0) {
    res.end(html({targetOrigin: origin[app], status: 200, message: {query: req.query}, script: "/assets/client.js"}))
  } else {
    res.end(html({targetOrigin: origin[app], status: 200, message: {query: null}, script: "/assets/client.js"}))
  }
})

app.listen(3100, function (err) {
  console.log('Auth server is running at 3100')
})

function html ({targetOrigin, status, message, script}) {
  return `
  <!DOCTYPE html>
  <html>
  
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1,  shrink-to-fit=no">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      
      <title>Accounts</title>      
         
      <!-- <link rel="stylesheet" type="text/css" href="w3.css"> -->
      <!-- <link rel="stylesheet" href="font-awesome-4.6.3/css/font-awesome.min.css"> -->
  
      <style>
  
      </style>
  
      <script type="text/javascript" src="${script}" ></script>
  
    </head>
  
    <body>    
  
      <div>
        <h2> Accounts </h2>
      </div>
  
      <script>
        var targetOrigin = '${targetOrigin}'
        var status = '${status}'
        var message = '${JSON.stringify(message)}'
      </script>
  
    </body>
  
  </html>
  `
} 

