"use strict"

const getClass = {}.toString
const util = {}

['Arguments', 'Array', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Object']
.forEach( name => {
  util[`is${name}`] = function (obj) {
    return obj && getClass.call(obj) == `[object ${name}]`;
  };
});

module.exports = {...util}
