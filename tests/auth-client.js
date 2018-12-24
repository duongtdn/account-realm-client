"use strict"

console.log('# Auth: script loaded ')

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('# Auth: document loaded')
  postMessage() 
});

function postMessage() {
  if (window.parent) {
    var target = window.parent
    if (status == 200) {
      target.postMessage({status: status, session: {user: 'awesome', token: 'secure-token'}}, targetOrigin)
    } else if (status == 403) {
      target.postMessage({status: status, message: message}, "*")
      throw new Error('403 Forbidden')
    } else if (status == 404) {
      target.postMessage({status: status, message: message}, targetOrigin)
    }
  }
}