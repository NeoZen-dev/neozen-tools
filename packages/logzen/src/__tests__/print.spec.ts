import * as _ from 'lodash'
import * as uglifyJs from 'uglify-js'
import { getTinyLog, PrintOptions } from '../code'

// Some shims for older runtimes
import * as stringPrototypeReplaceAll from 'string.prototype.replaceall'
stringPrototypeReplaceAll.shim()

import * as hasOwn from 'object.hasown'
if (!Object.hasOwn) hasOwn.shim()

import { print } from '../code/print'
const _log = getTinyLog(false, 'print.spec')

// fixtures: also used in zen/src/code/objects/keys-spec.ts

// Class inheritance
class Person {
  constructor(public name: string) {
    this[Symbol.for('personKey')] = 'symbol key value'
  }

  toString() {
    return 'PersonToString(' + this.name + ')'
  }

  parentClassMethod(classMethodArg) {}
  parentInstanceMethod = (instanceMethodArg) => {}

  circularPerson?: Person
}

const aPerson = new Person('Angelos')
aPerson.circularPerson = aPerson

class Employee extends Person {
  childClassMethod(classMethodArg) {}
  childInstanceMethod = (instanceMethodArg) => {}
}
const anEmployee = new Employee('Elpida')

// objects & inheritance
const parentObj = {
  parentObjKey1: 1,
  parentObjKey2: 'A String',
  [Symbol.for('parentObjSymbolLabel1')]: 'parentObjSymbol1 Value',
  [Symbol.for(`parentObjSymbolLabel2 with quotes ' " and \n new line`)]:
    'parentObjSymbol2 Value',
}

const childObj = Object.create(parentObj)
childObj.childObjKey1 = 2
childObj.childObjKey2 = 'A String'
childObj[Symbol.for('childObjSymbolLabel1')] = 'childObjSymbol1 Value'
childObj[Symbol.for('childObjSymbolLabel2 with quotes \' " and \n new line')] =
  'childObjSymbol2 Value'

// functions
// prettier-ignore
const arrowFunction = (arg1) => "double quotes" + 'single quotes' + `backtick quotes`
// prettier-ignore
function normalFunction(arg1, arg2) { return "double quotes" + 'single quotes' + `backtick quotes` }
// prettier-ignore
const asyncfunction = async (arg1) => "double quotes" + 'single quotes' + `backtick quotes`
// prettier-ignore
const generatorfunction =  function* (arg1) {
  yield "double quotes" + 'single quotes' + `backtick quotes`
}

const args = (function (a, bv, c) {
  return arguments
})(1, 'foo', { prop: 'val' })

// Map & Set
const aSimpleMap = new Map()
aSimpleMap.set('aNumber', 11)
aSimpleMap.set('aString', 'Some string')
aSimpleMap.set(42, 1453)
aSimpleMap.set(Symbol(66), 777)

const complicatedMap = new Map()
complicatedMap.set({ a: 1, b: 2, [Symbol('foo')]: 'foo symbol' }, 'pojso value')
complicatedMap.set('aPerson', aPerson)
complicatedMap.set('aPersonNested', { a: aPerson })
complicatedMap.set('aPersonInSymbol', { [Symbol('person')]: aPerson })
complicatedMap.set('normalStringKey', 'stringKey value')
complicatedMap.set(Symbol('o'), 'o value symbol')
complicatedMap.set(aPerson, 'aPerson instance as key')

const simpleSet = new Set([
  11,
  'a String',
  { a: 1 },
  Symbol('foo'),
  new Date(2024, 0, 12, 13, 38, 31, 327),
])

const transform_omitSecretKeyAndHideCreditCard = (
  value: any, // the value to print
  propIdx: undefined | string | number | Symbol,
  quote: string,
  parent: undefined | any[] | Record<any, any>,
  path: string[], // eg ['person', 'name']
  type: string // eg number, string, bigint, array, object etc
) => {
  if (propIdx === 'secretKey') return false
  if (_.isArray(parent) && propIdx === 0) return false // first item of arrays

  if (propIdx === 'creditCard') return quote + '*******' + value.slice(12) + quote

  return true
}

