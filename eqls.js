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
function tripleEquals(a, b) { return a === b || checkNaN(a, b) }

function recKeys(obj) {
  var keys = Object.keys(obj)
  var proto = 'function' === typeof Object.getPrototypeOf
    ? Object.getPrototypeOf(obj)
    : obj.__proto__
  return proto === null ? keys : keys.concat(recKeys(proto))
}

function noAndSt(a, b) { return noSt(a, b) || noSt(b, a) }

function noSt(a, b) {
  return 'string' === typeof a
    && 'number' === typeof b
}

function compareFunc(a, b) {
  return funcToString.call(a) === funcToString.call(b)
}

function arrayEqls(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  if (a.length !== b.length) return false

  return a.every(function (e, i) { return eqls(e, b[i]) })
}

function dateEqls(a, b) {
  return (isDate(a) && isDate(b)) && +a === +b
}

function matchingNumberOrString(a, b) {
  return noAndSt(a, b) && (Number(a) === Number(b) || String(a) === String(b))
}

function objectEqls(a, keysOfA, b, keysOfB) {
  return keysOfB.every(function (key) {
    return ~keysOfA.indexOf(key) && eqls(a[key], b[key])
  })
}

exports.deep = eqls
function eqls(a, b) {
  if (tripleEquals(a, b)) return true
  if (matchingNumberOrString(a, b)) return true
  if (typeof a !== typeof b) return false
  if (isDate(a) && isDate(b)) return +a === +b

  if (arrayEqls(a, b)) return true


  if (isObj(a) && isObj(b)) {
    var aKeys = recKeys(a)
    var bKeys = recKeys(b)
    if (aKeys.length !== bKeys.length) return false
    return objectEqls(a, aKeys, b, bKeys)
  }

  if (isFunc(a) && isFunc(b)) return compareFunc(a, b)

  return false
}

var slice = Array.prototype.slice

function arrayContains(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;

  var matched = false
  var aCopy = slice.call(a)
  var bCopy = slice.call(b)

  if (aCopy.length === 0 && bCopy.length === 0)
    return true;

  while (bCopy.length > 0) {
    var comparingItem = bCopy.shift()

    var i = 0;
    matched = false
    do {
      ++i;

      if (contains(comparingItem, aCopy[i])) {
        aCopy.splice(i, 1)
        matched = true
      }

    } while (matched === false || ++i === a.length)

    if (i === a.length && matched === false) return false
  }

  return true
}

exports.contains = contains
exports.includes = contains

// compares a given object `b` by asserting it has all the
// properties matching `a`
function contains(a, b) {
  if (tripleEquals(a, b)) return true
  if (matchingNumberOrString(a, b)) return true
  if (typeof a !== typeof b) return false
  if (dateEqls(a, b)) return true

  if (arrayContains(a, b)) return true

  if (isObj(a) && isObj(b))
    return compareObject(a, b)

  if (isFunc(a) && isFunc(b)) return compareFunc(a, b)

  return false
}

function compareObject(a, b) {
  if (a == null) return a === b;

  return recKeys(b).every(function (key) {
    return a[key] && contains(a[key], b[key])
  })
}
