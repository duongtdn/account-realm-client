"use strict"

const origin = {
  test: 'http://localhost:3200',
}

const express = require('express')

const app = express()
app.use('/assets', express.static('tests'))

app.get('/apps/:app/session', function (req, res) {
  const app = req.params.app
  console.log(`Request from app: ${app}`)
  if (origin[app]) {
    res.writeHead( 200, { "Content-Type": "text/html" } );
    res.end(html({targetOrigin: origin[app], script: "/assets/auth-client.js"}))
  } else {
    res.status(404).send('404')
  } 
})

app.listen(3100, function (err) {
  console.log('Auth server is running at 3100')
})

function html ({targetOrigin, script}) {
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
      </script>
  
    </body>
  
  </html>
  `
} 