// @todo: migrate these Specs to SpecZen, when released!
describe('print.spec', () => {
  _.each(
    <[string, PrintOptions, any, string][]>[
      // @todo(171): fix typings to be enforced
      ['A single value: number', {}, 1, '1'],
      ['A single value: string', {}, 'str', 'str'],
      ['A single value: RegExp', {}, /[A-Z]/, '/[A-Z]/'],

      // functions
      ['A single value: function', {}, arrowFunction, `'[Function: arrowFunction]'`],
      [
        'A single arrow function, with functionOrClass="body"',
        { functionOrClass: 'body' },
        arrowFunction,
        '(arg1) => "double quotes" + \'single quotes\' + `backtick quotes`',
      ],
      [
        'A single normal function with singled & double quotes, with functionOrClass="body"',
        { functionOrClass: 'body', stringify: false },
        // prettier-ignore
        function (arg1, arg2) { return "something" + 'something else' }, // @todo: replace with normalFunction
        `function (arg1, arg2) { return "something" + 'something else'; }`,
      ],
      [
        'A single normal function & double quotes, with functionOrClass="body" & stringify',
        { functionOrClass: 'body', stringify: true },
        // prettier-ignore
        function (arg1, arg2) { return "something" + 'something else' }, // @todo: replace with normalFunction
        `"function (arg1, arg2) { return \\"something\\" + 'something else'; }"`,
      ],

      // Objects
      ['An object', {}, { a: 1, b: { b1: 'str', b2: 3 } }, `{ a: 1, b: { b1: 'str', b2: 3 } }`],
      [
        'An object with maxItems & omitted: true',
        { maxProps: 3, omitted: true },
        {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
          e: 5,
        },
        `{ a: 1, b: 2, c: 3 /* OMITTED 2 object props - maxProps = 3 */ }`,
      ],
      [
        'An object with nesting',
        { nesting: true },
        { a: 1, b: { b1: 'str', b2: 3 } },
        `{\n  a: 1,\n  b: {\n    b1: 'str',\n    b2: 3\n  }\n}`,
      ],

      [
        'An object with max depth',
        {
          depth: 3,
        },
        {
          level_1: 1,
          level_1_object: {
            level_2: 2,
            level_2_object: { level_3: 3, level_3_object: { level_4: 4, level_4_object: {} } },
          },
        },
        `{ level_1: 1, level_1_object: { level_2: 2, level_2_object: { level_3: 3, level_3_object: { /* OMITTED depth = 3 */ } } } }`,
      ],

      // Instances: instanceClass printed as discriminator / prop key
      [
        'An instance object, with instanceClass printed as key',
        {},
        aPerson,
        `{ __class__: Person, name: 'Angelos', parentInstanceMethod: '[Function (anonymous)]', circularPerson: '[Circular: ~]', [Symbol.for('personKey')]: 'symbol key value' }`,
      ],
      [
        'An instance object, instanceClass turned off',
        { instanceClass: false },
        aPerson,
        `{ name: 'Angelos', parentInstanceMethod: '[Function (anonymous)]', circularPerson: '[Circular: ~]', [Symbol.for('personKey')]: 'symbol key value' }`,
      ],
      [
        'An instance object, with custom instanceClass printed as key',
        {
          instanceClass: '__kind__',
        },
        aPerson,
        `{ __kind__: Person, name: 'Angelos', parentInstanceMethod: '[Function (anonymous)]', circularPerson: '[Circular: ~]', [Symbol.for('personKey')]: 'symbol key value' }`,
      ],

      [
        'An instance object, with custom instanceClass function',
        {
          instanceClass: (instance) => `__MyClassName__: '${instance.constructor.name}'`,
        },
        aPerson,
        `{ __MyClassName__: 'Person', name: 'Angelos', parentInstanceMethod: '[Function (anonymous)]', circularPerson: '[Circular: ~]', [Symbol.for('personKey')]: 'symbol key value' }`,
      ],

      [
        'An instance object, with instanceClass printed as key, with nesting',
        {
          instanceClass: true,
          nesting: true,
        },
        aPerson,
        `{
  __class__: Person,
  name: 'Angelos',
  parentInstanceMethod: '[Function (anonymous)]',
  circularPerson: '[Circular: ~]',
  [Symbol.for('personKey')]: 'symbol key value'
}`,
      ],
      [
        'instanceClass not affecting non-instances',
        {
          instanceClass: true,
        },
        { a: 1, b: 2 },
        `{ a: 1, b: 2 }`,
      ],

      // Circular references
      [
        'Circular references',
        {
          instanceClass: true,
          nesting: true,
        },
        [{ some: { deep: { path: [0, 1, 2, { aPerson }] } } }, { aPersonAgain: aPerson }],
        `[
  {
    some: {
      deep: {
        path: [
          0,
          1,
          2,
          {
            aPerson: {
              __class__: Person,
              name: 'Angelos',
              parentInstanceMethod: '[Function (anonymous)]',
              circularPerson: '[Circular: ~0.some.deep.path.3.aPerson]',
              [Symbol.for('personKey')]: 'symbol key value'
            }
          }
        ]
      }
    }
  },
  {
    aPersonAgain: '[Circular: ~0.some.deep.path.3.aPerson]'
  }
]`,
      ],

      // Objects with inherited: true & Symbol keys
      [
        `Object with symbol keys, default symbolFormat: 'for'`,
        { nesting: true, inherited: true },
        childObj,
        `{
  childObjKey1: 2,
  childObjKey2: 'A String',
  [Symbol.for('childObjSymbolLabel1')]: 'childObjSymbol1 Value',
  [Symbol.for('childObjSymbolLabel2 with quotes \\' " and \\n new line')]: 'childObjSymbol2 Value',
  parentObjKey1: 1,
  parentObjKey2: 'A String',
  [Symbol.for('parentObjSymbolLabel1')]: 'parentObjSymbol1 Value',
  [Symbol.for('parentObjSymbolLabel2 with quotes \\' " and \\n new line')]: 'parentObjSymbol2 Value'
}`,
      ],
      [
        `Object with symbol keys, symbolFormat: none `,
        { nesting: true, inherited: true, symbolFormat: 'none' },
        childObj,
        `{
  childObjKey1: 2,
  childObjKey2: 'A String',
  [Symbol(childObjSymbolLabel1)]: 'childObjSymbol1 Value',
  [Symbol(childObjSymbolLabel2 with quotes \\' " and \\n new line)]: 'childObjSymbol2 Value',
  parentObjKey1: 1,
  parentObjKey2: 'A String',
  [Symbol(parentObjSymbolLabel1)]: 'parentObjSymbol1 Value',
  [Symbol(parentObjSymbolLabel2 with quotes \\' " and \\n new line)]: 'parentObjSymbol2 Value'
}`, // / BREAKS JS parsing cause Symbol(childObjSymbolLabel2 ...) is not a valid identifier - hard coded exception
      ],
      [
        `Object with symbol keys, symbolFormat: inside & new line & single quote `,
        { nesting: true, inherited: true, symbolFormat: 'inside' },
        childObj,
        `{
  childObjKey1: 2,
  childObjKey2: 'A String',
  [Symbol('childObjSymbolLabel1')]: 'childObjSymbol1 Value',
  [Symbol('childObjSymbolLabel2 with quotes \\' " and \\n new line')]: 'childObjSymbol2 Value',
  parentObjKey1: 1,
  parentObjKey2: 'A String',
  [Symbol('parentObjSymbolLabel1')]: 'parentObjSymbol1 Value',
  [Symbol('parentObjSymbolLabel2 with quotes \\' " and \\n new line')]: 'parentObjSymbol2 Value'
}`,
      ],
      // same, with stringify
      [
        `Object with symbol keys & stringify`,
        { nesting: true, stringify: true },
        {
          aNormalKey: 'aNormalKey value',
          [Symbol('o')]: 'value Symbol(o)',
          [Symbol('o2')]: 'value Symbol(o2)',
        },
        `{
  "aNormalKey": "aNormalKey value",
  "Symbol.for('o')": "value Symbol(o)",
  "Symbol.for('o2')": "value Symbol(o2)"
}`,
      ],
      [
        `Object with symbol keys, symbolFormat: none & stringify`,
        { nesting: true, symbolFormat: 'none', stringify: true },
        {
          aNormalKey: 'aNormalKey value',
          [Symbol('o')]: 'value Symbol(o)',
          [Symbol('o2')]: 'value Symbol(o2)',
        },
        `{
  "aNormalKey": "aNormalKey value",
  "Symbol(o)": "value Symbol(o)",
  "Symbol(o2)": "value Symbol(o2)"
}`,
      ],
      [
        `Object with symbol keys, symbolFormat: inside & new line & single quote & stringify`,
        { nesting: true, symbolFormat: 'inside', stringify: true },
        {
          aNormalKey: 'aNormalKey value',
          [Symbol(`o with quotes ' " and \n new line`)]: 'value Symbol(o)',
          [Symbol('o2')]: 'value Symbol(o2)',
        },
        `{
  "aNormalKey": "aNormalKey value",
  "Symbol('o with quotes ' \\" and \\n new line')": "value Symbol(o)",
  "Symbol('o2')": "value Symbol(o2)"
}`,
      ],

      // Arrays
      // @todo: l14_5.log(arr2.keys()) => Object [Array Iterator] {}
      [
        'An Array with a nested array & circular references',
        {},
        (() => {
          const arr: any = [1, 'str', { a: 1, b: { b1: 2, b2: [5, 6, 7] } }, [9, 10]]
          arr.unshift(arr)
          arr.push(arr)
          return arr
        })(),
        `['[Circular: ~]', 1, 'str', { a: 1, b: { b1: 2, b2: [5, 6, 7] } }, [9, 10], '[Circular: ~]']`,
      ],
      [
        'An Array with nesting=true ',
        { nesting: true },
        [1, 'str', { a: 1, b: { b1: 2, b2: 3 } }],
        `[\n  1,\n  'str',\n  {\n    a: 1,\n    b: {\n      b1: 2,\n      b2: 3\n    }\n  }\n]`,
      ],

      [
        'An Array with maxItems & omitted: true',
        { maxItems: 3, omitted: true },
        [1, 2, 3, 4, 5],
        `[1, 2, 3 /* OMITTED 2 array items - maxItems = 3 */ ]`,
      ],

      [
        'An Array / Object with max depth',
        {
          depth: 3,
        },
        [
          'level_1',
          {
            level_2: 2,
            level_2_object: { level_3: 3, level_3_object: { level_4: 4, level_4_object: {} } },
          },
        ],
        `['level_1', { level_2: 2, level_2_object: { level_3: 3, level_3_object: { /* OMITTED depth = 3 */ } } }]`,
      ],

      [
        'An Array with objects nested & functionOrClass="body"',
        { nesting: true, functionOrClass: 'body' },
        [1, 'str', { a: 1, b: { b1: 2, b2: 3, aMethod: normalFunction } }],
        `[\n  1,\n  'str',\n  {\n    a: 1,\n    b: {\n      b1: 2,\n      b2: 3,\n      aMethod: function normalFunction(arg1, arg2) { return "double quotes" + 'single quotes' + \`backtick quotes\`; }\n    }\n  }\n]`,
      ],
      [
        'An array with instance & functions, with functionOrClass="body"',
        { functionOrClass: 'body' },
        [
          1,
          'str',
          aPerson,
          // Person,
          arrowFunction,
          normalFunction,
        ],
        `[1, 'str', { __class__: Person, name: 'Angelos', parentInstanceMethod: (instanceMethodArg) => { }, circularPerson: '[Circular: ~2]', [Symbol.for('personKey')]: 'symbol key value' }, (arg1) => "double quotes" + 'single quotes' + \`backtick quotes\`, function normalFunction(arg1, arg2) { return "double quotes" + 'single quotes' + \`backtick quotes\`; }]`,
      ],

      [
        'An Array with nested objects with methods and functionOrClass default (inspect)',
        { nesting: true },
        [1, 'str', { a: 1, b: { b1: 2, b2: 3, aMethod: normalFunction } }],
        `[\n  1,\n  'str',\n  {\n    a: 1,\n    b: {\n      b1: 2,\n      b2: 3,\n      aMethod: '[Function: normalFunction]'\n    }\n  }\n]`,
      ],
      [
        'An array with instance & functions, with functionOrClass="inspect"',
        { functionOrClass: 'inspect' }, // default
        [1, 'str', arrowFunction, normalFunction, aPerson],
        `[1, 'str', '[Function: arrowFunction]', '[Function: normalFunction]', { __class__: Person, name: 'Angelos', parentInstanceMethod: '[Function (anonymous)]', circularPerson: '[Circular: ~4]', [Symbol.for('personKey')]: 'symbol key value' }]`,
      ],
      [
        'An array with instance & functions, with functionOrClass="body" & useToString=true',
        { functionOrClass: 'body', useToString: true },
        [
          1,
          'str',
          aPerson,
          // Person,
          arrowFunction,
          normalFunction,
        ],
        `[1, 'str', PersonToString(Angelos), (arg1) => "double quotes" + 'single quotes' + \`backtick quotes\`, function normalFunction(arg1, arg2) { return "double quotes" + 'single quotes' + \`backtick quotes\`; }]`,
      ],
      [
        'An array with instance & functions, with functionOrClass="body" & useToString="quoted"',
        { functionOrClass: 'body', useToString: 'quoted' },
        [
          1,
          'str',
          aPerson,
          // Person,
          arrowFunction,
          normalFunction,
        ],
        `[1, 'str', 'PersonToString(Angelos)', (arg1) => "double quotes" + 'single quotes' + \`backtick quotes\`, function normalFunction(arg1, arg2) { return "double quotes" + 'single quotes' + \`backtick quotes\`; }]`,
      ],

      // Array with sparse items
      [
        'An Array with a sparse items',
        {},
        (() => {
          const arr = [111, undefined, null]
          arr[8] = 888
          return arr
        })(),
        `[111, undefined, null, /* 5 empty items */ 888]`,
      ],
      [
        'An Array with a sparse items & max Items & omitted',
        { maxItems: 4, omitted: true },
        (() => {
          const arr: any[] = [111, undefined, null]
          arr[8] = 888
          arr[1000] = 'OMITTED'
          return arr
        })(),
        `[111, undefined, null, /* 5 empty items */ 888 /* OMITTED 997 array items - maxItems = 4 */ ]`,
      ],
      [
        'An Array with a sparse items & max Items & omitted & stringify',
        { maxItems: 4, omitted: true, stringify: true, nesting: true },
        (() => {
          const arr: any[] = [111, undefined, null]
          arr[8] = 888
          arr[1000] = 'OMITTED'
          return arr
        })(),
        `[
  111,
  "[Undefined]",
  null,
  "[Empty item]",
  "[Empty item]",
  "[Empty item]",
  "[Empty item]",
  "[Empty item]",
  888
]`,
      ],

      // Map, WeakMap, Set, WeakSet, Proxy
      [
        'Map, as Object',
        { mapAsObject: true },
        aSimpleMap,
        `new Map(Object.entries({ 42: 1453, aNumber: 11, aString: 'Some string', 'Symbol.for(66)': 777 }))`,
      ],
      [
        'Map, as Object with maxProps',
        { mapAsObject: true, maxProps: 3 },
        aSimpleMap,
        `new Map(Object.entries({ 42: 1453, aNumber: 11, aString: 'Some string' }))`,
      ],
      [
        'Map, as Object, with omitted:true',
        {
          mapAsObject: true,
          maxProps: 3,
          omitted: true,
        },
        aSimpleMap,
        `new Map(Object.entries({ 42: 1453, aNumber: 11, aString: 'Some string' })) /* OMITTED 1 Map props - maxProps = 3 */`,
      ],
      [
        'Map, as inspected string',
        {
          mapAsObject: false,
          maxProps: 3,
        },
        aSimpleMap,
        `\`Map(3) { 'aNumber' => 11, 'aString' => 'Some string', 42 => 1453 }\``,
      ],
      [
        'Map, as inspected string, with omitted: true',
        {
          mapAsObject: false,
          maxProps: 3,
          omitted: true,
        },
        aSimpleMap,
        `\`Map(3) { 'aNumber' => 11, 'aString' => 'Some string', 42 => 1453 }\` /* OMITTED 1 Map props - maxProps = 3 */`,
      ],

      // complicatedMap
      [
        'Map, a complicatedMap mapAsObject, with object & symbol as Map key',
        {
          nesting: true,
          mapAsObject: true,
        },
        complicatedMap,
        `new Map(Object.entries({
  '{ a: 1, b: 2, [Symbol.for(\\'foo\\')]: \\'foo symbol\\' }': 'pojso value',
  aPerson: {
    __class__: Person,
    name: 'Angelos',
    parentInstanceMethod: '[Function (anonymous)]',
    circularPerson: '[Circular: ~aPerson]',
    [Symbol.for('personKey')]: 'symbol key value'
  },
  aPersonNested: {
    a: '[Circular: ~aPerson]'
  },
  aPersonInSymbol: {
    [Symbol.for('person')]: '[Circular: ~aPerson]'
  },
  normalStringKey: 'stringKey value',
  'Symbol.for(\\'o\\')': 'o value symbol',
  'PersonToString(Angelos)': 'aPerson instance as key'
}))`,
      ],
      [
        `Map, a complicatedMap mapAsObject, with useToString: "quoted" & objectProp: 'object'`,
        {
          nesting: true,
          mapAsObject: true,
          useToString: 'quoted',
          objectProp: 'object',
        },
        complicatedMap,
        `new Map(Object.entries({
  '{ a: 1, b: 2, [Symbol.for(\\'foo\\')]: \\'foo symbol\\' }': 'pojso value',
  aPerson: 'PersonToString(Angelos)',
  aPersonNested: {
    a: '[Circular: ~aPerson]'
  },
  aPersonInSymbol: {
    [Symbol.for('person')]: '[Circular: ~aPerson]'
  },
  normalStringKey: 'stringKey value',
  'Symbol.for(\\'o\\')': 'o value symbol',
  '{ __class__: Person, name: \\'Angelos\\', parentInstanceMethod: \\'[Function (anonymous)]\\', circularPerson: \\'[Circular: ~]\\', [Symbol.for(\\'personKey\\')]: \\'symbol key value\\' }': 'aPerson instance as key'
}))`,
      ],

      [
        'Map, a complicatedMap, mapAsObject, useToString: true, stringify: true',
        {
          nesting: true,
          mapAsObject: true,
          useToString: true,
          stringify: true,
          objectProp: 'object',
        },
        complicatedMap,
        `{
  "new Map(Object.entries({}))": {
    "{ a: 1, b: 2, [Symbol.for('foo')]: 'foo symbol' }": "pojso value",
    "aPerson": "PersonToString(Angelos)",
    "aPersonNested": {
      "a": "[Circular: ~new Map(Object.entries({})).aPerson]"
    },
    "aPersonInSymbol": {
      "Symbol.for('person')": "[Circular: ~new Map(Object.entries({})).aPerson]"
    },
    "normalStringKey": "stringKey value",
    "Symbol.for('o')": "o value symbol",
    "{ __class__: Person, name: 'Angelos', parentInstanceMethod: '[Function (anonymous)]', circularPerson: '[Circular: ~]', [Symbol.for('personKey')]: 'symbol key value' }": "aPerson instance as key"
  }
}`,
      ],

      [
        'Map, a complicatedMap as inspect',
        {
          nesting: true,
          mapAsObject: false,
        },
        complicatedMap,
        // Node 24+ changed util.inspect Symbol key format: [Symbol(x)] -> Symbol(x)
        parseInt(process.versions.node) >= 24
          ? `\`Map(7) {
  { a: 1, b: 2, Symbol(foo): 'foo symbol' } => 'pojso value',
  'aPerson' => <ref *1> Person {
    name: 'Angelos',
    parentInstanceMethod: [Function (anonymous)],
    circularPerson: [Circular *1],
    Symbol(personKey): 'symbol key value'
  },
  'aPersonNested' => {
    a: <ref *1> Person {
      name: 'Angelos',
      parentInstanceMethod: [Function (anonymous)],
      circularPerson: [Circular *1],
      Symbol(personKey): 'symbol key value'
    }
  },
  'aPersonInSymbol' => {
    Symbol(person): <ref *1> Person {
      name: 'Angelos',
      parentInstanceMethod: [Function (anonymous)],
      circularPerson: [Circular *1],
      Symbol(personKey): 'symbol key value'
    }
  },
  'normalStringKey' => 'stringKey value',
  Symbol(o) => 'o value symbol',
  <ref *1> Person {
    name: 'Angelos',
    parentInstanceMethod: [Function (anonymous)],
    circularPerson: [Circular *1],
    Symbol(personKey): 'symbol key value'
  } => 'aPerson instance as key'
}\``
          : `\`Map(7) {
  { a: 1, b: 2, [Symbol(foo)]: 'foo symbol' } => 'pojso value',
  'aPerson' => <ref *1> Person {
    name: 'Angelos',
    parentInstanceMethod: [Function (anonymous)],
    circularPerson: [Circular *1],
    [Symbol(personKey)]: 'symbol key value'
  },
  'aPersonNested' => {
    a: <ref *1> Person {
      name: 'Angelos',
      parentInstanceMethod: [Function (anonymous)],
      circularPerson: [Circular *1],
      [Symbol(personKey)]: 'symbol key value'
    }
  },
  'aPersonInSymbol' => {
    [Symbol(person)]: <ref *1> Person {
      name: 'Angelos',
      parentInstanceMethod: [Function (anonymous)],
      circularPerson: [Circular *1],
      [Symbol(personKey)]: 'symbol key value'
    }
  },
  'normalStringKey' => 'stringKey value',
  Symbol(o) => 'o value symbol',
  <ref *1> Person {
    name: 'Angelos',
    parentInstanceMethod: [Function (anonymous)],
    circularPerson: [Circular *1],
    [Symbol(personKey)]: 'symbol key value'
  } => 'aPerson instance as key'
}\``,
      ],

      // Map Iterator
      // @todo: breaks
      //       [
      //         'Map Iterator map.keys()',
      //         { nesting: true, stringify: true },
      //         aSimpleMap.keys(),
      //         `{
      // }`,
      //       ],
      // Set
      [
        'Set, as Array',
        { setAsArray: true },
        simpleSet,
        `new Set([11, 'a String', { a: 1 }, Symbol.for('foo'), new Date(2024, 0, 12, 13, 38, 31, 327)])`,
      ],
      [
        'Set, as Array, maxItems',
        {
          setAsArray: true,
          maxItems: 3,
        },
        simpleSet,
        `new Set([11, 'a String', { a: 1 }])`,
      ],
      [
        'Set, as Array, with omitted: true',
        {
          setAsArray: true,
          maxItems: 3,
          omitted: true,
        },
        simpleSet,
        `new Set([11, 'a String', { a: 1 }]) /* OMITTED 2 Set items - maxItems = 3 */`,
      ],
      [
        'Set, as inspected string',
        {
          setAsArray: false,
          maxItems: 3,
        },
        simpleSet,
        `\`Set(3) { 11, 'a String', { a: 1 } }\``,
      ],
      [
        'Set, as inspected string, with omitted: true',
        {
          setAsArray: false,
          maxItems: 3,
          omitted: true,
        },
        simpleSet,
        `\`Set(3) { 11, 'a String', { a: 1 } }\` /* OMITTED 2 Set items - maxItems = 3 */`,
      ],

      // WeakSet
      [
        'WeakSet, as inspected string',
        {
          weakSetAsArray: false,
          maxItems: 3,
          omitted: true,
        },

        (() => {
          const newSet = new WeakSet([{}, [], () => {}])
          return newSet
        })(),
        `'[WeakSet { <items unknown> }]'`,
      ],
      [
        'WeakMap, as inspected string',
        {},

        (() => {
          const newMap = new WeakMap()
          newMap.set({}, 11)
          newMap.set([], 22)
          return newMap
        })(),
        `'[WeakMap { <items unknown> }]'`,
      ],

      // SUITE: Symbol

      // outside
      [
        `Symbol, symbolFormat: 'outside'`,
        { symbolFormat: 'outside' },
        Symbol('label'),
        `'Symbol(label)'`,
      ],
      [
        `Symbol, symbolFormat: 'outside', stringify: true`,
        { symbolFormat: 'outside', stringify: true },
        Symbol('label'),
        `"Symbol(label)"`,
      ],

      // inside
      [
        `Symbol, symbolFormat: 'inside'`,
        { symbolFormat: 'inside' },
        Symbol('label'),
        `Symbol('label')`,
      ],
      [
        `Symbol, symbolFormat: 'inside', stringify: true`,
        { symbolFormat: 'inside', stringify: true },
        Symbol('label'),
        `"Symbol('label')"`,
      ],

      // for
      [
        `Symbol, symbolFormat: 'for' is default`,
        {}, // 'for' is default
        Symbol('label'),
        `Symbol.for('label')`,
      ],
      [
        `Symbol, symbolFormat: 'for'`,
        { symbolFormat: 'for' },
        Symbol('label'),
        `Symbol.for('label')`,
      ],
      [
        `Symbol, symbolFormat: 'for', stringify: true`,
        { symbolFormat: 'for', stringify: true },
        Symbol('label'),
        `"Symbol.for('label')"`,
      ],

      // none
      [
        `Symbol, symbolFormat: 'none'`,
        { symbolFormat: 'none' },
        Symbol('label'),
        `Symbol(label)`,
      ],
      [
        `Symbol, symbolFormat: 'none', stringify: true`,
        { symbolFormat: 'none', stringify: true },
        Symbol('label'),
        `"Symbol(label)"`,
      ],

      // label as number
      [
        `Symbol, symbolFormat: 'inside', stringify: true`,
        { symbolFormat: 'inside' },
        Symbol(456),
        `Symbol(456)`,
      ],
      [
        `Symbol, symbolFormat: 'for', stringify: true`,
        { symbolFormat: 'for', stringify: true },
        Symbol(123),
        `"Symbol.for(123)"`,
      ],

      // SUITE: BigInt
      [
        `BigInt, default`,
        {},
        BigInt('123456789123456789123456789123456789123456789123456789'),
        `123456789123456789123456789123456789123456789123456789`,
      ],
      [
        `BigInt, stringify: true`,
        { stringify: true },
        BigInt('123456789123456789123456789123456789123456789123456789'),
        `"[BigInt 123456789123456789123456789123456789123456789123456789]"`,
      ],

      // SUITE: Date
      [
        `Date, default`,
        {},
        new Date(2023, 11, 31, 23, 58, 59, 200),
        `new Date(2023, 11, 31, 23, 58, 59, 200)`,
      ],
      [
        `Date, default, stringify`,
        { stringify: true },
        new Date(2023, 11, 31, 23, 58, 59, 200),
        `"new Date(2023, 11, 31, 23, 58, 59, 200)"`,
      ],
      [
        `Date, @toISOString`,
        { dateFormat: '@toISOString' },
        new Date(2023, 11, 31, 23, 58, 59, 200),
        `'2023-12-31T23:58:59.200Z'`,
      ],
      [
        `Date, @toISOString, stringify`,
        { dateFormat: '@toISOString', stringify: true },
        new Date(2023, 11, 31, 23, 58, 59, 200),
        `"2023-12-31T23:58:59.200Z"`,
      ],

      // arguments
      [`arguments, stringify`, { stringify: true }, args, `[1, "foo", { "prop": "val" }]`],
      [
        `arguments, argsFormat: 'array', stringify`,
        { argsFormat: 'array', stringify: true },
        args,
        `[1, "foo", { "prop": "val" }]`,
      ],
      [
        `arguments, argsFormat: 'object'`,
        { argsFormat: 'object', stringify: false },
        args,
        `{ /* arguments as object */ 0: 1, 1: 'foo', 2: { prop: 'val' } }`,
      ],
      [
        `arguments, argsFormat: 'object', stringify`,
        { argsFormat: 'object', stringify: true },
        args,
        `{ "0": 1, "1": "foo", "2": { "prop": "val" } }`,
      ],

      // transform: omit object keys
      [
        `transform: omit object key and transform value`,
        { transform: transform_omitSecretKeyAndHideCreditCard },
        {
          a: 'a',
          secretKey: 'secretDataHideCompletely',
          creditCard: '1234567890123456',
        },
        `{ a: 'a', creditCard: '*******3456' }`,
      ],
      [
        `transform: omit nested object keys & first array item & limit maxItems, stringify: true`,
        {
          transform: transform_omitSecretKeyAndHideCreditCard,
          stringify: true,
          maxItems: 2,
          maxProps: 2,
        },
        [
          'valueIsOmitted',
          {
            someObject: {
              a: 'a',
              secretKey: 'secretDataHideCompletely',
              creditCard: '1234567890123456',
              propOmitted: 'cause of maxProps: 2',
            },
          },
          'valueIsAllowed',
          'value skipped cause of maxItems: 2 & 1st item omitted, i.e not count',
        ],
        `[{ "someObject": { "a": "a", "creditCard": "*******3456" } }, "valueIsAllowed"]`,
      ],

      // @todo:
      //  - AsyncFunctions
      //  - Generator functions
      //  - Iterators / AsyncIterators etc
      //  - Boxed primitives
      //  - (new Boolean etc) with/out props. inspect gives `[Boolean: true] { someProp: 'some value' }`
      //
      // const bs = new String('string value 2')
      // bs['stringKey'] = 'stringKey value'
      // bs[Symbol.for('stringKey')] = 'stringKey value'
      // const key:string = '1984'
      // bs[key] = 'stringKey value'
      //
      //  inspect gives:
      //  [String: 'string value 2'] {
      //   '1984': 'stringKey value',
      //   stringKey: 'stringKey value',
      //   [Symbol(stringKey)]: 'stringKey value'
      // }

      /*
      const arr2 = [10, 20, 30]
      arr2['someProp'] = 'some value'
      arr2[Symbol.for('symbolKey')] = 'some value'

      inspect gives:
      [
        10,
        20,
        30,
        someProp: 'some value',
        [Symbol(symbolKey)]: 'some value'
      ]
       */

      //  - Print Iterators
      //  - Set
      //  - Promise
      //  - clean up,
      //  - replaceAll with escape(str, [`'`, `"`, '`'], newLine)
      // escape tests from print & inspect-extracted
    ],
    ([description, options, input, expected]: [string, PrintOptions, any, string]) =>
      describe(`print correctly converts to string: ${description}`, () => {
        let result
        beforeAll(() => {
          const defaultOptions: PrintOptions = { colors: false }
          result = print(input, { ...defaultOptions, ...options })
        })

        it(`equals expected`, () => {
          expect(result).toBe(expected)
        })

        if (options.stringify)
          it(`parses JSON`, () => {
            const json = JSON.parse(result)
            expect(json).toBeDefined()
          })

        if (!options.stringify && options.symbolFormat !== 'none') {
          it(`parses JS`, () => {
            const code = '(' + result + ')'
            // const code = '(' + result.replaceAll('\\n', '') + ')'
            // console.log(code)
            const js = uglifyJs.parse(code)
            expect(js).toBeDefined()
          })
        }
      })
  )

  _.each(
    <[string, PrintOptions, any, any[]][]>[
      [
        'Transform a single value',
        { transform: jest.fn().mockReturnValue(true) },
        11,
        [[11, undefined, "'", undefined, [], 'number', undefined]],
      ],
      [
        `Transform an object's prop value, nested inside an array`,
        { transform: jest.fn().mockReturnValue(true) },
        [{ a: 111 }],
        [
          [[{ a: 111 }], undefined, "'", undefined, [], 'Array', undefined],
          [
            { a: 111 },
            0,
            "'",
            [
              {
                a: 111,
              },
            ],
            [0],
            'realObject',
            'Array',
          ],
          [
            111,
            'a',
            "'",
            {
              a: 111,
            },
            [0, 'a'],
            'number',
            'realObject',
          ],
        ],
      ],
    ],
    ([description, options, input, expected]: [string, PrintOptions, any, any[]]) =>
      describe(`print correctly converts to string:`, () => {
        it(`${description}`, () => {
          const transformMockFn: jest.MockedFn<any> = options.transform as any
          const defaultOptions: PrintOptions = { colors: false }
          print(input, { ...defaultOptions, ...options })
          // console.log(print(transformMockFn.mock.calls))
          expect(transformMockFn.mock.calls).toEqual(expected)
        })
      })
  )

  _.each(
    <[string, PrintOptions, any, string, string][]>[
      [
        'Print an object with single, double & backtick quotes',
        {},
        {
          [`prop-'single Quotes'`]: `value with single ' quote`,
          [`prop-"double Quotes"`]: `value with double " quote`,
          [`prop-'single & double " Quotes'`]: `value with single ' and double " quote`,
          [`prop-'single & 2 double " " Quotes'`]: `value with 2 single ' ' and 2 double " " quotes`,
          [`prop-'single & double " & backtick \` Quotes & \n new line`]: `value with single ' and new line\n and double " and & backtick \` quote`,
        },
        `{
  'prop-\\'single Quotes\\'': 'value with single \\' quote',
  'prop-"double Quotes"': 'value with double " quote',
  'prop-\\'single & double " Quotes\\'': 'value with single \\' and double " quote',
  'prop-\\'single & 2 double " " Quotes\\'': 'value with 2 single \\' \\' and 2 double " " quotes',
  'prop-\\'single & double " & backtick \` Quotes & \\n new line': 'value with single \\' and new line\\n and double " and & backtick \` quote'
}`,
        `{
  "prop-'single Quotes'": "value with single ' quote",
  "prop-\\"double Quotes\\"": "value with double \\" quote",
  "prop-'single & double \\" Quotes'": "value with single ' and double \\" quote",
  "prop-'single & 2 double \\" \\" Quotes'": "value with 2 single ' ' and 2 double \\" \\" quotes",
  "prop-'single & double \\" & backtick \` Quotes & \\n new line": "value with single ' and new line\\n and double \\" and & backtick \` quote"
}`,
      ],
    ],
    ([description, options, input, expectedJs, expectedJSON]: [
      string,
      PrintOptions,
      any,
      string,
      string,
    ]) =>
      describe(`print correctly converts to string:`, () => {
        it(`${description}: JS Parsable object`, () => {
          // check & parse the object as JS
          const resultJS = print(input, { colors: false, nesting: true, ...options })
          expect(resultJS).toEqual(expectedJs)

          const objJs = eval('(' + resultJS + ')')
          expect(objJs).toEqual(input)

          uglifyJs.parse('(' + resultJS + ')')
        })

        it(`${description}: JSON Parsable object`, () => {
          const resultJSON = print(input, {
            colors: false,
            nesting: true,
            stringify: true,
            ...options,
          })
          expect(resultJSON).toEqual(expectedJSON)

          const objJSON = JSON.parse(expectedJSON)
          expect(objJSON).toEqual(input)
        })
      })
  )
})
