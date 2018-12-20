"use strict"

const getClass = {}.toString
const util = {}

const types = ['Arguments', 'Array', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Object']
types.forEach( name => {
  util[`is${name}`] = function (obj) {
    return obj && getClass.call(obj) == `[object ${name}]`;
  };
});

module.exports = {...util}
