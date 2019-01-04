"use strict"

console.log('# Form: script loaded ')

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('# Form: document loaded')
  postMessage('iframe.loaded')
});

function postMessage(code) {
  if (window.parent) {
    var target = window.parent
    var msg = { code: code }
    target.postMessage(msg, '*')
  }
}