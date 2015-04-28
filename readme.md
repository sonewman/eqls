# eqls
### install:
```bash
$ npm install eqls
```

### Usage:
Check two objects/values to see if they deeply equal:
```javascript
eqls('a', 'a') // => true
eqls('a', 'b') // => false
eqls(function () { return true }, function () { return true }) // => true
eqls(function () { return true }, function () { return false }) // => false
eqls({ a: 1 }, { a: 1 }) // => true
eqls({ a: 1 }, { a: 2 }) // => false
eqls({ a: 1 }, { a: 1, b: 2 }) // => false
eqls(1, '1') // => true
eqls('1', 1) // => true
eqls(Number('a'), Number('b')) // => false
eqls(1, Number('a')) // =>
eqls([1, 2, 3], [1, 2, 3]) // => true
eqls([1, 2, 3, 4], [1, 2, 3]) // => false
eqls([1, 2, 3], [4, 5, 6]) // => false
eqls(new Date('10:23 09/21/2014'), new Date('10:23 09/21/2014')) // => true
eqls(new Date('10:23 09/21/2014'), new Date('10:23:01 09/21/2014')) // => false
eqls({}, 1) // => false
```
