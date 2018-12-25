"use strict"

import { isObject, isFunction } from './util'

export function del ({baseurl, path, query, header, done}) {
  const url = _constructURL(baseurl, path, query)
  const request = new XMLHttpRequest()
  request.open('DELETE', url, true)
  if (header) {
    for (let name in header) {
      request.setRequestHeader(name, header[name]);
    }
  }
  request.addEventListener('load', () => {
    done(request.status, request.responseText)
  })  
  request.send();
}

function _constructURL(baseurl, path, query) {
  path = path.replace(/^\/+|\/+$/gm,'').replace(/\/\//gm,'/')    
  if (isObject(query)) {
    let _query = '?'
    for (let t in query) {
      _query += `${t}=${query[t]}&`
    }
    _query = _query.replace(/&+$/,"")
    return `${baseurl}/${path}${_query}`
  } else {
    return `${baseurl}/${path}`
  }    
}
