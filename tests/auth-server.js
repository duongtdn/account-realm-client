"use strict"

const express = require('express')

const app = express()

app.get('/session', function (req, res) {
  res.status(200).json({user: 'USER', token: 'TOKEN'})
})

app.listen(3100, function (err) {
  console.log('Auth server is running at 3100')
})