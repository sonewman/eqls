module.exports = exports = eqls

var funcToString = Function.prototype.toString
var funcToObj = Object.prototype.toString

function isDate(obj) { return funcToObj.call(obj) === '[object Date]' }
function isFunc(obj) { return 'function' === typeof obj }
function isObj(obj) { return 'object' === typeof obj }
function isNum(n) { return 'number' === typeof n }
function isStr(s) { return 'string' === typeof s }

function checkNaN(a, b) {
  return (isNum(a) && isNum(b)) ? (isNaN(a) && isNaN(b)) : false
}

function Context(a, b) {
  this.status = null
  this.reason = ''
  this.expected = a
  this.actual = b
  this.keys = []
  this.failures = []
}

function Failure(keys, a, b, reason) {
  this.keys = keys.slice()
  this.expected = b
  this.actual = a
  this.reason = reason || ''
}

Context.prototype.setState = function (status, a, b, reason) {
  this.status = status
  this.reason = reason || ''

  if (status === false) {
    this.failures.push(new Failure(this.keys, a, b, reason))
  }

  return this
}

Context.prototype.setKey = function (key) {
  this.keys.push(key)
  return this
}

Context.prototype.popKey = function () {
  this.keys.pop()
  return this
}

Context.prototype.ignoreFailures = function (n) {
  for (var i = 0; i < n; ++i) this.failures.pop()
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

function arrayEqls(a, b, c) {
  if (a.length !== b.length) {
    return c.setState(
      false,
      a,
      b,
      'array lengths are no equal (' + a.length + ' !== ' + b.length + ')'
    )
  }

  a.every(function (e, i) { return eqls_(e, b[i], c) })
  return c
}

function dateEqls(a, b) {
  return (isDate(a) && isDate(b)) && +a === +b
}

function matchingNumberOrString(a, b) {
  return noAndSt(a, b) && (Number(a) === Number(b) || String(a) === String(b))
}

function objectEqls(a, b, c) {
  var keysOfA = recKeys(a)
  var keysOfB = recKeys(b)
  if (keysOfA.length !== keysOfB.length) {
    return c.setState(false, a, b, 'object keys are not equal')
  }

  const status = keysOfB.every(function (key) {
    if (!~keysOfA.indexOf(key)) {
      return c.setState(
        false,
        a,
        b,
        'object: ' + JSON.stringify(a) + ' does not contain attribute ' + key
      )
    }

    c.setKey(key)
    eqls_(a[key], b[key], c)

    if (c.status !== false) c.popKey()
    return c.status
  })

  return c.status
}

exports.deep = eqls
function eqls(a, b) {
  var e = new Equals(a, b)
  return e.status
}

function eqls_(a, b, c) {
  c.setState(null)

  standardTypeChecks(a, b, c)

  if (c.status !== null) return c

  if (Array.isArray(a) && Array.isArray(b)) {
    return arrayEqls(a, b, c)
  }

  if (isObj(a) && isObj(b)) {
    return objectEqls(a, b, c)
  }

  if (isFunc(a) && isFunc(b)) {
    return compareFunc(a, b)
      ? c.setState(true)
      : c.setState(false, a, b, a.toString + ' is not equal to ' + b.toString())
  }

  return c
}

exports.Equals = Equals
function Equals(a, b) {
  Context.call(this, a, b)
  eqls_(a, b, this)
}

Object.setPrototypeOf(Equals.prototype, Context.prototype)

exports.contains = contains
exports.includes = contains

// compares a given object `b` by asserting it has all the
// properties matching `a`
function contains(a, b) {
  return new Contains(a, b).status
}

function standardTypeChecks(a, b, c) {
  if (tripleEquals(a, b)) {
    return c.setState(true)
  } else {

    if (isStr(a) && isStr(b)) {
      return c.setState(
        false,
        a,
        b,
        '"' + a + '" is not equal to "' + b + '"'
      )
    }
    if (isNum(a) && isNum(b)) {
      return c.setState(
        false,
        a,
        b,
        a + ' is not equal to ' + b
      )
    }
  }

  if (matchingNumberOrString(a, b)) {
    return c.setState(true)
  }

  if (typeof a !== typeof b) {
    return c.setState(
      false,
      a,
      b,
      'typeof \n'
      + JSON.stringify(a, null, 2)
      + '\n !== typeof \n'
      + JSON.stringify(b, null, 2)
    )
  }

  if (isDate(a) && isDate(b)) {
    if (+a === +b) {
      return c.setState(true)
    } else {
      return c.setState(false, a, b, 'Date ' + a + ' is not equal to ' + b)
    }
  }
}

function contains_(a, b, c) {
  c.setState(null)

  standardTypeChecks(a, b, c)

  if (c.status !== null) return c

  if (Array.isArray(a) && Array.isArray(b)) {
    return arrayContains(a, b, c)
  }

  if (isObj(a) && isObj(b)) {
    return compareObject(a, b, c)
  }

  if (isFunc(a) && isFunc(b)) {
    return compareFunc(a, b)
      ? c.setState(true)
      : c.setState(false, a, b, a.toString() + ' is not equal to ' + b.toString())
  }

  return c.setState(false, a, b, JSON.stringify(a) + ' is not equal to ' + JSON.stringify(b))
}

var slice = Array.prototype.slice

/**
 * strict array positioning
 */
//function arrayContains(a, b, c) {
//  if (a.length === 0 && b.length === 0) {
//    return c.setState(true)
//  }
//
//  var aCopy = slice.call(a)
//  var bCopy = slice.call(b)
//
//  var comparingItem
//  var child
//  for (var i = 0; i < bCopy.length; ++i) {
//    c.setKey(i)
//
//    contains_(bCopy[i], aCopy[i], c)
//
//    if (!c.status) {
//      return c.setState(
//        false,
//        'array \n'
//          + JSON.stringify(a, null, 2)
//          + ' does not contain '
//          + JSON.stringify(bCopy[i, null, 2)
//      )
//    }
//
//    c.popKey()
//  }
//
//  return c.setState(true)
//}

function arrayContains(a, b, c) {
  if (a.length === 0 && b.length === 0) {
    return c.setState(true)
  }

  var matched = false
  var aCopy = slice.call(a)
  var bCopy = slice.call(b)

  while (bCopy.length > 0) {
    var comparingItem = bCopy.shift()
    var failCount = 0
    var currentFailCount = c.failures.length

    var i = -1
    matched = false
    while (++i < aCopy.length && matched === false) {
      c.setKey(i)

      contains_(aCopy[i], comparingItem, c)

      if (c.status !== false) {
        c.setState(null)
        aCopy.splice(i, 1)
        matched = true
        c.ignoreFailures(failCount)

      } else {
        ++failCount
      }

      c.popKey()
    }

    if (matched === false) {
      return c.setState(
        false,
        a,
        b,
        'array \n'
          + JSON.stringify(a, null, 2)
          + ' does not contain '
          + JSON.stringify(comparingItem, null, 2)
      )
    } else {
      var failureDelta = c.failures.length - currentFailCount
      if (failureDelta > 0) {
        c.ignoreFailures(failureDelta)
      }
    }

  }

  return c.setState(true)
}

function compareObject(a, b, c) {
  if (a == null) {
    return a === b
      ? c.setState(true)
      : c.setState(false, a, b, a + ' value is not equal to ' + b)
  }

  const status = recKeys(b).every(function (key) {
    if (!a[key] && a[key] !== b[key]) {
      return c.setState(false, a, b,
        'property "' + key + '" is not present in object ' + JSON.stringify(a, null, 2)).status

    } else {
      c.setKey(key)
      contains_(a[key], b[key], c)

      c.popKey()
      return c.status
    }
  })

  return c.status
}

exports.Contains = Contains
function Contains(a, b) {
  Context.call(this, a, b)
  contains_(a, b, this)
}

Object.setPrototypeOf(Contains.prototype, Context.prototype)
