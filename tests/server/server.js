"use strict"

const origin = {
  test: 'http://localhost:3200',
}

const express = require('express')

const app = express()
app.use('/assets', express.static('tests/server'))

app.get('/apps/:app/session', function (req, res) {
  const app = req.params.app
  console.log(`Request from app: ${app}`)
  res.writeHead( 200, { "Content-Type": "text/html" } );
  if (origin[app]) {
    res.end(html({targetOrigin: origin[app], status: 200, message: 'ok', script: "/assets/client.js"}))
  } else {
    res.end(html({targetOrigin: origin[app], status: 403, message: 'noapp', script: "/assets/client.js"}))
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
        var targetOrigin = "${targetOrigin}"
        var status = "${status}"
        var message = "${message}"
      </script>
  
    </body>
  
  </html>
  `
} 

