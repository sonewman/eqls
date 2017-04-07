var describe = require('macchiato')
var eqls = require('.')

describe('deepEquals(\'a\', \'a\')')
.it('should return true with two matching strings', function (t) {
  t.assert(eqls('a', 'a'))
  t.end()
})
.it('should return false if not equal', function (t) {
  t.false(eqls('a', 'b'))
  t.end()
})
.it('should return true with two identical functions', function (t) {
  t.assert(eqls(function () { return true }, function () { return true }))
  t.end()
})
.it('should return false with two different functions', function (t) {
  t.false(eqls(function () { return true }, function () { return false }))
  t.end()
})
.it('should return true with two matching objects', function (t) {
  t.assert(eqls({ a: 1 }, { a: 1 }))
  t.end()
})
.it('should return false with two different objects', function (t) {
  t.false(eqls({ a: 1 }, { a: 2 }))
  t.end()
})
.it('should return false with two different objects with a different number of keys', function (t) {
  t.false(eqls({ a: 1 }, { a: 1, b: 2 }))
  t.end()
})
.it('should return true with a string and number of equal value', function (t) {
  t.assert(eqls(1, '1'))
  t.end()
})
.it('should return true with a number and string of equal value', function (t) {
  t.assert(eqls('1', 1))
  t.end()
})
.it('should return true two NaN values', function (t) {
  t.assert(eqls(Number('a'), Number('b')))
  t.end()
})
.it('should return false with number value and NaN', function (t) {
  t.false(eqls(1, Number('a')))
  t.end()
})
.it('should return true with two arrays containing equal values', function (t) {
  t.assert(eqls([1, 2, 3], [1, 2, 3]))
  t.end()
})
.it('should return false with two arrays similar values one shorter than the next', function (t) {
  t.false(eqls([1, 2, 3, 4], [1, 2, 3]))
  t.end()
})
.it('should return false with two same length arrays with different values', function (t) {
  t.false(eqls([1, 2, 3], [4, 5, 6]))
  t.end()
})
.it('should return true with two dates of equal value', function (t) {
  t.assert(eqls(new Date('10:23 09/21/2014'), new Date('10:23 09/21/2014')))
  t.end()
})
.it('should return false with two dates of different values', function (t) {
  t.false(eqls(new Date('10:23 09/21/2014'), new Date('10:23:01 09/21/2014')))
  t.end()
})
.it('should return false an object and a number value', function (t) {
  t.false(eqls({}, 1))
  t.end()
})

describe('contains(a, b)`')
.it('should check that the first arg contains attributes defined in second arg', function (t) {
  t.true(eqls.contains({ a: 1, b: 2 }, { a: 1 }))
  t.end();
})
.it('should fail if first arg doesn\'t contain all of second arg\'s attributes', function (t) {
  t.false(eqls.contains({ a: 1 }, { a: 1, b: 2 }))
  t.end();
})
.it('should check that the first arg contains attributes defined in second arg', function (t) {
  t.true(eqls.contains({ a: 1, b: { a: 1, b: 2} }, { a: 1, b: { b: 2 } }))
  t.end();
})
.it('should check that the first arg contains attributes defined in second arg', function (t) {
  t.true(eqls.contains([{ a: 1 }, { b: { a: 1, b: 2} }, { a: 1, b: { b: 2 } }], [{ a: 1, b: { b: 2 } }]))
  t.end();
})
