module.exports = exports = eqls

var funcToString = Function.prototype.toString
var funcToObj = Object.prototype.toString

function isDate(obj) { return funcToObj.call(obj) === '[object Date]' }
function isFunc(obj) { return 'function' === typeof obj }
function isObj(obj) { return 'object' === typeof obj }
function isNum(n) { return 'number' === typeof n }

function checkNaN(a, b) {
  return (isNum(a) && isNum(b)) ? (isNaN(a) && isNaN(b)) : false
}

exports.triple = tripleEquals
function tripleEquals(a, b) {
  return a === b || checkNaN(a, b)
}

function recKeys(obj) {
  var keys = Object.keys(obj)
  var proto = 'function' === typeof Object.getPrototypeOf
    ? Object.getPrototypeOf(obj)
    : obj.__proto__
  return proto === null ? keys : keys.concat(recKeys(proto))
}

function noAndSt(a, b) {
  return noSt(a, b) || noSt(b, a)
}

function noSt(a, b) {
  return 'string' === typeof a
    && 'number' === typeof b
}

exports.deep = eqls
function eqls(a, b) {
  var aKeys, bKeys

  if (tripleEquals(a, b)) return true
  if (noAndSt(a, b) && Number(a) === Number(b)) return true
  if (typeof a !== typeof b) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    if (a.every(function (e, i) {
      return eqls(e, b[i])
    })) return true
  } else if (isDate(a) && isDate(b)) {
    return +a === +b
  } else if (isObj(a) && isObj(b)) {
    aKeys = recKeys(a)
    bKeys = recKeys(b)
    if (aKeys.length !== bKeys.length) return false
    return aKeys.every(function (key) {
      return ~bKeys.indexOf(key) && eqls(a[key], b[key])
    })
  } else if (isFunc(a) && isFunc(b)) {
    return funcToString.call(a) === funcToString.call(b)
  }

  return false
}
