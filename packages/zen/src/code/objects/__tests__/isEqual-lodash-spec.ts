// Based on https://github.com/lodash/lodash/blob/main/test/isEqual.spec.js b5c5931
// - Logic & tests kept almost intact
// - Increased granularity of describe/it tests where needed
// - Changed to mocha / chai
// - Tests run in both 'Zen z.isEqual' : 'Lodash _.isEqual'
//    - All differences are marked with '### z.isEqual DIFFERENT: xxx' - these are potentially BREAKING CHANGES, if you plan to use Zen z.isEqual as a drop in replacement of Lodash _.isEqual

import * as chai from 'chai'
import * as _ from 'lodash'
import * as z from '../../index'
import { toStringSafe } from '../../utils'

const { expect } = chai
// const root = (typeof global === 'object' && global) || this; // window?
const root = global || this
const map = new Map()

_.each([_.isEqual, z.isEqual], (isEqual) => {
  const isZisEqual = isEqual === z.isEqual

  describe(`Lodash'es isEqual tests, both against Lodash & Zen: ${
    isZisEqual ? 'Zen z.isEqual' : 'Lodash _.isEqual'
  }`, () => {
    const symbol1 = Symbol('a')
    const symbol2 = Symbol('b')

    describe('should compare primitives', () => {
      const pairs = [
        [1, 1, true],
        [1, Object(1), true, false], // ### z.isEqual DIFFERENT @todo: implement options.unbox or similar for this case
        [1, '1', false],
        [1, 2, false],
        [-0, -0, true],
        [0, 0, true],
        [0, Object(0), true, false], // ### z.isEqual DIFFERENT @todo(151): implement options.unbox or similar for these weird cases
        [Object(0), Object(0), true],
        [-0, 0, true],
        [0, '0', false],
        [0, null, false],
        [NaN, NaN, true],
        [NaN, Object(NaN), true, false], // ### z.isEqual DIFFERENT @todo(151): implement options.unbox or similar for these weird cases
        [Object(NaN), Object(NaN), true],
        [NaN, 'a', false],
        [NaN, Infinity, false],
        ['a', 'a', true],
        ['a', Object('a'), true, false], // ### z.isEqual DIFFERENT @todo(151): implement options.unbox or similar for these weird cases
        [Object('a'), Object('a'), true],
        ['a', 'b', false],
        ['a', ['a'], false],
        [true, true, true],
        [true, Object(true), true, false], // ### z.isEqual DIFFERENT @todo(151): implement options.unbox or similar for these weird cases
        [Object(true), Object(true), true],
        [true, 1, false],
        [true, 'a', false],
        [false, false, true],
        [false, Object(false), true, false], // ### z.isEqual DIFFERENT @todo(151): implement options.unbox or similar for these weird cases
        [Object(false), Object(false), true],
        [false, 0, false],
        [false, '', false],
        [symbol1, symbol1, true],
        [Symbol('aaaa'), Symbol('aaaa'), false],
        [Symbol.for('unique'), Symbol.for('unique'), true],
        // [symbol1, Object(symbol1), true], // breaks toStringSafe() coercion in `it(descr)`
        // [Object(symbol1), Object(symbol1), true],
        [symbol1, symbol2, false],
        [null, null, true],
        [null, undefined, false],
        [null, {}, false],
        [null, '', false],
        [undefined, undefined, true],
        [undefined, null, false],
        [undefined, '', false],
      ]

      _.each(pairs, ([a, b, expected, zenExpectedIfDifferent]) =>
        it(`a: ${toStringSafe(a)}, b: ${toStringSafe(b)} => ${expected} ${zenExpectedIfDifferent === undefined ? '' : '### z.isEqual DIFFERENT: ' + zenExpectedIfDifferent}`, () => {
          expected =
            isZisEqual && zenExpectedIfDifferent !== undefined
              ? zenExpectedIfDifferent
              : expected
          expect(isEqual(a, b)).to.equal(expected)
        })
      )

      it(`Symbol & Object(Symbol) => true ### z.isEqual DIFFERENT: false`, () => {
        const result = isEqual(symbol1, Object(symbol1))
        if (isZisEqual) expect(result).to.be.false
        else expect(result).to.be.true
      })
      it(`Object(Symbol) & Object(Symbol) => true`, () => {
        expect(isEqual(Object(symbol1), Object(symbol1))).to.be.true
      })
    })

    describe('should compare arrays', () => {
      let array1: any[]
      let array2: any[]

      it('should compare arrays with identical values', () => {
        array1 = [true, null, 1, 'a', undefined]
        array2 = [true, null, 1, 'a', undefined]
        expect(isEqual(array1, array2)).to.be.true
      })

      it('should compare arrays with identical values #2', () => {
        array1 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { e: 1 }]
        array2 = [[1, 2, 3], new Date(2012, 4, 23), /x/, { e: 1 }]

        expect(isEqual(array1, array2)).to.be.true
      })
      // ### z.isEqual DIFFERENT
      it('should equal with sparse arrays & ones with undefined in its place ### z.isEqual DIFFERENT (false): will work in future with `options.sparse` or something', () => {
        array1 = [1]
        array1[2] = 3

        array2 = [1]
        array2[1] = undefined
        array2[2] = 3

        // const result = isZisEqual ? isEqual(array1, array2, { sparse: true }) : isEqual(array1, array2)
        // expect(result).to.be.true

        const result = isEqual(array1, array2)
        if (isZisEqual) expect(result).to.be.false
        else expect(result).to.be.true
      })

      // ### z.isEqual DIFFERENT
      it('should compare Object wrapped values: ### z.isEqual DIFFERENT (false): will change in future with `options.valueOf`', () => {
        array1 = [
          Object(1),
          false,
          Object('a'),
          /x/,
          new Date(2012, 4, 23),
          ['a', 'b', [Object('c')]],
          { a: 1 },
        ]
        array2 = [
          1,
          Object(false),
          'a',
          /x/,
          new Date(2012, 4, 23),
          ['a', Object('b'), ['c']],
          { a: 1 },
        ]

        // const result = isZisEqual ? isEqual(array1, array2, { valueOf: true }) : isEqual(array1, array2)
        // expect(result).to.be.true
        const result = isEqual(array1, array2)
        if (isZisEqual) expect(result).to.be.false
        else expect(result).to.be.true
      })

      it('should fail arrays if different', () => {
        array1 = [1, 2, 3]
        array2 = [3, 2, 1]

        expect(isEqual(array1, array2)).to.be.false
      })

      it('should fail arrays of different length', () => {
        array1 = [1, 2]
        array2 = [1, 2, 3]

        expect(isEqual(array1, array2)).to.be.false
      })

      it('should compare sparse arrays ### z.isEqual DIFFERENT sparse arrays are strict & respected for their actual indexes', () => {
        const array = Array(1)
        expect(isEqual(array, Array(1))).to.be.true

        let result = isEqual(array, [undefined])
        if (isZisEqual)
          expect(result).to.be.false // DIFFERENT
        else expect(result).to.be.true

        result = isEqual(array, Array(2))
        if (isZisEqual)
          expect(result).to.be.true // DIFFERENT
        else expect(result).to.be.false
      })
    })

    it('should treat arrays with identical values but different non-index properties as equal', () => {
      let array1 = [1, 2, 3]
      let array2 = [1, 2, 3]

      // @ts-ignore
      // prettier-ignore
      array1.every = array1.filter = array1.forEach = array1.indexOf = array1.lastIndexOf = array1.map = array1.some = array1.reduce = array1.reduceRight = null

      // @ts-ignore
      // prettier-ignore
      array2.concat = array2.join = array2.pop = array2.reverse = array2.shift = array2.slice = array2.sort = array2.splice = array2.unshift = null

      expect(isEqual(array1, array2)).to.be.true

      array1 = [1, 2, 3]
      // @ts-ignore
      array1.a = 1

      array2 = [1, 2, 3]
      // @ts-ignore
      array2.b = 1

      expect(isEqual(array1, array2)).to.be.true

      // @ts-ignore
      array1 = /c/.exec('abcde')
      // @ts-ignore
      array2 = ['c']

      expect(isEqual(array1, array2)).to.be.true
    })

    it('should compare plain objects', () => {
      let object1: Record<any, any> = {
        a: true,
        b: null,
        c: 1,
        d: 'a',
        e: undefined,
      }
      let object2: Record<any, any> = {
        a: true,
        b: null,
        c: 1,
        d: 'a',
        e: undefined,
      }

      expect(isEqual(object1, object2)).to.be.true

      object1 = { a: [1, 2, 3], b: new Date(2012, 4, 23), c: /x/, d: { e: 1 } }
      object2 = { a: [1, 2, 3], b: new Date(2012, 4, 23), c: /x/, d: { e: 1 } }

      expect(isEqual(object1, object2)).to.be.true

      object1 = { a: 1, b: 2, c: 3 }
      object2 = { a: 3, b: 2, c: 1 }

      expect(isEqual(object1, object2)).to.be.false

      object1 = { a: 1, b: 2, c: 3 }
      object2 = { d: 1, e: 2, f: 3 }

      expect(isEqual(object1, object2)).to.be.false

      object1 = { a: 1, b: 2 }
      object2 = { a: 1, b: 2, c: 3 }

      expect(isEqual(object1, object2)).to.be.false
    })

    it('should compare objects regardless of key order', () => {
      const object1 = { a: 1, b: 2, c: 3 }
      const object2 = { c: 3, a: 1, b: 2 }

      expect(isEqual(object1, object2)).to.be.true
    })
    ;(isZisEqual ? it.skip : it)(
      'should compare nested objects - ### z.isEqual DIFFERENT fails cause of Object() wrapped objects',
      () => {
        const object1 = {
          a: [1, 2, 3],
          b: true,
          c: Object(1),
          d: 'a',
          e: {
            f: ['a', Object('b'), 'c'],
            g: Object(false),
            h: new Date(2012, 4, 23),
            i: _.noop,
            j: 'a',
          },
        }

        const object2 = {
          a: [1, Object(2), 3],
          b: Object(true),
          c: 1,
          d: Object('a'),
          e: {
            f: ['a', 'b', 'c'],
            g: false,
            h: new Date(2012, 4, 23),
            i: _.noop,
            j: 'a',
          },
        }

        expect(isEqual(object1, object2)).to.be.true
      }
    )

    describe('should compare object instances (Function constructor)', () => {
      function Foo() {
        this.a = 1
      }

      Foo.prototype.a = 1

      function Bar() {
        this.a = 1
      }

      Bar.prototype.a = 2

      it('should be equal for instances with identical properties & same class', () =>
        expect(isEqual(new Foo(), new Foo())).to.be.true)

      it('should NOT be equal for instances with identical properties & different class', () =>
        expect(isEqual(new Foo(), new Bar())).to.be.false)

      it(`should NOT be equal for POJSO against instance`, () =>
        expect(isEqual({ a: 1 }, new Foo())).to.be.false)

      it(`should NOT be equal for POJSO against instance, even with same prototype`, () =>
        expect(isEqual({ a: 2 }, new Bar())).to.be.false)
    })

    it('should compare objects with constructor properties', () => {
      expect(isEqual({ constructor: 1 }, { constructor: 1 })).to.be.true
      expect(isEqual({ constructor: 1 }, { constructor: '1' })).to.be.false
      expect(isEqual({ constructor: [1] }, { constructor: [1] })).to.be.true
      expect(isEqual({ constructor: [1] }, { constructor: ['1'] })).to.be.false
      expect(isEqual({ constructor: Object }, {})).to.be.false
    })

    describe('circular references', () => {
      it('should compare arrays with circular references', () => {
        let array1: any[] = []
        let array2: any[] = []

        array1.push(array1)
        array2.push(array2)

        expect(isEqual(array1, array2)).to.be.true

        array1.push('b')
        array2.push('b')

        expect(isEqual(array1, array2)).to.be.true

        array1.push('c')
        array2.push('d')

        expect(isEqual(array1, array2)).to.be.false

        array1 = ['a', 'b', 'c']
        array1[1] = array1
        array2 = ['a', ['a', 'b', 'c'], 'c']

        expect(isEqual(array1, array2)).to.be.false
      })

      it('should have transitive equivalence for circular references of arrays', () => {
        const array1: any[] = []
        const array2: any[] = [array1]
        const array3: any[] = [array2]

        array1[0] = array1

        expect(isEqual(array1, array2)).to.be.true
        expect(isEqual(array2, array3)).to.be.true
        expect(isEqual(array1, array3)).to.be.true
      })

      // @todo(818): fix this
      it('should compare objects with circular references', () => {
        let object1: Record<any, any> = {}
        let object2: Record<any, any> = {}

        object1.a = object1
        object2.a = object2

        expect(isEqual(object1, object2)).to.be.true

        object1.b = 0
        // lodash tests for Zen: changed from
        //        object2.b = Object(0)
        // to this (with unbox: true)
        object2.b = new Number(0)

        expect(isEqual(object1, object2, { unbox: true })).to.be.true

        object1.b = new Number(0) // change so we don`t need `unbox` further on

        // lodash tests for Zen: changed from
        // object1.c = Object(1)
        // object2.c = Object(2)
        //      to
        object1.c = new Number(1)
        object2.c = new Number(2)

        expect(isEqual(object1, object2)).to.be.false

        object1 = { a: 1, b: 2, c: 3 }
        object1.b = object1
        object2 = { a: 1, b: { a: 1, b: 2, c: 3 }, c: 3 }

        expect(isEqual(object1, object2)).to.be.false
      })

      it('should have transitive equivalence for circular references of objects', () => {
        const object1: Record<any, any> = {}
        const object2: Record<any, any> = { a: object1 }
        const object3: Record<any, any> = { a: object2 }

        object1.a = object1

        expect(isEqual(object1, object2)).to.be.true
        expect(isEqual(object2, object3)).to.be.true
        expect(isEqual(object1, object3)).to.be.true
      })

      it('should compare objects with multiple circular references', () => {
        const array1: any[] = [{}]
        const array2: any[] = [{}]

        ;(array1[0].a = array1).push(array1)
        ;(array2[0].a = array2).push(array2)

        expect(isEqual(array1, array2)).to.be.true

        // lodash tests for Zen: changed from
        //       array1[0].b = 0
        //       array2[0].b = Object(0)
        // to
        array1[0].b = 0
        array2[0].b = new Number(0)

        expect(isEqual(array1, array2, { unbox: true })).to.be.true

        // lodash tests for Zen: changed from
        //         array1[0].c = Object(1)
        //         array2[0].c = Object(2)
        // to
        array1[0].c = new Number(1)
        array2[0].c = new Number(2)

        expect(isEqual(array1, array2)).to.be.false
      })

      it('should compare objects with complex circular references', () => {
        const object1: Record<any, any> = {
          foo: { b: { c: { d: {} } } },
          bar: { a: 2 },
        }

        const object2: Record<any, any> = {
          foo: { b: { c: { d: {} } } },
          bar: { a: 2 },
        }

        object1.foo.b.c.d = object1
        object1.bar.b = object1.foo.b

        object2.foo.b.c.d = object2
        object2.bar.b = object2.foo.b

        expect(isEqual(object1, object2)).to.be.true
      })

      it('should compare objects with shared property values', () => {
        const object1: Record<any, any> = {
          a: [1, 2],
        }

        const object2 = {
          a: [1, 2],
          b: [1, 2],
        }

        object1.b = object1.a

        expect(isEqual(object1, object2)).to.be.true
      })
    })

    it('should treat objects created by `Object.create(null)` like plain objects', () => {
      function Foo() {
        this.a = 1
      }

      Foo.prototype.constructor = null

      const object1: Record<any, any> = Object.create(null)
      object1.a = 1

      const object2 = { a: 1 }

      expect(isEqual(object1, object2)).to.be.true
      expect(isEqual(new Foo(), object2)).to.be.false
    })

    it('should avoid common type coercions', () => {
      expect(isEqual(true, Object(false))).to.be.false
      expect(isEqual(Object(false), Object(0))).to.be.false
      expect(isEqual(false, Object(''))).to.be.false
      expect(isEqual(Object(36), Object('36'))).to.be.false
      expect(isEqual(0, '')).to.be.false
      expect(isEqual(1, true)).to.be.false
      expect(isEqual(1337756400000, new Date(2012, 4, 23))).to.be.false
      expect(isEqual('36', 36)).to.be.false
      expect(isEqual(36, '36')).to.be.false
    })

    it('should compare `arguments` objects', () => {
      const args1 = (function () {
        return arguments
      })()
      const args2 = (function () {
        return arguments
      })()
      const args3 = (function (...args: any[]) {
        return arguments
      })(1, 2)

      expect(isEqual(args1, args2)).to.be.true
      expect(isEqual(args1, args3)).to.be.false
    })

    it('should treat `arguments` objects like `Object` objects', () => {
      const object = { 0: 1, 1: 2, 2: 3 }
      const args = (function (...args: any[]) {
        return arguments
      })(1, 2, 3)

      function Foo() {}

      Foo.prototype = object

      expect(isEqual(args, object)).to.be.true
      expect(isEqual(object, args)).to.be.true
      expect(isEqual(args, new Foo())).to.be.false
      expect(isEqual(new Foo(), args)).to.be.false
    })

    it('should compare array buffers', () => {
      if (ArrayBuffer) {
        const buffer = new Int8Array([-1]).buffer

        expect(isEqual(buffer, new Uint8Array([255]).buffer)).to.be.true
        expect(isEqual(buffer, new ArrayBuffer(1))).to.be.false
      }
    })

    // @todo(213): fix this (missing arrayViews data)
    // it.only('should compare array views', () => {
    //   _.times(2, (index) => {
    //     const ns = index ? realm : root
    //
    //     const pairs = _.map(arrayViews, (type, viewIndex) => {
    //       const otherType = arrayViews[(viewIndex + 1) % arrayViews.length]
    //       const CtorA =
    //         ns[type] ||
    //         function (n) {
    //           this.n = n
    //         }
    //       const CtorB =
    //         ns[otherType] ||
    //         function (n) {
    //           this.n = n
    //         }
    //       const bufferA = ns[type] ? new ns.ArrayBuffer(8) : 8
    //       const bufferB = ns[otherType] ? new ns.ArrayBuffer(8) : 8
    //       const bufferC = ns[otherType] ? new ns.ArrayBuffer(16) : 16
    //
    //       return [new CtorA(bufferA), new CtorA(bufferA), new CtorB(bufferB), new CtorB(bufferC)]
    //     })
    //
    //     const expected = _.map(pairs, _.constant([true, false, false]))
    //
    //     const actual = _.map(pairs, (pair) => [
    //       isEqual(pair[0], pair[1]),
    //       isEqual(pair[0], pair[2]),
    //       isEqual(pair[2], pair[3]),
    //     ])
    //
    //     expect(actual).to.equal(expected)
    //   })
    // })

    it('should compare buffers - MODIFIED Buffer.alloc([1]) FROM LODASH', () => {
      if (Buffer) {
        const buffer = Buffer.alloc(1, 'a')
        expect(isEqual(buffer, Buffer.alloc(1, 'a'))).to.be.true
        expect(isEqual(buffer, Buffer.alloc(1, 'b'))).to.be.false
        expect(isEqual(buffer, new Uint8Array([1]))).to.be.false
      }
    })

    it('should compare date objects', () => {
      const date = new Date(2012, 4, 23)

      expect(isEqual(date, new Date(2012, 4, 23))).to.be.true
      expect(isEqual(new Date('a'), new Date('b'))).to.be.true
      expect(isEqual(date, new Date(2013, 3, 25))).to.be.false
      expect(isEqual(date, { getTime: _.constant(+date) })).to.be.false
    })

    // SKIP cause root is missing
    it.skip('should compare error objects', () => {
      const pairs = _.map(
        [
          'Error',
          'EvalError',
          'RangeError',
          'ReferenceError',
          'SyntaxError',
          'TypeError',
          'URIError',
        ],
        (type, index, errorTypes) => {
          const otherType = errorTypes[++index % errorTypes.length]
          const CtorA = root[type]
          const CtorB = root[otherType]

          return [new CtorA('a'), new CtorA('a'), new CtorB('a'), new CtorB('b')]
        }
      )

      const expected = _.map(pairs, _.constant([true, false, false]))

      const actual = _.map(pairs, (pair) => [
        isEqual(pair[0], pair[1]),
        isEqual(pair[0], pair[2]),
        isEqual(pair[2], pair[3]),
      ])

      expect(actual).to.equal(expected)
    })

    it('should compare functions', () => {
      function a() {
        return 1 + 2
      }

      function b() {
        return 1 + 2
      }

      expect(isEqual(a, a)).to.be.true
      expect(isEqual(a, b)).to.be.false
    })

    if (typeof Map === undefined) describe('Map NOT supported - skipped tests', () => {})
    else
      it('should compare Maps', () => {
        _.each(
          [
            [map, new Map()],
            // [map, realm.map],
          ],
          (maps) => {
            const map1 = maps[0]
            const map2 = maps[1]

            map1.set('a', 1)
            map2.set('b', 2)
            expect(isEqual(map1, map2)).to.be.false

            map1.set('b', 2)
            map2.set('a', 1)
            expect(isEqual(map1, map2)).to.be.true

            map1.delete('a')
            map1.set('a', 1)
            expect(isEqual(map1, map2)).to.be.true

            map2.delete('a')
            expect(isEqual(map1, map2)).to.be.false

            map1.clear()
            map2.clear()
          }
        )
      })

    if (typeof Map === undefined) describe('Map NOT supported - skipped tests', () => {})
    else
      it('should compare Maps with circular references', () => {
        // Zen: added some nested values
        const map1 = new Map<any, any>([
          ['foo', { aNumber: 11 }],
          ['bar', [{ nested: { value: 22 } }]],
        ])
        const map2 = new Map<any, any>([
          ['foo', { aNumber: 11 }],
          ['bar', [{ nested: { value: 22 } }]],
        ])

        map1.set('a', map1)
        map2.set('a', map2)
        expect(isEqual(map1, map2)).to.be.true

        // Zen: added crossRefs
        map1.set('crossRefs', map2)
        map2.set('crossRefs', map1)
        expect(isEqual(map1, map2)).to.be.true

        map1.set('b', 1)
        map2.set('b', 2)
        expect(isEqual(map1, map2)).to.be.false
      })

    it('should compare promises by reference', () => {
      // if (promise) {
      _.each(
        [
          [Promise.resolve(1), Promise.resolve(1)],
          // [promise, realm.promise],
        ],
        (promises) => {
          const promise1 = promises[0]
          const promise2 = promises[1]

          expect(isEqual(promise1, promise2)).to.be.false
          expect(isEqual(promise1, promise1)).to.be.true
        }
      )
      // }
    })

    it('should compare regexes', () => {
      expect(isEqual(/x/gim, /x/gim)).to.be.true
      expect(isEqual(/x/gim, /x/gim)).to.be.true
      expect(isEqual(/x/gi, /x/g)).to.be.false
      expect(isEqual(/x/, /y/)).to.be.false
      expect(
        isEqual(/x/g, {
          global: true,
          ignoreCase: false,
          multiline: false,
          source: 'x',
        })
      ).to.be.false
    })

    if (typeof Set === undefined) describe('Set NOT supported - skipped tests', () => {})
    else
      it('should compare Sets', () => {
        _.each(
          [
            [new Set(), new Set()],
            // [set, realm.set],
          ],
          (sets) => {
            const set1 = sets[0]
            const set2 = sets[1]

            set1.add(1)
            set2.add(2)
            expect(isEqual(set1, set2)).to.be.false

            set1.add(2)
            set2.add(1)
            expect(isEqual(set1, set2)).to.be.true

            set1.delete(1)
            set1.add(1)
            expect(isEqual(set1, set2)).to.be.true

            set2.delete(1)
            expect(isEqual(set1, set2)).to.be.false

            set1.clear()
            set2.clear()
          }
        )
      })

    it('should compare Sets with circular references', () => {
      const set1 = new Set()
      const set2 = new Set()

      set1.add(set1)
      set2.add(set2)
      expect(isEqual(set1, set2)).to.be.true

      // // Zen: added crossRefs
      // set1.add(set2)
      // set2.add(set1)
      // expect(isEqual(set1, set2)).to.be.true

      // set1.add(1)
      // set2.add(2)
      // expect(isEqual(set1, set2)).to.be.false
    })

    if (typeof Symbol === undefined) describe('Symbol NOT supported - skipped tests', () => {})
    else
      describe('should compare symbol properties ### z.isEqual DIFFERENT', () => {
        let object1 = {}
        let object2 = {}

        before(() => {
          object1[symbol1] = { a: { b: 2 } }
          object2[symbol1] = { a: { b: 2 } }

          Object.defineProperty(object2, symbol2, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: 2,
          })
        })

        it('should compare symbol properties', () =>
          expect(isEqual(object1, object2)).to.be.true)

        it('should fail if symbol properties are different: ### z.isEqual DIFFERENT - returns true, cause `options.symbol: false`', () => {
          object2[symbol1] = { a: 1 }

          const result = isEqual(object1, object2)
          if (isZisEqual) expect(result).to.be.true
          else expect(result).to.be.false
        })

        if (isZisEqual)
          it('### z.isEqual DIFFERENT should fail if symbol properties are different: only with `options.symbol: true`', () => {
            object2[symbol1] = { a: 1 }
            expect(isEqual(object1, object2, { symbol: true })).to.be.false
          })

        it('should fail if extra symbol properties: ### z.isEqual DIFFERENT - returns true, cause `options.symbol: false`', () => {
          delete object2[symbol1]
          object2[Symbol('anotherSymbol')] = { a: { b: 2 } }

          const result = isEqual(object1, object2)
          if (isZisEqual) expect(result).to.be.true
          else expect(result).to.be.false
        })

        if (isZisEqual)
          it('### z.isEqual DIFFERENT should fail if symbol properties are different: only with `options.symbol: true`', () => {
            delete object2[symbol1]
            expect(isEqual(object1, object2, { symbol: true })).to.be.false
          })
      })

    it.skip('should compare wrapped values', () => {
      const stamp = +new Date()

      const values = [
        [
          [1, 2],
          [1, 2],
          [1, 2, 3],
        ],
        [true, true, false],
        [new Date(stamp), new Date(stamp), new Date(stamp - 100)],
        [
          { a: 1, b: 2 },
          { a: 1, b: 2 },
          { a: 1, b: 1 },
        ],
        [1, 1, 2],
        [NaN, NaN, Infinity],
        [/x/, /x/, /x/i],
        ['a', 'a', 'A'],
      ]

      _.each(values, (vals) => {
        let wrapped1 = _(vals[0])
        let wrapped2 = _(vals[1])
        let actual = wrapped1.isEqual(wrapped2)

        expect(actual).to.be.true
        expect(isEqual(_(actual), _(true))).to.be.true

        wrapped1 = _(vals[0])
        wrapped2 = _(vals[2])

        actual = wrapped1.isEqual(wrapped2)
        expect(actual).to.be.false
        expect(isEqual(_(actual), _(false))).to.be.true
      })
    })

    it.skip('should compare wrapped and non-wrapped values', () => {
      let object1 = _({ a: 1, b: 2 })
      let object2 = { a: 1, b: 2 }

      expect(object1.isEqual(object2)).to.be.true
      expect(isEqual(object1, object2)).to.be.true

      object1 = _({ a: 1, b: 2 })
      object2 = { a: 1, b: 1 }

      expect(object1.isEqual(object2)).to.be.false
      expect(isEqual(object1, object2)).to.be.false
    })

    it('should work as an iteratee for `_.every`', () => {
      const actual = _.every([1, 1, 1], _.partial(isEqual, 1))
      expect(actual)
    })

    // @todo: enable DOM libs
    // it('should not error on DOM elements', () => {
    //   if (document) {
    //     const element1 = document.createElement('div')
    //     const element2 = element1.cloneNode(true)
    //
    //     try {
    //       expect(isEqual(element1, element2)).to.be.false
    //     } catch (e) {
    //       expect(false, e.message)
    //     }
    //   }
    // })

    // it('should return `true` for like-objects from different documents', () => {
    //   if (realm.object) {
    //     expect(isEqual([1], realm.array)).to.be.true
    //     expect(isEqual([2], realm.array)).to.be.false
    //     expect(isEqual({ a: 1 }, realm.object)).to.be.true
    //     expect(isEqual({ a: 2 }, realm.object)).to.be.false
    //   }
    // })

    // it('should return `false` for objects with custom `toString` methods', () => {
    //   let primitive
    //   const object = {
    //     toString: function () {
    //       return primitive
    //     },
    //   }
    //   const values = [true, null, 1, 'a', undefined]
    //   const expected = _.map(values, stubFalse)
    //
    //   const actual = _.map(values, (value) => {
    //     primitive = value
    //     return isEqual(object, value)
    //   })
    //
    //   expect(actual).to.equal(expected)
    // })

    it.skip('should return an unwrapped value when implicitly chaining', () => {
      expect(_('a').isEqual('a')).to.be.true
    })

    it.skip('should return a wrapped value when explicitly chaining', () => {
      expect(_('a').chain().isEqual('a') instanceof _)
    })
  })
})
