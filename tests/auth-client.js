"use strict"

console.log('# Auth: script loaded ')

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('# Auth: document loaded')
  ping() 
});

function ping() {
  if (window.parent) {
    const target = window.parent
    // console.log('Target is: ')
    // console.log(target)
    // // console.log(targetOrigin)
    target.postMessage({provider: 'realm', user: 'awesome', token: 'secure-token'}, targetOrigin)
  }
}