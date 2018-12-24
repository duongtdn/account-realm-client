"use strict"

console.log('# Auth: script loaded ')

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('# Auth: document loaded')
  postMessage() 
});

function postMessage() {
  if (window.parent) {
    var target = window.parent
    var obj = JSON.parse(message)
    var msg = { status: status }
    for (let k in obj) {
      msg[k] = obj[k]
    }
    if (status == 200 || status == 404) {
      target.postMessage(msg, targetOrigin)
    } else if (status == 403) {
      target.postMessage(msg, "*")
      throw new Error('403 Forbidden')
    }
  }
}