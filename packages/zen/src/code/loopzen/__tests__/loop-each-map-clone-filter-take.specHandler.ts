// @todo: SpecZen it!
// @todo: Refactor to use only the a_Array_of_Tvalues / commonStringProps / commonSymbolProps pattern that emerged

// ### Test configuration - which testing suites run. #############
// On top intentionally so they can be easily found and changed.
// ################################################################
const TAKE_ITEMS_COUNT = 3
// An artificial test, where filter is used a s take, by returning STOP after 3 items
export const filter_STOPed_resembling_take = 'filter_STOPed_resembling_take' // + 45 tests
export const map_STOPed_resembling_take = 'map_STOPed_resembling_take'

let onlyThisSuite: boolean
let descriptionSearch: string

type TTestFunction =
  | 'filter'
  | 'map'
  | 'clone'
  | 'each'
  | 'loop'
  | 'take'
  | typeof filter_STOPed_resembling_take
  | typeof map_STOPed_resembling_take

export let testFunctionOnly: TTestFunction

// Values: SET OR COMMENT OUT HERE

// ### run only this current suite
// onlyThisSuite = true // We need this cause of how only works in mocha & this SpecHandler

// ### filter by function name
// testFunctionOnly = filter_STOPed_resembling_take
// testFunctionOnly = 'clone'
// testFunctionOnly = 'loop'
// testFunctionOnly = 'each'
// testFunctionOnly = 'map'
// testFunctionOnly = 'filter'
// testFunctionOnly = 'take'

// ### search in spec description, ignoring case:
// descriptionSearch = `A Date Single with extra props - with "props: 'all'" - iterates over props`
//
const theTakes = () =>
  <IAllTestOptions[]>[
    {}, // default, no options
    //   // Boundaries is always nice to be tested!
    //   { take: TAKE_ITEMS_COUNT }, // compatible to default & filterStopped
    //   { take: 0 },
    //   { take: 1 },
    //   { take: TAKE_ITEMS_COUNT - 1 },
    //   { take: TAKE_ITEMS_COUNT + 1 },
    //   { take: a_Array_of_Tvalues.length - 1 },
    //   { take: a_Array_of_Tvalues.length },
    //   { take: a_Array_of_Tvalues.length + 1 },
    //   { take: 25 },
    //   { take: Infinity },
  ]

import * as c from 'ansi-colors'
import * as chai from 'chai'
import * as _ from 'lodash'
import * as util from 'util'
import { delaySecs } from '../../../test-utils/misc'
import {
  a_Array_of_Tvalues,
  a_Array_ofKeys,
  a_childObj,
  a_Employee,
  a_Function_arrowNamed,
  a_Function_withProps,
  a_parentObj,
  a_sparseArray_of_Tvalues_and_extras_valuesAndIndexTuples,
  a_WeakMap_of_Person_Employees,
  a_WeakSet_of_Person,
  add_CommonAndArrayExtraProps,
  add_CommonProps,
  commonStringValuePropTuples,
  commonSymbolValuePropTuples,
  Employee,
  filter_takeN,
  filterValues,
  get_arguments,
  get_Array_of_bigints,
  get_Array_of_numbers,
  get_Array_of_Tvalues,
  get_arrayBuffer_Uint16,
  get_arrayBuffer_Uint8,
  get_ArrayOf_TvaluesSparseFiltered,
  get_AsyncGenerator_of_Tvalues_withCommonProps,
  get_childObj,
  get_Generator_of_Tvalues_withCommonProps,
  get_Map_of_TMapKeys_Tvalues,
  get_Map_of_TMapKeys_Tvalues_WithCommonProps,
  get_plainIteratorPOJSO,
  get_Set_of_Tvalues,
  get_Set_of_Tvalues_withCommonProps,
  get_sparseArray_of_Tvalues_and_extras,
  get_sparseArray_of_Tvalues_and_extras_filtered,
  get_sparseArray_of_Tvalues_and_extras_withCommonAndArrayExtraProps,
  getMapProjection,
  map_takeN,
  symbolProp,
  symbolProp2,
} from '../../../test-utils/test-data'
import { isEqual } from '../../objects/isEqual'
import { isAnyJustIterator } from '../../typezen/isAnyJustIterator'
import { isAsyncGenerator } from '../../typezen/isAsyncGenerator'
import { isAsyncIterator } from '../../typezen/isAsyncIterator'
import { isFunction } from '../../typezen/isFunction'
import { isGenerator } from '../../typezen/isGenerator'
import { isNumber } from '../../typezen/isNumber'
import { isPlainIterator } from '../../typezen/isPlainIterator'
import { isPromise } from '../../typezen/isPromise'
import { isSingleOrWeak } from '../../typezen/isSingle'
import { isTypedArray } from '../../typezen/isTypedArray'
import { type } from '../../typezen/type'
import { isNothing, NOTHING } from '../../typezen/utils'
import { DataViewType } from '../ArrayBufferCursor'
import { clone } from '../clone'
import { each } from '../each'
import { filter } from '../filter'
import { ILoopOptions, loop } from '../loop'
import { map } from '../map'
import { take } from '../take'

const { expect } = chai

type IAllTestOptions = ILoopOptions<any, any, any> & {
  // custom test drivers
  _itemsCount?: number
  _itemsAndPropsCountDelay?: number
  _propsCount?: number
  _allowIn_filter_STOPed_resembling_take?: boolean
}

// colors
const cType = (val) => c.blue(type(val))
const cFunction = (val) => c.bgMagenta(val)

const DONE = { DONE: true }

interface IgetItemsCountDelayOptions extends IAllTestOptions {
  take: number
}

// adjust expectedLoopOrEach etc, to include null & `count` automatically in the expected results, if missing!
const expectedIterationResultsNullCountProjection = (iterationArray: any[], idx: number) => {
  return [
    iterationArray[0],
    iterationArray.length === 1 ? null : iterationArray[1],
    iterationArray.length <= 2 ? idx + 1 : iterationArray[2],
  ]
}

export const adjustItemsAndPropsCountDelay = (options: IAllTestOptions, input: any): any => {
  // all stored in options, for debugging in tests
  if (options.props === true) return (options._itemsAndPropsCountDelay = 0)
  if (!options._itemsCount) return (options._itemsAndPropsCountDelay = 0)

  if (!isNumber(options.take))
    throw new Error('Internal Test Error: finalOptions.take is not a number')

  if (isNumber(options._itemsCount))
    return (options._itemsAndPropsCountDelay = Math.min(options._itemsCount, options.take) + 1)
}

/**
 * Limit the expected results by the `take` option, if it's less than the expected results
 *
 * @param expected eg [
 *   [ [Function: next], 'next', 1 ],
 *   [ 'someOtherValue', 'someOtherProp1', 2 ],
 *   ...
 *
 *   [ 222, null, 1 ],
 *   [ 123, null, 2 ],
 *   ...
 *
 *   [ 'bar', null, 0 ],
 *   [ 'foo', null, 2 ],
 *   ...
 * ]
 *
 * Each partition starts with a 3rd element in the inner array === 1 or 0 (for props/items/loopSingles) and each partition in the final flat array should have items limited by take
 *
 * Not working with sparse arrays or props
 *
 * @param finalOptions
 * @param testFunction
 * @param forceTake
 */
const limitExpectedByTake = (
  expected: any[],
  finalOptions: IAllTestOptions,
  forceTake?: number
) => {
  if (!(_.isArray(expected) || isTypedArray(expected))) return expected
  let actualTake = isNumber(forceTake) ? forceTake : (finalOptions.take as number)

  const finalExpected: any[] = []
  let currentPartition: any[] = []

  for (const val of expected) {
    if (_.isArray(val))
      if (val[2] === 1 || val[2] === 0) {
        // @note this might intefere in case the results are array but not iteration results
        finalExpected.push(...currentPartition)
        currentPartition = []
      }

    if (currentPartition.length < actualTake) currentPartition.push(val)
  }
  if (currentPartition.length) finalExpected.push(...currentPartition)

  // console.log('finalExpected', finalExpected)
  if (isTypedArray(expected)) {
    const typedArray = new (expected as any).constructor(finalExpected.length)
    typedArray.set(finalExpected)
    return typedArray
  }

  return finalExpected
}

export const loop_each_map_clone_filter_take_SpecHandler = (
  testFunction: TTestFunction,
  testDescr: string
) =>
  describe(`SUITE: z.${testFunction}(): ${testDescr}:`, () => {
    _.each(
      <[string, ILoopOptions<any, any, any>, any, any, [number | string | symbol, any][]][]>[
        // SUITE # Array
        ..._.map(['all', false], (props) => [
          'A simple Array',
          { props /* should not matter, input has no props */ },
          // inputFactory
          () => get_Array_of_Tvalues(),
          // expectedClone - same as input
          get_Array_of_Tvalues(),
          // expectedLoopOrEach
          _.map(get_Array_of_Tvalues(), (val, idx) => [val, idx]),
          // expectedMap by getMapProjection()
          _.map(get_Array_of_Tvalues(), (val, idx) => getMapProjection()(val, idx)),
          // expectedFiltered
          get_Array_of_Tvalues().filter(filterValues),
          // expectedTake
          get_Array_of_Tvalues().slice(0, TAKE_ITEMS_COUNT),
        ]),

        ..._.map(['all', false], (props) => [
          'An Array, with map projection function',
          {
            map: getMapProjection(2),
            props /* should not matter, input has no props */,
          },
          // inputFactory
          () => get_Array_of_Tvalues(),
          // expectedClone
          new Error(
            `z.clone(): Could not clone the given value: z.map(): options.map can NOT be used here - use mapCb only`
          ),
          // expectedLoopOrEach: loop() results are now mapped over by getMapProjection(2)
          _.map(get_Array_of_Tvalues(), (val, idx) => [getMapProjection(2)(val, idx), idx]),
          // expectedMap
          new Error(`z.map(): options.map can NOT be used here - use mapCb only`),
          // expectedFiltered - filtered & then mapped
          get_Array_of_Tvalues().filter(filterValues).map(getMapProjection(2)),
          // expectedTake
          get_Array_of_Tvalues().slice(0, TAKE_ITEMS_COUNT).map(getMapProjection(2)),
        ]),
        ..._.map(['all', false], (props) => [
          `An Array, with 'even' idx filter & sparse: false (default) x 2, with props true/false dont matter`,
          {
            filter: filterValues,
            props /* should not matter, input has no props */,
          },
          // inputFactory
          () => get_Array_of_Tvalues(),
          // expectedClone: filtered by filterValues, dense array
          get_Array_of_Tvalues().filter((val) => filterValues(val)),
          // expectedLoopOrEach: filtered by filterValues eg.
          // [
          //   [222, 0],
          //   ['A string Tvalue', 2],
          //   [true, 4], ...
          // ]
          get_Array_of_Tvalues()
            .map((val, idx) => [val, idx])
            .filter(([val]) => filterValues(val)),
          // expectedMap by getMapProjection() and filter. Dense array cause sparse: false, eg
          // [
          //   122,
          //   'A string Tvalue !changeByMapProjectionId#1!',
          //   false, // flipped boolean
          //   ...
          // ],
          get_Array_of_Tvalues()
            // filter 1st
            .filter((val) => filterValues(val))
            .map(getMapProjection()),

          // expectedFiltered
          new Error(`z.filter(): options.filter can NOT be used here - use filterCb only`),
          // expectedTake
          [222, 'A string Tvalue', true],
        ]),

        // Arrays becoming sparse due to filtering
        ..._.map(['all', false], (props) => [
          `An Array, with 'even' idx filter & sparse: true: when filter rejects, we get an empty spot in the resulted (sparse) array`,
          {
            sparse: true,
            filter: filterValues,
            props /* should not matter, input has no props */,
          },
          // inputFactory
          () => get_Array_of_Tvalues(),
          // expectedClone: filtered by filterValues, sparse array
          // [222, , 'A string Tvalue', , true, , ['an', 'array Tvalue'], , { prop: 'Tvalue' }],
          get_ArrayOf_TvaluesSparseFiltered(),
          // expectedLoopOrEach: filtered by filterValues
          [
            [222, 0, 1],
            ['A string Tvalue', 2, 2],
            [true, 4, 3],
            [['an', 'array Tvalue'], 6, 4],
            [{ prop: 'Tvalue' }, 8, 5],
          ],
          // expectedMap by getMapProjection() and filterEvenIdxOrStringSize(idx) only elements. Sparse array, cause sparse: true!
          [
            322,
            ,
            'A string Tvalue !changeByMapProjectionId#1!',
            ,
            false, // flipped boolean
            ,
            ['!changeByMapProjectionId#1!', 'an', 'array Tvalue'],
            ,
            { prop: 'Tvalue', changeByMapProjectionId1: 1 },
          ],
          // expectedFiltered
          new Error(`z.filter(): options.filter can NOT be used here - use filterCb only`),
          // expectedTake
          [222, , 'A string Tvalue', , true], // @todo: document, as we have only 3 real items wit sparse!
        ]),
        //////////////////////////
        ..._.map(['all', false], (props) => [
          `A sparse Array with sparse: false (default), sparse items are not iterated over and clone/mapped result are not sparse (they are dense)`,
          { props /* should don't matter, cause props ? get_sparseArrayOfValues() */ },
          // inputFactory
          () =>
            props
              ? get_sparseArray_of_Tvalues_and_extras()
              : get_sparseArray_of_Tvalues_and_extras_withCommonAndArrayExtraProps(),
          // expectedClone - dense version of array, including sparse items added with props notation
          [
            ...get_Array_of_Tvalues(),
            `sparse value for idx 100`,
            `stringNumber key is interpreted as number, i.e an index`,
          ],
          // expectedLoopOrEach
          a_sparseArray_of_Tvalues_and_extras_valuesAndIndexTuples,
          // expectedMap - a dense array, no sparse items
          [
            ...get_Array_of_Tvalues(),
            `sparse value for idx 100`,
            `stringNumber key is interpreted as number, i.e an index`,
          ].map(getMapProjection()),
          // expectedFiltered
          [
            ...get_Array_of_Tvalues(),
            `sparse value for idx 100`,
            `stringNumber key is interpreted as number, i.e an index`,
          ].filter(filterValues),
          // expectedTake
          [222, 123, 'A string Tvalue'],
        ]),

        ..._.map(['all', false], (props) => [
          `A sparse Array with sparse: true, sparse items are not iterated over & mapped result is also sparse. Extra props are tested with 1) props: 'all' & non-props array & 2) props: false & props array and should both be equal`,
          {
            sparse: true,
            props /* should not matter, cause props ? get_sparseArrayOfValues()  */,
            _allowIn_filter_STOPed_resembling_take: true,
          },
          // inputFactory
          () =>
            props
              ? get_sparseArray_of_Tvalues_and_extras()
              : get_sparseArray_of_Tvalues_and_extras_withCommonAndArrayExtraProps(),
          // expectedClone - same as input
          get_sparseArray_of_Tvalues_and_extras(),
          // expectedLoopOrEach
          a_sparseArray_of_Tvalues_and_extras_valuesAndIndexTuples,
          // expectedMap
          get_sparseArray_of_Tvalues_and_extras(getMapProjection()),
          // expectedFiltered
          get_sparseArray_of_Tvalues_and_extras_filtered(),
          // expectedTake
          [222, 123, , , 'A string Tvalue'],
        ]),
        [
          `A sparse Array with sparse: true & extra props with props: 'all'`,
          { sparse: true, props: 'all' },
          // inputFactory
          () => get_sparseArray_of_Tvalues_and_extras_withCommonAndArrayExtraProps(),
          // expectedClone - clone: sparse like input, string props & indexes
          add_CommonAndArrayExtraProps(get_sparseArray_of_Tvalues_and_extras(), {
            symbol: false,
          }),
          // expectedLoopOrEach
          [
            // extra props 1st
            [128n, '-10'], // negative numbers are interpreted as strings/props
            ...commonStringValuePropTuples,

            // array indexes - restart count
            ..._.map(
              a_sparseArray_of_Tvalues_and_extras_valuesAndIndexTuples,
              (arrayValues, idx) => [...arrayValues, idx + 1]
            ),
          ],

          // expectedMap
          add_CommonAndArrayExtraProps(
            get_sparseArray_of_Tvalues_and_extras(getMapProjection()),
            {
              map: getMapProjection(),
              symbol: false,
            }
          ),
          // expectedFiltered
          add_CommonAndArrayExtraProps(get_sparseArray_of_Tvalues_and_extras_filtered(), {
            filter: filterValues,
            symbol: false,
          }),
          // expectedTake: TAKE_ITEMS_COUNT = 3 items & 3 extra props
          add_CommonAndArrayExtraProps([222, 123, , , 'A string Tvalue'], {
            take: TAKE_ITEMS_COUNT,
            symbol: false,
          }),
        ],
        [
          `A sparse array with extra props & { props: 'all', symbol: true, sparse: true }`,
          { props: 'all', symbol: true, sparse: true },
          // inputFactory
          () => get_sparseArray_of_Tvalues_and_extras_withCommonAndArrayExtraProps(),
          // expectedClone - PERFECT clone, exactly as input, including symbols
          get_sparseArray_of_Tvalues_and_extras_withCommonAndArrayExtraProps(),

          // expectedLoopOrEach
          [
            // extra props 1st
            [128n, '-10'], // negative numbers are interpreted as strings/props
            ...commonStringValuePropTuples,
            ...commonSymbolValuePropTuples,

            // array indexes - restart count
            ..._.map(
              a_sparseArray_of_Tvalues_and_extras_valuesAndIndexTuples,
              (arrayValues, idx) => [...arrayValues, idx + 1]
            ),
          ],
          // expectedMap
          add_CommonAndArrayExtraProps(
            get_sparseArray_of_Tvalues_and_extras(getMapProjection()),
            {
              map: getMapProjection(),
            }
          ),
          // expectedFiltered
          add_CommonAndArrayExtraProps(get_sparseArray_of_Tvalues_and_extras_filtered(), {
            filter: filterValues,
          }),
          // expectedTake: TAKE_ITEMS_COUNT = 3 items & 3 extra props
          add_CommonAndArrayExtraProps([222, 123, , , 'A string Tvalue'], {
            take: TAKE_ITEMS_COUNT,
            symbol: false,
          }),
        ],
        [
          `A sparse Array with extra props / keys, with props: "only" gets empty array with only extra Object keys`,
          { props: true, symbol: true },
          // inputFactory
          () => get_sparseArray_of_Tvalues_and_extras_withCommonAndArrayExtraProps(),
          // expectedClone - empty array with all props!
          add_CommonAndArrayExtraProps([]),
          // expectedLoopOrEach
          [
            // extra props only
            [128n, '-10'], // negative numbers are interpreted as strings/props
            ...commonStringValuePropTuples,
            ...commonSymbolValuePropTuples,
          ],
          // expectedMap
          add_CommonAndArrayExtraProps([], { map: getMapProjection() }),
          // expectedFiltered
          add_CommonAndArrayExtraProps([], {
            filter: filterValues,
          }),
          // expectedTake: TAKE_ITEMS_COUNT = 3 extra props only
          add_CommonAndArrayExtraProps([], {
            take: TAKE_ITEMS_COUNT,
          }),
        ],

        // SUITE objects / POJSO's

        // @todo(222): use common props pattern for POJSO, conserving the inheritance testing
        ..._.map([true /*, false, 'all'*/], (props) => [
          // @todo: use SpecZen EACH for this
          `An object as Object.create(anotherObject), by default iterates only this object's props, string & symbol, but not inherited props. Using props = ${props}`,
          { props, symbol: true },
          // inputFactory
          () => a_childObj,
          // expectedClone - orphan child, no parent props copied
          get_childObj(false),
          // expectedLoopOrEach
          [
            [11, 'childObjKeyNum_rejected'],
            [22, 'childObjKeyNum'],
            ['A String', 'childObjKeyStr'],
            ['tooBad rejected child String', 'childObjKeyStr_Rejected'],
            ['childObjSymbol1 Value', Symbol.for('childObjSymbolLabel1')],
            [
              'tooBad_childObjSymbol2 rejected child Value',
              Symbol.for('badKey_childObjSymbolLabel2 with quotes \' " and \n new line'),
            ],
          ],
          // expectedMap
          (() => {
            const childObj = Object.create(a_parentObj)

            _.assign(childObj, {
              childObjKeyNum_rejected: 111,
              childObjKeyNum: 122,
              childObjKeyStr: 'A String !changeByMapProjectionId#1!',
              childObjKeyStr_Rejected:
                'tooBad rejected child String !changeByMapProjectionId#1!',
            })

            childObj[Symbol.for('childObjSymbolLabel1')] =
              'childObjSymbol1 Value !changeByMapProjectionId#1!'
            childObj[
              Symbol.for('badKey_childObjSymbolLabel2 with quotes \' " and \n new line')
            ] = 'tooBad_childObjSymbol2 rejected child Value !changeByMapProjectionId#1!'

            return childObj
          })(),
          // expectedFiltered
          (() => {
            const childObj = Object.create(a_parentObj)

            _.assign(childObj, {
              childObjKeyNum: 22,
              childObjKeyStr: 'A String',
            })

            childObj[Symbol.for('childObjSymbolLabel1')] = 'childObjSymbol1 Value'

            return childObj
          })(),
          // expectedTake: TAKE_ITEMS_COUNT = 3 items & 3 extra props
          (() => {
            const childObj = Object.create(a_parentObj)

            _.assign(childObj, {
              childObjKeyNum_rejected: 11,
              childObjKeyNum: 22,
              childObjKeyStr: 'A String',
            })

            return childObj
          })(),
        ]),

        // Spec: inherited: true on a Object.create(anotherObject)
        ..._.map([true, false, 'all'], (props) => [
          `An object as Object.create(anotherObject), with inherited: true, it iterates it's prototype's chain props also`,
          {
            props,
            inherited: true,
            symbol: true,
          },
          // inputFactory
          () => a_childObj,

          // expectedClone - we've asked to copy inherited props, along with own, but its ignored (map/project dont copy inherited props)
          (() => {
            const childObj = get_childObj(false)
            // _.assign(childObj, a_parentObj)

            // fails to copy parent's symbols!
            // childObj[Symbol.for(`parentObjSymbolLabel1`)] = 'parentObjSymbol1 Value'
            // childObj[
            //   Symbol.for(`badKey_parentObjSymbolLabel2 with quotes \' " and \n new line`)
            // ] = 'tooBad_parentObjSymbol rejected parent Value'

            return childObj
          })(),
          // expectedLoopOrEach
          [
            [11, 'childObjKeyNum_rejected'],
            [22, 'childObjKeyNum'],
            ['A String', 'childObjKeyStr'],
            ['tooBad rejected child String', 'childObjKeyStr_Rejected'],
            ['childObjSymbol1 Value', Symbol.for(`childObjSymbolLabel1`)],
            [
              'tooBad_childObjSymbol2 rejected child Value',
              Symbol.for('badKey_childObjSymbolLabel2 with quotes \' " and \n new line'),
            ],
            [1, 'parentObjKeyNum_rejected'],
            [2, 'parentObjKeyNum'],
            ['A String', 'parentObjKeyStr'],
            ['tooBad rejected parent String', 'parentObjKeyStr_Rejected'],
            ['parentObjSymbol1 Value', Symbol.for(`parentObjSymbolLabel1`)],
            [
              'tooBad_parentObjSymbol rejected parent Value',
              Symbol.for(`badKey_parentObjSymbolLabel2 with quotes ' " and \n new line`),
            ],
          ],

          // expectedMap
          (() => {
            const childObj = Object.create(a_parentObj)

            _.assign(childObj, {
              childObjKeyNum_rejected: 111,
              childObjKeyNum: 122,
              childObjKeyStr: 'A String !changeByMapProjectionId#1!',
              childObjKeyStr_Rejected:
                'tooBad rejected child String !changeByMapProjectionId#1!',

              // parent - inherited, hence not mapped
              // parentObjKeyNum_rejected: 101,
              // parentObjKeyNum: 102,
              // parentObjKeyStr: 'A String !changeByMapProjectionId#1!',
              // parentObjKeyStr_Rejected:
              //   'tooBad rejected parent String !changeByMapProjectionId#1!',
            })

            // _.assign fails to copy symbols!
            childObj[Symbol.for(`childObjSymbolLabel1`)] =
              'childObjSymbol1 Value !changeByMapProjectionId#1!'
            childObj[
              Symbol.for(`badKey_childObjSymbolLabel2 with quotes \' " and \n new line`)
            ] = 'tooBad_childObjSymbol2 rejected child Value !changeByMapProjectionId#1!'

            // childObj[Symbol.for(`parentObjSymbolLabel1`)] =
            //   'parentObjSymbol1 Value !changeByMapProjectionId#1!'
            // childObj[
            //   Symbol.for(`badKey_parentObjSymbolLabel2 with quotes ' " and \n new line`)
            // ] = 'tooBad_parentObjSymbol rejected parent Value !changeByMapProjectionId#1!'

            return childObj
          })(),
          // expectedFiltered
          (() => {
            const childObj = Object.create(a_parentObj)

            _.assign(childObj, {
              childObjKeyNum: 22,
              childObjKeyStr: 'A String',
              // parentObjKeyNum: 2,
              // parentObjKeyStr: 'A String',
            })

            childObj[Symbol.for(`childObjSymbolLabel1`)] = 'childObjSymbol1 Value'
            // childObj[Symbol.for(`parentObjSymbolLabel1`)] = 'parentObjSymbol1 Value'

            return childObj
          })(),
          // expectedTake: TAKE_ITEMS_COUNT = 3 items & 3 extra props
          (() => {
            const childObj = Object.create(a_parentObj)

            _.assign(childObj, {
              childObjKeyNum_rejected: 11,
              childObjKeyNum: 22,
              childObjKeyStr: 'A String',
            })

            return childObj
          })(),
        ]),

        // SUITE: class instances
        ..._.map([true, false, 'all'], (props) => [
          `An sub-instance of a Klass, with symbol: true, by default iterates only this instance's props. Doesnt care about props: '${props}'`,
          {
            props,
            symbol: true,
          },
          // inputFactory
          () => a_Employee,
          // expectedClone - clone of instance as a POJSO (NOT a class instance, yet!)
          {
            name: 'Elpida',
            parentInstanceMethod: a_Employee.parentInstanceMethod,
            childInstanceMethod: a_Employee.childInstanceMethod,
            tooBadChildInstanceProp: 'tooBadChildInstanceProp value - rejected by filter',
            tooBadParentInstanceProp: 'tooBadParentInstanceProp value - rejected by filter',
            [symbolProp]: 'symbolKeyForObj1 value',
            [Symbol.for('personKey')]: 'symbol key value',
            [symbolProp2]: 'symbolKeyForObj2 value',
            circularPerson: a_Employee,
          },
          // expectedLoopOrEach
          [
            ['Elpida', 'name'],
            [a_Employee.parentInstanceMethod, 'parentInstanceMethod'],
            ['tooBadParentInstanceProp value - rejected by filter', 'tooBadParentInstanceProp'],
            [a_Employee, 'circularPerson'],
            [a_Employee.childInstanceMethod, 'childInstanceMethod'],
            ['tooBadChildInstanceProp value - rejected by filter', 'tooBadChildInstanceProp'],
            ['symbolKeyForObj1 value', symbolProp],
            ['symbol key value', Symbol.for('personKey')],
            ['symbolKeyForObj2 value', symbolProp2],
          ],
          // expectedMap
          {
            name: 'Elpida !changeByMapProjectionId#1!',
            parentInstanceMethod: a_Employee.parentInstanceMethod,
            childInstanceMethod: a_Employee.childInstanceMethod,
            tooBadParentInstanceProp:
              'tooBadParentInstanceProp value - rejected by filter !changeByMapProjectionId#1!',
            tooBadChildInstanceProp:
              'tooBadChildInstanceProp value - rejected by filter !changeByMapProjectionId#1!',
            [symbolProp]: 'symbolKeyForObj1 value !changeByMapProjectionId#1!',
            [Symbol.for('personKey')]: 'symbol key value !changeByMapProjectionId#1!',
            [symbolProp2]: 'symbolKeyForObj2 value !changeByMapProjectionId#1!',
            circularPerson: a_Employee,
          },
          // expectedFiltered
          {
            name: 'Elpida',
            parentInstanceMethod: a_Employee.parentInstanceMethod,
            childInstanceMethod: a_Employee.childInstanceMethod,
            [symbolProp]: 'symbolKeyForObj1 value',
            [Symbol.for('personKey')]: 'symbol key value',
            [symbolProp2]: 'symbolKeyForObj2 value',
            circularPerson: a_Employee,
          },
          // expectedTake - TAKE_ITEMS_COUNT 3 items
          {
            name: 'Elpida',
            parentInstanceMethod: a_Employee.parentInstanceMethod,
            tooBadParentInstanceProp: 'tooBadParentInstanceProp value - rejected by filter',
          },
        ]),
        ..._.map([false, 'all'], (props) => [
          'An sub-instance of KlassChild, with inherited: true & nonEnumerables: true, it iterates over Klass & KlassChild methods / props',
          { props, inherited: true, nonEnumerables: true, symbol: true },
          // inputFactory
          () => a_Employee,
          // expectedClone - just like input
          {
            name: 'Elpida',
            parentInstanceMethod: a_Employee.parentInstanceMethod,
            childInstanceMethod: a_Employee.childInstanceMethod,
            tooBadChildInstanceProp: 'tooBadChildInstanceProp value - rejected by filter',
            tooBadParentInstanceProp: 'tooBadParentInstanceProp value - rejected by filter',
            [symbolProp]: 'symbolKeyForObj1 value',
            [Symbol.for('personKey')]: 'symbol key value',
            [symbolProp2]: 'symbolKeyForObj2 value',
            circularPerson: a_Employee,

            // These are inherited, hence not mapped
            // constructor: Employee,
            // childClassMethod: a_Employee.childClassMethod,
            // parentClassMethod: a_Employee.parentClassMethod,
            // toString: a_Employee.toString,
          },
          // expectedLoopOrEach
          [
            ['Elpida', 'name'],
            [a_Employee.parentInstanceMethod, 'parentInstanceMethod'],
            ['tooBadParentInstanceProp value - rejected by filter', 'tooBadParentInstanceProp'],
            [a_Employee, 'circularPerson'],
            [a_Employee.childInstanceMethod, 'childInstanceMethod'],
            ['tooBadChildInstanceProp value - rejected by filter', 'tooBadChildInstanceProp'],
            ['symbolKeyForObj1 value', symbolProp],
            ['symbol key value', Symbol.for('personKey')],
            ['symbolKeyForObj2 value', symbolProp2],
            [Employee, 'constructor'],
            [a_Employee.childClassMethod, 'childClassMethod'],
            [a_Employee.toString, 'toString'],
            [a_Employee.parentClassMethod, 'parentClassMethod'],
          ],
          // expectedMap
          {
            name: 'Elpida !changeByMapProjectionId#1!',
            parentInstanceMethod: a_Employee.parentInstanceMethod,
            childInstanceMethod: a_Employee.childInstanceMethod,
            tooBadChildInstanceProp:
              'tooBadChildInstanceProp value - rejected by filter !changeByMapProjectionId#1!',
            tooBadParentInstanceProp:
              'tooBadParentInstanceProp value - rejected by filter !changeByMapProjectionId#1!',
            [symbolProp]: 'symbolKeyForObj1 value !changeByMapProjectionId#1!',
            [Symbol.for('personKey')]: 'symbol key value !changeByMapProjectionId#1!',
            [symbolProp2]: 'symbolKeyForObj2 value !changeByMapProjectionId#1!',
            circularPerson: a_Employee,

            // These are inherited, hence not mapped
            // constructor: Employee,
            // childClassMethod: a_Employee.childClassMethod,
            // parentClassMethod: a_Employee.parentClassMethod,
            // toString: a_Employee.toString,
          },
          // expectedFiltered
          {
            name: 'Elpida',
            parentInstanceMethod: a_Employee.parentInstanceMethod,
            childInstanceMethod: a_Employee.childInstanceMethod,
            [symbolProp]: 'symbolKeyForObj1 value',
            [Symbol.for('personKey')]: 'symbol key value',
            [symbolProp2]: 'symbolKeyForObj2 value',
            circularPerson: a_Employee,

            // These are inherited, hence not mapped
            // constructor: Employee,
            // childClassMethod: a_Employee.childClassMethod,
            // parentClassMethod: a_Employee.parentClassMethod,
            // toString: a_Employee.toString,
          },
          // expectedTake - TAKE_ITEMS_COUNT 3 items
          {
            name: 'Elpida',
            parentInstanceMethod: a_Employee.parentInstanceMethod,
            tooBadParentInstanceProp: 'tooBadParentInstanceProp value - rejected by filter',
          },
        ]),

        // SUITE Function
        [
          `A Function as a single value, with loopSingles: true (default) - iterates on the function`,
          {},
          // inputFactory
          () => a_Function_arrowNamed,
          // expectedClone
          DONE,
          // expectedLoopOrEach - iterates on the function
          [[a_Function_arrowNamed]],
          // expectedMap - mapped returned value
          DONE,
          // expectedFiltered - tested in clone-spec.ts
          DONE,
          // expectedTake - tested in take-spec.ts
          DONE,
        ],
        [
          `A Function as a single value, with loopSingles: false - iterates on nothing`,
          { loopSingles: false },
          // inputFactory
          () => a_Function_arrowNamed,
          // expectedClone
          DONE,
          // expectedLoopOrEach - no iteration
          [],
          // expectedMap - mapped returned value
          DONE,
          // expectedFiltered - tested in clone-spec.ts
          DONE,
          // expectedTake - tested in take-spec.ts
          DONE,
        ],
        [
          `A Function with extra props & symbols even with loopSingles: false - returns a Function with mapped props`,
          { props: 'all', symbol: true, loopSingles: false },
          // inputFactory
          () => a_Function_withProps,
          // clone - done in clone-spec.ts cant be tested here
          DONE,
          // loopOrEach
          [
            [a_Function_withProps.functionStringProp1, 'functionStringProp1'],
            [a_Function_withProps.functionNumberProp2, 'functionNumberProp2'],
            [
              a_Function_withProps[Symbol.for('functionSymbolProp')],
              Symbol.for('functionSymbolProp'),
            ],
          ],
          // expectedMap - tested in map-spec.ts
          DONE,
          // expectedFiltered - tested in filter-spec.ts
          DONE,
          // expectedTake - tested in take-spec.ts
          DONE,
        ],

        // SUITE: arguments
        [
          `An arguments Array-like object`,
          {},
          // inputFactory
          () => get_arguments(),
          // expectedClone - same as input
          get_arguments(),
          [
            [10, '0'],
            ['string argument', '1'],
            ['tooBad argument rejected by filter', '2'],
            [{ prop: 'val' }, '3'],
          ],
          // expectedMap
          (function (...args) {
            return arguments
          })(
            110,
            'string argument !changeByMapProjectionId#1!',
            'tooBad argument rejected by filter !changeByMapProjectionId#1!',
            {
              prop: 'val',
              changeByMapProjectionId1: 1,
            }
          ),
          // expectedFiltered
          (function (...args) {
            return arguments
          })(10, 'string argument', { prop: 'val' }),
          // expectedTake - TAKE_ITEMS_COUNT 3 items
          (function (...args) {
            return arguments
          })(10, 'string argument', 'tooBad argument rejected by filter'),
        ],

        [
          `An ArrayBuffer, simple 8 byteLength array, 8bit unsigned integers`,
          { dataViewType: DataViewType.Uint8 },
          // inputFactory
          () => get_arrayBuffer_Uint8(),
          // expectedClone
          get_arrayBuffer_Uint8(_.map(get_Array_of_numbers(), _.identity) as any),
          // expectedLoopOrEach
          (input) =>
            _.times(input.byteLength, (idx) => [get_Array_of_numbers()[idx] | 0, idx, idx + 1]),
          // expectedMap
          get_arrayBuffer_Uint8(
            _.map(get_Array_of_numbers().concat([0, 0]), getMapProjection())
          ),
          // expectedFiltered
          get_arrayBuffer_Uint8(_.filter(get_Array_of_numbers(), filterValues)),
          // expectedTake
          get_arrayBuffer_Uint8(_.take(get_Array_of_numbers(), TAKE_ITEMS_COUNT)),
        ],
        [
          `An ArrayBuffer with a filter`,
          {
            dataViewType: DataViewType.Uint8,
            filter: filterValues,
          },
          // inputFactory
          () => get_arrayBuffer_Uint8(),
          // expectedClone - only filtered values
          get_arrayBuffer_Uint8(_.filter(get_Array_of_numbers(), filterValues)),

          // expectedLoopOrEach - filter out all odds, include all others
          [
            [10, 0, 1],
            [30, 2, 2],
            [50, 4, 3],
            [0, 6, 4],
            [0, 7, 5],
          ],
          // expectedMap - only filtered values & mapped
          get_arrayBuffer_Uint8(
            _.filter(get_Array_of_numbers().concat([0, 0]), filterValues).map(
              getMapProjection()
            )
          ),
          // expectedFiltered
          new Error(`z.filter(): options.filter can NOT be used here - use filterCb only`),
          // expectedTake
          get_arrayBuffer_Uint8(
            _.take(_.filter(get_Array_of_numbers(), filterValues), TAKE_ITEMS_COUNT)
          ),
        ],
        [
          `An ArrayBuffer uses dataViewType, 16bit (2 bytes per item) matching get_arrayBuffer_Uint16`,
          {
            dataViewType: DataViewType.Uint16, // 2 bytes per item
          },
          // inputFactory
          () => get_arrayBuffer_Uint16(),
          // expectedClone
          get_arrayBuffer_Uint16(),

          // expectedLoopOrEach
          (input) =>
            _.times(input.byteLength / 2, (idx) => [
              get_Array_of_numbers()[idx] | 0,
              idx,
              idx + 1,
            ]),
          // expectedMap
          get_arrayBuffer_Uint16(
            _.map(get_Array_of_numbers().concat([0, 0]), getMapProjection())
          ),
          // expectedFiltered
          get_arrayBuffer_Uint16(_.filter(get_Array_of_numbers(), filterValues)),
          // expectedTake
          get_arrayBuffer_Uint16(_.take(get_Array_of_numbers(), TAKE_ITEMS_COUNT)),
        ],
        [
          `An ArrayBuffer uses dataViewType - gets wrong results, with wrong dataViewType`,
          {
            dataViewType: DataViewType.Uint16,
          },
          // inputFactory
          () => get_arrayBuffer_Uint8(),
          // expectedClone - throws
          get_arrayBuffer_Uint8(),
          // expectedLoopOrEach
          [
            [5386, 0, 1],
            [10526, 1, 2],
            [15666, 2, 3],
            [0, 3, 4],
          ],
          // expectedMap - cant be tested easily
          DONE,
          // expectedFiltered - cant be tested easily
          DONE,
          // expectedTake - cant be tested easily
          DONE,
        ],
        [
          `An ArrayBuffer throws without dataViewType`,
          {},
          // inputFactory
          () => get_arrayBuffer_Uint8(),
          // expectedClone - throws
          new Error(
            `z.clone(): Could not clone the given value: z.loop(): options.dataViewType is required to loop over an ArrayBuffer`
          ),
          // expectedLoopOrEach - throws
          new Error(`z.loop(): options.dataViewType is required to loop over an ArrayBuffer`),
          // expectedMap - throws
          new Error(`z.loop(): options.dataViewType is required to loop over an ArrayBuffer`),
          // expectedFiltered - throws
          new Error(`z.loop(): options.dataViewType is required to loop over an ArrayBuffer`),
          // expectedTake - throws
          new Error(`z.loop(): options.dataViewType is required to loop over an ArrayBuffer`),
        ],

        // # TypedArray
        [
          `A TypedArray - Int8Array`,
          {},
          // inputFactory
          () => new Int16Array(get_Array_of_numbers()),
          // expectedClone - like input
          new Int16Array(get_Array_of_numbers()),
          // expectedLoopOrEach
          get_Array_of_numbers().map((value, idx) => [value, idx, idx + 1]),
          // expectedMap
          new Int16Array(_.map(get_Array_of_numbers(), getMapProjection(2))),
          // expectedFiltered
          new Int16Array(_.filter(get_Array_of_numbers(), filterValues)),
          // expectedTake - first 3 items
          new Int16Array(_.take(get_Array_of_numbers(), TAKE_ITEMS_COUNT)),
        ],
        [
          `A TypedArray - BigInt64Array`,
          {},
          // inputFactory
          () => new BigInt64Array(get_Array_of_bigints()),
          // expectedClone - like input
          new BigInt64Array(get_Array_of_bigints()),
          // expectedLoopOrEach
          get_Array_of_bigints().map((value, idx) => [value, idx, idx + 1]),
          // expectedMap
          new BigInt64Array(_.map(get_Array_of_bigints(), getMapProjection(2))),
          // expectedFiltered
          new BigInt64Array(_.filter(get_Array_of_bigints(), filterValues)),
          // expectedTake - first 3 items
          new BigInt64Array(_.take(get_Array_of_bigints(), TAKE_ITEMS_COUNT)),
        ],
        [
          `A TypedArray - BigInt64Array with a filter (reject odd bigints)`,
          { filter: filterValues },
          // inputFactory
          () => new BigInt64Array(get_Array_of_bigints()),
          // expectedClone - filtered input!
          new BigInt64Array(_.filter(get_Array_of_bigints(), filterValues)),
          // expectedLoopOrEach
          _.filter(get_Array_of_bigints(), filterValues).map((value, idx) => [
            value,
            idx * 2,
            idx + 1,
          ]),
          // expectedMap
          new BigInt64Array(
            _.filter(get_Array_of_bigints(), filterValues).map(getMapProjection(2))
          ),
          // expectedFiltered
          new Error(`z.filter(): options.filter can NOT be used here - use filterCb only`),
          // expectedTake - first 3 items
          new BigInt64Array(
            _.take(_.filter(get_Array_of_bigints(), filterValues), TAKE_ITEMS_COUNT)
          ),
        ],
        [
          `A DataView`,
          { filterSingles: true },
          // inputFactory
          () => new DataView(new ArrayBuffer(8)),
          // expectedClone
          new DataView(new ArrayBuffer(8)),
          // expectedLoopOrEach as a single value
          (input) => [[input, null, 1]],
          // expectedMap
          new DataView(new ArrayBuffer(8)),
          // expectedFiltered
          new DataView(new ArrayBuffer(8)),
          // expectedTake
          new DataView(new ArrayBuffer(8)),
        ],

        // SUITE: # Single values, non-strict
        [
          `A number single with {loopSingles: false}, 0 iterations`,
          { loopSingles: false },
          // inputFactory
          () => 123,
          // expectedClone - same as input
          123,
          // expectedLoopOrEach - no iteration
          [],
          // expectedMap - mapped input
          223,
          // expectedFiltered - tested in clone-spec.ts - rejected cause its odd, returns NaN
          new Error(
            `z.project() as z.filter(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value 123`
          ),
          // expectedTake - tested in take-spec.ts - same as input
          DONE,
        ],
        [
          `A number single primitive with filterSingles: true, iterates over value & filter yields NOTHING`,
          { filterSingles: true },
          // inputFactory
          () => 123,
          // expectedClone - same as input
          123,
          // expectedLoopOrEach - single value as-is
          [[123, null, 1]],
          // expectedMap - mapped input
          223,
          // expectedFiltered - filtered input, rejected and NOTHING
          NOTHING,
          // expectedTake - same as input
          123,
        ],
        [
          `A string single primitive with {loopSingles: false}, 0 iterations`,
          { loopSingles: false, filterSingles: true },
          // inputFactory
          () => 'tooBad string',
          // expectedClone - same as input
          'tooBad string',
          // expectedLoopOrEach - no iteration
          [],
          // expectedMap - mapped input
          'tooBad string !changeByMapProjectionId#1!',
          // expectedFiltered - filtered input, as is
          NOTHING,
          // expectedTake - same as input
          'tooBad string',
        ],
        [
          `A string single primitive with filterSingles: true, iterates over value`,
          { filterSingles: true },
          // inputFactory
          () => 'tooBad string',
          // expectedClone - same as input
          'tooBad string',
          // expectedLoopOrEach - single value as-is
          [['tooBad string', null, 1]],
          // expectedMap - mapped input
          'tooBad string !changeByMapProjectionId#1!',
          // expectedFiltered - filtered input, as is
          NOTHING,
          // expectedTake - same as input
          'tooBad string',
        ],
        [
          `A WeakMap single with { loopSingles: false } - ignore it on non-strict mode`,
          { loopSingles: false },
          // inputFactory
          () => a_WeakMap_of_Person_Employees,
          // expectedClone - throws - not supported
          new Error(
            `z.clone(): Could not clone the given value: z.map(): WeakMap & WeakSet are not supported!`
          ),
          // expectedLoopOrEach - no iteration
          [],
          // expectedMap - throws - not supported
          new Error(`z.map(): WeakMap & WeakSet are not supported!`),
          // expectedFiltered - throws - not supported
          new Error(
            `z.project() as z.filter(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value [object WeakMap]`
          ),
          // expectedTake - throws - not supported
          new Error(
            `z.project() as z.take(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value [object WeakMap]`
          ),
        ],
        [
          `A WeakMap single with filterSingles: true, iterate over the value it self, throw on all others`,
          { filterSingles: true },
          // inputFactory
          () => a_WeakMap_of_Person_Employees,
          // expectedClone - throws
          new Error(
            `z.clone(): Could not clone the given value: z.map(): WeakMap & WeakSet are not supported!`
          ),
          // expectedLoopOrEach - single value as-is
          [[a_WeakMap_of_Person_Employees, null, 1]],
          // expectedMap - throws - not supported
          new Error(`z.map(): WeakMap & WeakSet are not supported!`),
          // expectedFiltered - throws - not supported
          new Error(`z.filter(): WeakMap & WeakSet are not supported!`),
          // expectedTake - throws - not supported
          new Error(`z.take(): WeakMap & WeakSet are not supported!`),
        ],
        [
          `A WeakSet single with { loopSingles: false } - ignore it on non-strict mode`,
          { loopSingles: false },
          // inputFactory
          () => a_WeakSet_of_Person,
          // expectedClone - throws
          new Error(
            `z.clone(): Could not clone the given value: z.map(): WeakMap & WeakSet are not supported!`
          ),
          [],
          // expectedMap - throws - not supported
          new Error(`z.map(): WeakMap & WeakSet are not supported!`),
          // expectedFiltered - throws - not supported
          new Error(
            `z.project() as z.filter(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value [object WeakSet]`
          ),
          // expectedTake - throws - not supported
          new Error(
            `z.project() as z.take(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value [object WeakSet]`
          ),
        ],
        [
          `A WeakSet single with filterSingles: true, iterate over the value it self`,
          { filterSingles: true },
          // inputFactory
          () => a_WeakSet_of_Person,
          // expectedClone - throws
          new Error(
            `z.clone(): Could not clone the given value: z.map(): WeakMap & WeakSet are not supported!`
          ),
          [[a_WeakSet_of_Person, null, 1]],
          // expectedMap - throws - not supported
          new Error(`z.map(): WeakMap & WeakSet are not supported!`),
          // expectedFiltered - throws - not supported
          new Error(`z.filter(): WeakMap & WeakSet are not supported!`),
          // expectedTake - throws - not supported
          new Error(`z.take(): WeakMap & WeakSet are not supported!`),
        ],
        [
          `A Boxed odd Number single, with filterSingles: true, iterates value, filter returns new Number(NaN) cause it's odd`,
          {
            filterSingles: true,
            singlesReject: undefined,
          },
          // inputFactory
          () => new Number(123),
          // expectedClone - same as input
          new Number(123),
          // expectedLoopOrEach
          [[new Number(123), null, 1]],
          // expectedMap
          new Number(223),
          // expectedFiltered rejected
          new Number(NaN),
          // expectedTake - same as input // rejecting singles tested in take-spec.ts
          new Number(123),
        ],
        [
          `A Boxed even Number single, with filterSingles: true & singlesReject: undefined, iterates overvalue & rejects with clone of NaN`,
          { filterSingles: true, singlesReject: undefined },
          // inputFactory
          () => new Number(123),
          // expectedClone - same as input
          new Number(123),
          // expectedLoopOrEach
          [[new Number(123), null, 1]],
          // expectedMap
          new Number(223),
          // expectedFiltered - rejected
          new Number(NaN),
          // expectedTake - same as input
          new Number(123),
        ],
        [
          `A Boxed String single, with filterSingles: true, iterates over value`,
          { filterSingles: true },
          // inputFactory
          () => new String('tooBad foo bar'),
          // expectedClone - same as input
          new String('tooBad foo bar'),
          // expectedLoopOrEach
          [[new String('tooBad foo bar'), null, 1]],
          // expectedMap
          new String('tooBad foo bar !changeByMapProjectionId#1!'),
          // expectedFiltered - default is NOTHING
          NOTHING,
          // expectedTake - same as input
          new String('tooBad foo bar'),
        ],
        [
          `A Boxed String single with tooBad, filter rejects it, with filterSingles: true, iterates over value`,
          {
            filterSingles: true,
            singlesReject: undefined,
          },
          // inputFactory
          () => new String('tooBad foo bar'),
          // expectedClone - same as input
          new String('tooBad foo bar'),
          // expectedLoopOrEach
          [[new String('tooBad foo bar'), null, 1]],
          // expectedMap
          new String('tooBad foo bar !changeByMapProjectionId#1!'),
          // expectedFiltered
          new String(''), // empty string
          // expectedTake - same as input - rejecting singles tested in take-spec.ts
          new String('tooBad foo bar'),
        ],
        [
          `A Boxed Boolean single, with filterSingles: true, iterates over value`,
          { filterSingles: true },
          // inputFactory
          () => new Boolean(true),
          // expectedClone - same as input
          new Boolean(true),
          // expectedLoopOrEach
          [[new Boolean(true), null, 1]],
          // expectedMap
          new Boolean(false),
          // expectedFiltered passing
          new Boolean(true),
          // expectedTake - same as input
          new Boolean(true),
        ],

        [
          `A Boxed Boolean single, rejected by filter, with filterSingles: true, iterates over value`,
          {
            filterSingles: true,
            singlesReject: undefined,
          },
          // inputFactory
          () => new Boolean(false),
          // expectedClone - same as input
          new Boolean(false),
          // expectedLoopOrEach
          [[new Boolean(false), null, 1]],
          // expectedMap
          new Boolean(true), // flipped
          // expectedFiltered
          new Boolean(), // rejected
          // expectedTake - same as input - rejecting singles tested in take-spec.ts
          new Boolean(false),
        ],

        // SUITE: Date
        [
          `A Date single, with filterSingles: true, iterates over Date value`,
          { filterSingles: true },
          // inputFactory
          () => new Date('2023-02-19'),
          // expectedClone - same as input
          new Date('2023-02-19'),
          // expectedLoopOrEach
          [[new Date('2023-02-19'), null, 1]],
          // expectedMap
          new Date('2023-02-20'),
          // expectedFiltered - passing filter
          new Date('2023-02-19'),
          //  expectedTake - same as input
          new Date('2023-02-19'),
        ],
        [
          `A Date single that is rejected by filterValues, with filterSingles: true, iterates over Date value`,
          {
            filterSingles: true,
            singlesReject: undefined,
          },
          // inputFactory
          () => new Date(2048, 0, 1),
          // expectedClone - same as input
          new Date(2048, 0, 1),
          // expectedLoopOrEach
          [[new Date(2048, 0, 1), null, 1]],
          // expectedMap
          new Date(2048, 0, 2),
          // expectedFiltered - rejected by filter
          new Date(null as any),
          // expectedTake - same as input - rejecting singles tested in take-spec.ts
          new Date(2048, 0, 1),
        ],
        [
          `A Date Single with extra props - with "props: 'all'" - iterates over props`,
          { props: 'all', symbol: true, filterSingles: true },
          // {},
          // inputFactory
          () => add_CommonProps(new Date('2023-02-19')),
          // expectedClone - same as input
          add_CommonProps(new Date('2023-02-19')),
          // expectedLoopOrEach
          (input) => [
            ...commonStringValuePropTuples,
            ...commonSymbolValuePropTuples,
            [input, null, 1],
          ],
          // expectedMap
          add_CommonProps(new Date('2023-02-20'), { map: getMapProjection() }),
          // expectedFiltered - passing filter
          add_CommonProps(new Date('2023-02-19'), { filter: filterValues }),
          // expectedTake - same as input
          add_CommonProps(new Date('2023-02-19'), { take: TAKE_ITEMS_COUNT }),
        ],

        [
          `An Error, with props and props: 'all' - iterates over props`,
          { props: 'all', symbol: true, filterSingles: true },
          // inputFactory
          () => add_CommonProps(new Error('An Error')),
          // expectedClone - same as input
          add_CommonProps(new Error('An Error')),
          // expectedLoopOrEach
          (input) => [
            ...commonStringValuePropTuples,
            ...commonSymbolValuePropTuples,
            [input, null, 1],
          ],
          // expectedMap
          add_CommonProps(new Error('An Error !changeByMapProjectionId#1!'), {
            map: getMapProjection(),
          }),
          // expectedFiltered - passing filter
          add_CommonProps(new Error('An Error'), { filter: filterValues }),
          // expectedTake - same as input
          add_CommonProps(new Error('An Error'), { take: TAKE_ITEMS_COUNT }),
        ],
        [
          `A RegExp, with props and props: 'all' - iterates over props`,
          { props: 'all', symbol: true, filterSingles: true },
          // inputFactory
          () => add_CommonProps(/abc/g),
          // expectedClone - same as input
          add_CommonProps(/abc/g),
          // expectedLoopOrEach
          (input) => [
            ...commonStringValuePropTuples,
            ...commonSymbolValuePropTuples,
            [input, null, 1],
          ],
          // expectedMap
          add_CommonProps(/abc!changeByMapProjectionId#1!/g, { map: getMapProjection() }),
          // expectedFiltered - passing filter
          add_CommonProps(/abc/g, { filter: filterValues }),
          // expectedTake - same as input
          add_CommonProps(/abc/g, { take: TAKE_ITEMS_COUNT }),
        ],

        // SUITE: strict mode - throws on Single values
        [
          `Single values, with strict: true - throws error`,
          { strict: true },
          // inputFactory
          () => 123,
          // expectedClone - throws
          new Error(
            `z.clone(): Could not clone the given value: z.loop(): strict = true, but wrong z.isMany type. With type(value) === 'number' & value = 123`
          ),
          // expectedLoopOrEach - throws
          new Error(
            `z.loop(): strict = true, but wrong z.isMany type. With type(value) === 'number' & value = 123`
          ),
          // expectedMap - throws
          new Error(
            `z.loop(): strict = true, but wrong z.isMany type. With type(value) === 'number' & value = 123`
          ),
          // expectedFiltered - throws
          new Error(
            `z.project() as z.filter(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value 123`
          ),
          // expectedTake - throws
          new Error(
            `z.project() as z.take(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value 123`
          ),
        ],
        [
          `A WeakSet - with strict: true - throws error`,
          { strict: true },
          // inputFactory
          () => a_WeakSet_of_Person,
          // expectedClone
          new Error(
            `z.clone(): Could not clone the given value: z.map(): WeakMap & WeakSet are not supported!`
          ),
          // expectedLoopOrEach
          new Error(
            `z.loop(): strict = true, but wrong z.isMany type. With type(value) === 'WeakSet' & value = [object WeakSet]`
          ),
          // expectedMap
          new Error(`z.map(): WeakMap & WeakSet are not supported!`),
          // expectedFiltered
          new Error(
            `z.project() as z.filter(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value [object WeakSet]`
          ),
          // expectedTake
          new Error(
            `z.project() as z.take(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value [object WeakSet]`
          ),
        ],
        [
          `A WeakMap - without strict: true - throws error`,
          { strict: true },
          // inputFactory
          () => a_WeakMap_of_Person_Employees,
          // expectedClone
          new Error(
            `z.clone(): Could not clone the given value: z.map(): WeakMap & WeakSet are not supported!`
          ),
          new Error(
            `z.loop(): strict = true, but wrong z.isMany type. With type(value) === 'WeakMap' & value = [object WeakMap]`
          ),
          // expectedMap
          new Error(`z.map(): WeakMap & WeakSet are not supported!`),
          // expectedFiltered
          new Error(
            `z.project() as z.filter(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value [object WeakMap]`
          ),
          // expectedTake
          new Error(
            `z.project() as z.take(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value [object WeakMap]`
          ),
        ],
        [
          `A Function - with strict: true - throws error`,
          { strict: true },
          // inputFactory
          () => a_Function_arrowNamed,
          // expectedClone
          new Error(
            `z.clone(): Could not clone the given value: z.loop(): strict = true, but wrong z.isMany type. With type(value) === 'function' & value = (arg1,arg2)=>\`double quotessingle quotesbacktick quotes\``
          ),
          // expectedLoopOrEach
          new Error(
            `z.loop(): strict = true, but wrong z.isMany type. With type(value) === 'function' & value = (arg1,arg2)=>\`double quotessingle quotesbacktick quotes\``
          ),
          // expectedMap
          new Error(
            `z.loop(): strict = true, but wrong z.isMany type. With type(value) === 'function' & value = (arg1,arg2)=>\`double quotessingle quotesbacktick quotes\``
          ),
          // expectedFiltered
          new Error(
            `z.project() as z.filter(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value (arg1,arg2)=>\`double quotessingle quotesbacktick quotes\``
          ),
          // expectedTake
          new Error(
            `z.project() as z.take(): Can't filter or take with filterSingles: false over an z.isSingleOrWeak value (arg1,arg2)=>\`double quotessingle quotesbacktick quotes\``
          ),
        ],

        // # Map SUITE

        [
          `A simple Map`,
          {},
          // inputFactory
          () => get_Map_of_TMapKeys_Tvalues_WithCommonProps(), // common props ignored in clone
          // expectedClone - same Map as input, without props: get_Map_of_TMapKeys_TvaluesWithCommonProps(), // should fail
          get_Map_of_TMapKeys_Tvalues(),
          // expectedLoopOrEach
          a_Array_ofKeys.map((key, idx) => [
            get_Map_of_TMapKeys_Tvalues().get(key),
            key,
            idx + 1,
          ]),
          // expectedMap of the Map
          new Map(
            a_Array_ofKeys.map((key) => [
              key,
              getMapProjection()(get_Map_of_TMapKeys_Tvalues().get(key)),
            ])
          ),

          // expectedFiltered
          new Map(
            a_Array_ofKeys
              .filter(filterValues)
              .map((key) => [key, get_Map_of_TMapKeys_Tvalues().get(key)])
          ),

          // expectedTake - TAKE_ITEMS_COUNT = 3 items
          new Map(
            _.take(a_Array_ofKeys, TAKE_ITEMS_COUNT).map((key) => [
              key,
              get_Map_of_TMapKeys_Tvalues().get(key),
            ])
          ),
        ],

        [
          `A Map with extra props, iterated & copied over`,
          { props: 'all', symbol: true },
          // inputFactory
          () => get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
          // expectedClone - same as input, including all props
          get_Map_of_TMapKeys_Tvalues_WithCommonProps(),
          // expectedLoopOrEach
          [
            // common props 1st
            ...commonStringValuePropTuples,
            ...commonSymbolValuePropTuples,

            // map values / keys after
            ...a_Array_ofKeys.map((key, idx) => [
              get_Map_of_TMapKeys_Tvalues().get(key),
              key,
              idx + 1,
            ]),
          ],
          // expectedMap of the Map - BREAKS
          add_CommonProps(
            new Map(
              a_Array_ofKeys.map((key) => [
                key,
                getMapProjection()(get_Map_of_TMapKeys_Tvalues().get(key)),
              ])
            ),
            {
              map: getMapProjection(),
            }
          ),
          // expectedFiltered
          add_CommonProps(
            new Map(
              a_Array_ofKeys
                .filter(filterValues)
                .map((key) => [key, get_Map_of_TMapKeys_Tvalues().get(key)])
            ),
            {
              filter: filterValues,
            }
          ),
          // expectedTake - TAKE_ITEMS_COUNT = 3 items
          add_CommonProps(
            new Map(
              _.take(a_Array_ofKeys, TAKE_ITEMS_COUNT).map((key) => [
                key,
                get_Map_of_TMapKeys_Tvalues().get(key),
              ])
            ),
            {
              take: TAKE_ITEMS_COUNT,
            }
          ),
        ],

        // ### Map Iterators

        [
          `A Map Iterator: Map.entries() - iterates over the same values as the underlying Map`,
          {},
          // inputFactory
          () => get_Map_of_TMapKeys_Tvalues().entries(),
          // clone throws, Iterators/Generators can't be restarted, so cloning per se is banned
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach - value 1st, key 2nd, count 3rd
          _.map(a_Array_ofKeys, (key, idx) => [
            get_Map_of_TMapKeys_Tvalues().get(key),
            key,
            idx + 1,
          ]),
          // expectedMap - testing the iteration results. map.entries() have [key, item] instead of [item, key]
          _.map(a_Array_ofKeys, (key) => [
            key,
            getMapProjection()(get_Map_of_TMapKeys_Tvalues().get(key)),
          ]),
          // expectedFiltered - testing the iteration results
          _.map(a_Array_ofKeys.filter(filterValues), (key) => [
            key,
            get_Map_of_TMapKeys_Tvalues().get(key),
          ]),
          // expectedTake - TAKE_ITEMS_COUNT = 3 items
          _.map(_.take(a_Array_ofKeys, TAKE_ITEMS_COUNT), (key) => [
            key,
            get_Map_of_TMapKeys_Tvalues().get(key),
          ]),
        ],

        [
          `A Map Iterator: Map.values() - iterates over the same values as the underlying Map`,
          {},
          // inputFactory
          () => get_Map_of_TMapKeys_Tvalues().values(),
          // clone throws
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach - value 1st, null key 2nd, count 3rd added automatically
          _.map(a_Array_ofKeys, (key, idx) => [
            get_Map_of_TMapKeys_Tvalues().get(key),
            null,
            idx + 1,
          ]),
          // expectedMap - testing the iteration results. map.values() have [item] instead of [key, item]
          _.map(a_Array_ofKeys, (key) =>
            getMapProjection()(get_Map_of_TMapKeys_Tvalues().get(key))
          ),
          // expectedFiltered - testing the iteration results
          _.map(a_Array_ofKeys.filter(filterValues), (key) =>
            get_Map_of_TMapKeys_Tvalues().get(key)
          ),
          // expectedTake - TAKE_ITEMS_COUNT = 3 items
          _.map(_.take(a_Array_ofKeys, TAKE_ITEMS_COUNT), (key) =>
            get_Map_of_TMapKeys_Tvalues().get(key)
          ),
        ],

        [
          `A Map Iterator: Map.keys() - iterates over the same keys as the underlying Map`,
          {},
          // inputFactory
          () => get_Map_of_TMapKeys_Tvalues().keys(),
          // clone throws
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach - value 1st, null key 2nd, count 3rd added automatically
          _.map(a_Array_ofKeys, (key, idx) => [key, null, idx + 1]),
          // expectedMap - testing the iteration results
          _.map(a_Array_ofKeys, (key) => getMapProjection()(key)),

          // expectedFiltered - testing the iteration results
          _.map(a_Array_ofKeys.filter(filterValues), (key) => key),
          // expectedTake - TAKE_ITEMS_COUNT = 3 items
          _.map(_.take(a_Array_ofKeys, TAKE_ITEMS_COUNT), (key) => key),
        ],

        // # Set SUITE

        [
          `A Set - iterates over the same values as a Map, but with keys === values`,
          {},
          // inputFactory
          () => get_Set_of_Tvalues(),
          // expectedClone - same as input
          get_Set_of_Tvalues(),
          // expectedLoopOrEach
          get_Array_of_Tvalues().map((val, idx) => [val, val]),
          // expectedMap of the Set
          new Set(a_Array_of_Tvalues.map(getMapProjection())),
          // expectedFiltered
          new Set(a_Array_of_Tvalues.filter(filterValues)),
          // expectedTake - TAKE_ITEMS_COUNT = 3 items
          new Set(_.take(a_Array_of_Tvalues, TAKE_ITEMS_COUNT)),
        ],
        [
          `A Set with extra props (ingored) - iterates over the same values as a Map, but with keys === values`,
          {},
          // inputFactory
          () => get_Set_of_Tvalues_withCommonProps(), // @todo(225): like above - use SpecZen EACH
          // expectedClone - same as input
          get_Set_of_Tvalues(),
          // expectedLoopOrEach
          get_Array_of_Tvalues().map((val, idx) => [val, val]),
          // expectedMap of the Set
          new Set(a_Array_of_Tvalues.map(getMapProjection())),
          // expectedFiltered
          new Set(a_Array_of_Tvalues.filter(filterValues)),
          // expectedTake - TAKE_ITEMS_COUNT = 3 items
          new Set(_.take(a_Array_of_Tvalues, TAKE_ITEMS_COUNT)),
        ],
        [
          `A Set with extra props & props: 'all' - iterates over Set values & props as well`,
          { props: 'all', symbol: true },
          // inputFactory
          () => get_Set_of_Tvalues_withCommonProps(),
          // expectedClone - same as input
          get_Set_of_Tvalues_withCommonProps(),
          // expectedLoopOrEach
          [
            ...commonStringValuePropTuples,
            ...commonSymbolValuePropTuples,
            ...a_Array_of_Tvalues.map((val, idx) => [val, val, idx + 1]),
          ],
          // expectedMap of the Set - both values & props are mapped
          add_CommonProps(new Set(a_Array_of_Tvalues.map(getMapProjection())), {
            map: getMapProjection(),
          }),
          // expectedFiltered - both values & props are filtered
          add_CommonProps(new Set(a_Array_of_Tvalues.filter(filterValues)), {
            filter: filterValues,
          }),
          // expectedTake - TAKE_ITEMS_COUNT = 3 items & 3 props
          add_CommonProps(new Set(_.take(a_Array_of_Tvalues, TAKE_ITEMS_COUNT)), {
            take: TAKE_ITEMS_COUNT,
          }),
        ],
        [
          `A Set with extra props & props only - iterates & maps over props only`,
          { props: true, symbol: true },
          // inputFactory
          () => get_Set_of_Tvalues_withCommonProps(),
          // expectedClone - props only on empty Set
          add_CommonProps(new Set()),
          // expectedLoopOrEach - props only
          [...commonStringValuePropTuples, ...commonSymbolValuePropTuples],
          // expectedMap of the Set - only props are mapped, empty Set
          add_CommonProps(new Set(), { map: getMapProjection() }),
          // expectedFiltered - only props are filtered, empty Set
          add_CommonProps(new Set(), { filter: filterValues }),
          // expectedTake - only props are taken, empty Set
          add_CommonProps(new Set(), { take: TAKE_ITEMS_COUNT }),
        ],

        // SUITE: Iterators
        [
          `A SetIterator: Set.entries() - iterates over the same values as the underlying Set`,
          {},
          // inputFactory
          () => get_Set_of_Tvalues().entries(),
          // expectedClone - throws
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach
          get_Array_of_Tvalues().map((val) => [val, val]),
          // expectedMap - testing the iteration results
          get_Array_of_Tvalues().map((val) => [
            getMapProjection()(val),
            getMapProjection()(val),
          ]),

          // expectedFiltered - testing the iteration results
          get_Array_of_Tvalues()
            .filter(filterValues)
            .map((val) => [val, val]),
          // expectedTake - TAKE_ITEMS_COUNT = 3 items
          _.take(
            get_Array_of_Tvalues().map((val) => [val, val]),
            TAKE_ITEMS_COUNT
          ),
        ],
        [
          `A SetIterator: Set.values() - iterates over the same values as the underlying Set`,
          {},
          // inputFactory
          () => get_Set_of_Tvalues().values(),
          // expectedClone - throws
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach
          get_Array_of_Tvalues().map((val) => [val]),
          // expectedMap - testing the iteration results of the iterator
          get_Array_of_Tvalues().map((val) => getMapProjection()(val)),
          // expectedFiltered - testing the iteration results of the iterator
          get_Array_of_Tvalues().filter(filterValues),
          // expectedTake - TAKE_ITEMS_COUNT = 3 items - testing the iteration results of the iterator
          _.take(get_Array_of_Tvalues(), TAKE_ITEMS_COUNT),
        ],
        [
          // @todo: Set.keys() Spec is exactly like Set.values(). Use SpecZen EACH
          `A SetIterator: Set.keys() - iterates over the same keys as the underlying Set`,
          {},
          // inputFactory
          () => get_Set_of_Tvalues().keys(),
          // expectedClone - throws
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach
          get_Array_of_Tvalues().map((val) => [val]),
          // expectedMap - testing the iteration results of the iterator
          get_Array_of_Tvalues().map((val) => getMapProjection()(val)),
          // expectedFiltered - testing the iteration results of the iterator
          get_Array_of_Tvalues().filter(filterValues),
          // expectedTake - TAKE_ITEMS_COUNT = 3 items - testing the iteration results of the iterator
          _.take(get_Array_of_Tvalues(), TAKE_ITEMS_COUNT),
        ],

        // # POJSO Iterators

        [
          `A POJSO Iterator with Symbol.iterator() - iterates over iterator values, ignoring props`,
          {},
          // inputFactory
          () => get_plainIteratorPOJSO(),
          // expectedClone - throws
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach
          _.map(a_Array_of_Tvalues, (val) => [val, null]),
          // expectedMap - we're actually testing the iteration results below, this not the actual mapped value
          _.map(a_Array_of_Tvalues, (val, idx) => getMapProjection()(val, idx)),
          // expectedFiltered - we're actually testing the iteration results below, this not the actual filtered value:
          _.map(a_Array_of_Tvalues.filter(filterValues), (val, idx) => val),
          // expectedTake - we're actually testing the iteration results below, this not the actual taken value:
          _.map(a_Array_of_Tvalues.slice(0, TAKE_ITEMS_COUNT), (val, idx) => val),
        ],

        [
          `A POJSO Iterator with Symbol.iterator() & props: 'all' iterates over the iterator values, as well as the underlying POJSO props`,
          {
            props: 'all',
            symbol: true,
          },
          // inputFactory
          () => get_plainIteratorPOJSO(),
          // expectedClone - throws
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach
          (input) => [
            // props 1st
            [input.next, 'next'],
            ['someOtherValue', 'someOtherProp1'],
            [['someOther', 'ArrayValue'], 'someOtherProp2'],
            ['tooBadPropValue - rejected by filter', 'tooBadProp'],
            [input[Symbol.iterator], Symbol.iterator],
            [{ someOther: 'SymbolObjectValue' }, Symbol.for('someSymbolProp')],

            // LoopGenerator values
            ..._.map(a_Array_of_Tvalues, (val, idx) => [val, null, idx + 1]),
          ],
          // expectedMap - we're actually testing the iteration results below, this not the actual mapped value
          // props are missing in test, tested in map-spec.ts
          _.map(a_Array_of_Tvalues, (val, idx) => getMapProjection()(val, idx)),

          // expectedFilter
          _.map(a_Array_of_Tvalues.filter(filterValues), (val, idx) => val),

          // expectedTake - we're actually testing the iteration results below, this not the actual taken value:
          _.map(a_Array_of_Tvalues.slice(0, TAKE_ITEMS_COUNT), (val, idx) => val),
        ],
        [
          `A POJSO Iterator with Symbol.iterator() & props: 'all' & custom map. It iterates over the mapped iterator values, as well as the underlying POJSO props. map() fails cause options.map exists`,
          {
            props: 'all',
            symbol: true,
            map: getMapProjection(9),
          },
          // inputFactory
          () => get_plainIteratorPOJSO(),
          // expectedClone - throws
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach
          (input) => [
            // props 1st
            [input.next, 'next'],
            ['someOtherValue !changeByMapProjectionId#9!', 'someOtherProp1'],
            [['!changeByMapProjectionId#9!', 'someOther', 'ArrayValue'], 'someOtherProp2'],
            ['tooBadPropValue - rejected by filter !changeByMapProjectionId#9!', 'tooBadProp'],
            [input[Symbol.iterator], Symbol.iterator],
            [
              { changeByMapProjectionId9: 9, someOther: 'SymbolObjectValue' },
              Symbol.for('someSymbolProp'),
            ],

            // iterator values
            ..._.map(a_Array_of_Tvalues, (val, idx) => [
              getMapProjection(9)(val, idx),
              null,
              idx + 1,
            ]),
          ],

          // expectedMap - throws
          new Error(`z.map(): options.map can NOT be used here - use mapCb only`),

          // expectedFilter - we actually test the iteration results below, not the actual return value of z.filter(), nor props
          _.map(a_Array_of_Tvalues.filter(filterValues), (val, idx) =>
            getMapProjection(9)(val, idx)
          ),
          // eg:
          // [
          //    [ 922,  [null] ],
          //    [ "A string Tvalue !changeByMapProjectionId#9!", [null] ],
          //    ...
          // ]

          // expectedTake - we're actually testing the iteration results below, this not the actual taken value:
          _.map(a_Array_of_Tvalues.slice(0, TAKE_ITEMS_COUNT), (val, idx) =>
            getMapProjection(9)(val, idx)
          ),
        ],
        [
          `A POJSO Iterator with Symbol.iterator() & props: "only" iterates only over the underlying POJSO props`,
          {
            props: true,
            symbol: true,
            strict: true,
          },
          // inputFactory
          () => get_plainIteratorPOJSO(),
          // expectedClone - throws
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach
          (input) => [
            // props only here
            [input.next, 'next'],
            ['someOtherValue', 'someOtherProp1'],
            [['someOther', 'ArrayValue'], 'someOtherProp2'],
            ['tooBadPropValue - rejected by filter', 'tooBadProp'],
            [input[Symbol.iterator], Symbol.iterator],
            [{ someOther: 'SymbolObjectValue' }, Symbol.for('someSymbolProp')],
          ],
          // expectedMap with symbols:true & strict: true throws
          new TypeError(
            `z.map(): Cannot map over an Iterator or an AsyncIterator with symbol: true & strict: true`
          ),
          // expectedFilter
          new TypeError(
            `z.filter(): Cannot filter over an Iterator or an AsyncIterator with symbol: true & strict: true`
          ),
          // expectedTake
          new TypeError(
            `z.take(): Cannot take over an Iterator or an AsyncIterator with symbol: true & strict: true`
          ),
        ],

        // Suite: Generators
        [
          `A Generator - iterates over the values of the Generator / Iterator`,
          {},
          // inputFactory
          () => get_Generator_of_Tvalues_withCommonProps(),
          // expectedClone - throws
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          _.map(a_Array_of_Tvalues, (val) => [val]),
          // expectedMap: see map-spec.ts for props tests
          _.map(a_Array_of_Tvalues, (val, idx) => getMapProjection()(val, idx)),
          // expectedFilter:  see filter-spec.ts for props tests
          _.map(a_Array_of_Tvalues.filter(filterValues), (val, idx) => val),
          // expectedTake 3 items - see take-spec.ts for props tests
          _.map(a_Array_of_Tvalues.slice(0, TAKE_ITEMS_COUNT), (val, idx) => val),
        ],

        [
          `An AsyncGenerator - iterates over the values of the Async Generator / Iterator`,
          { _itemsCount: a_Array_of_Tvalues.length },
          // inputFactory
          () => get_AsyncGenerator_of_Tvalues_withCommonProps(),
          // expectedClone
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          _.map(a_Array_of_Tvalues, (val, idx) => [val, null, idx + 1]),
          // expectedMap - done in map-spec.ts for props tests
          DONE,
          // expectedFilter - done in filter-spec.ts for props tests
          DONE,
          // expectedTake - done in take-spec.ts for props tests
          DONE,
        ],
        [
          `An AsyncGenerator with props: 'all' - iterates over the props & values of the Async Generator / Iterator`,
          {
            _itemsCount: a_Array_of_Tvalues.length,
            props: 'all',
          },
          // inputFactory
          () => get_AsyncGenerator_of_Tvalues_withCommonProps(),
          // expectedClone
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          // expectedLoopOrEach
          [
            // props first
            ...commonStringValuePropTuples,

            // iterator values - restarts the count
            ..._.map(a_Array_of_Tvalues, (val, idx) => [val, null, idx + 1]),
          ],
          // expectedMap - done in map-spec.ts for props tests
          DONE,
          // expectedFilter - done in filter-spec.ts for props tests
          DONE,
          // expectedTake - done in take-spec.ts for props tests
          DONE,
        ],
        [
          `An AsyncGenerator with props: true & symbol - iterates over only props`,
          {
            _itemsCount: 0, // we have no slow Async Items iteration with props: only
            props: true,
            symbol: true,
          },
          // inputFactory
          () => get_AsyncGenerator_of_Tvalues_withCommonProps(),
          // expectedClone
          new TypeError(
            `z.clone(): Cannot clone an Iterator/Generator or an Async Generator/Iterator, cause they cant be restarted! You can map over the **remaining items** of the iterator by using \`z.map()\` instead`
          ),
          [...commonStringValuePropTuples, ...commonSymbolValuePropTuples],
          // expectedMap - done in map-spec.ts for props tests
          DONE,
          // expectedFilter - done in filter-spec.ts for props tests
          DONE,
          // expectedTake - done in take-spec.ts for props tests
          DONE,
        ],
      ],
      ([
        description,
        options,
        inputFactory,
        expectedClone,
        expectedLoopOrEach,
        expectedMap,
        expectedFilter,
        expectedTake,
      ]: [
        string,
        IAllTestOptions,
        any, // inputFactory
        any, // expectedClone if !!expectedClone
        [number | string | symbol, any, number?][] | Error | Function, // expectedLoopOrEach
        any?, // expectedMap
        any?, // expectedFilter
        any?, // expectedTake
      ]) =>
        _.each(theTakes(), (defaultOptions) => {
          // add some artificial testFunctions

          // Test configuration: filtering of chosen tests
          if (testFunctionOnly && !_.isEqual(testFunction, testFunctionOnly)) return

          if (
            descriptionSearch &&
            !_.includes(_.toLower(description), _.trim(_.toLower(descriptionSearch)))
          )
            return // Test Descriptions starting

          const finalOptions: IAllTestOptions = {
            ...defaultOptions,
            ...options,
          }

          // console.log(`\n************ ENTERING ${testFunction} \nENTERING options=`, options, `\nENTERING  defaultOptions=`, defaultOptions, '\ninitial finalOptions=', finalOptions)
          if (
            (testFunction === filter_STOPed_resembling_take && finalOptions.filter) ||
            (testFunction === map_STOPed_resembling_take && finalOptions.map)
          )
            return // #######
            // ####### prettier insists on this formatting abomination
          ;(onlyThisSuite && !testFunctionOnly ? describe.only : describe)(
            `\n${description}`,
            () => {
              let expected: any = null

              const input = inputFactory()

              switch (testFunction) {
                case 'loop':
                case 'each': {
                  // if expected is a function, call it with input
                  expected = _.isFunction(expectedLoopOrEach)
                    ? expectedLoopOrEach(input)
                    : expectedLoopOrEach

                  // if expected is an array, add null as 2nd item if missing, and the count as 3rd, again if missing
                  if (_.isArray(expected))
                    expected = expected.map(expectedIterationResultsNullCountProjection) as any

                  break
                }
                case 'clone':
                  expected = expectedClone
                  break
                case 'map':
                  expected = expectedMap
                  break
                case map_STOPed_resembling_take: {
                  expected = limitExpectedByTake(expectedMap, finalOptions, TAKE_ITEMS_COUNT)
                  // NOTE: we might skip the synthetic test below, based on conditions
                  break
                }
                case 'filter':
                  expected = expectedFilter
                  break
                case 'take':
                case filter_STOPed_resembling_take:
                  // Synthetic tests - will be limited below to allowed tests & proper take limit
                  expected = expectedTake // already limited by TAKE_ITEMS_COUNT
                  break
                default:
                  expected = new Error(
                    `Test internal error while setting expected - unknown testFunction '${testFunction}'`
                  )
              }

              finalOptions._itemsAndPropsCountDelay =
                Math.min((finalOptions.take as any) || 0, finalOptions._itemsCount || 0) || 0

              // ### injected `defaultOptions.take` ###

              // Note: not suitable for all scenarios. We need to omit & adjust some tests, if `take` is in defaultOptions
              if (isNumber(defaultOptions.take)) {
                // console.log(testFunction + ' Entering defaultOptions.take', defaultOptions.take)

                // skip the synthetic test if these conditions are met
                if (testFunction === 'take') return
                if (
                  ['map', 'filter'].includes(testFunction) &&
                  (options.sparse || options.props)
                )
                  return

                if (
                  !(
                    // allowed tests listed
                    (
                      (['each', 'loop', 'map', 'filter'].includes(testFunction) &&
                        (_.isArray(expected) || isTypedArray(expected))) ||
                      (testFunction === 'filter_STOPed_resembling_take' &&
                        (defaultOptions.take === TAKE_ITEMS_COUNT || // use vebratim, includes all types
                          ((_.isArray(expected) || isTypedArray(expected)) && // only for arrays, that can be limited by numeric take
                            (defaultOptions.take === 0 ||
                              (defaultOptions.take < TAKE_ITEMS_COUNT &&
                                !finalOptions.sparse &&
                                !finalOptions.props)))))
                    )
                  )
                ) {
                  it.skip(`SKIPPED WHY?: ${testFunction} expected=${util.inspect(expected)} finalOptions=${util.inspect(finalOptions)}`, () => {
                    expect(true).to.be.true
                  })

                  return
                }

                adjustItemsAndPropsCountDelay(finalOptions, input)

                // Full tests (all types, sparse & props), only if defaultOptions.take === TAKE_ITEMS_COUNT
                if (
                  testFunction === 'filter_STOPed_resembling_take' &&
                  defaultOptions.take === TAKE_ITEMS_COUNT
                )
                  expected = expectedTake // already limited by TAKE_ITEMS_COUNT & includes expected sparse & props results
                else expected = limitExpectedByTake(expected, finalOptions)

                // console.log('FINAL expected========', expected)
              }

              const getSUITEname = (_testName: string | TTestFunction = testFunction) => {
                return `${cFunction(`${_testName}`)}(
                ${c.yellow('input')}: ${cType(input)} = ${c.green(util.inspect(input))}
                ${c.yellow('defaultOptions=')}: ${util.inspect(defaultOptions)},
                ${c.yellow('options=')}: ${util.inspect(options)},
                ${c.yellow('finalOptions=')}: ${util.inspect(finalOptions)}\n\n`
              }

              switch (testFunction) {
                case 'each':
                case 'loop': {
                  describe(
                    getSUITEname(testFunction === 'loop' ? `for...of z.loop()` : `z.each()`),
                    () => {
                      let resultForOf_Each: [any, any?][] | Error | null = null
                      let eachCallResult: any = null
                      let loopGenerator: any = null
                      let duration: number | null = null

                      const functionTitle = `\`${cFunction(
                        testFunction === 'loop'
                          ? `for const [val/*: ${c.dim(cType(input))}*/, idxOrKey] of loop(val) {}`
                          : `z.each(val/*: ${c.dim(cType(input))}*/, (val, idxOrKey) => ...)`
                      )}\``

                      before(async () => {
                        try {
                          resultForOf_Each = []

                          switch (testFunction) {
                            case 'loop': {
                              loopGenerator = loop(input, finalOptions)

                              if (isAsyncIterator(input) || isAsyncGenerator(input)) {
                                const timeStart = Date.now()
                                for await (const item of loopGenerator)
                                  resultForOf_Each.push(item)
                                duration = Date.now() - timeStart
                              } else {
                                for (const item of loopGenerator) resultForOf_Each.push(item)
                              }

                              break
                            }
                            case 'each': {
                              try {
                                const timeStart = Date.now()
                                eachCallResult = each(
                                  input,
                                  (item, idxOrKey, _value, count) => {
                                    const result: any[] = [item, idxOrKey, count]
                                    ;(resultForOf_Each as any).push(result as any)
                                  },
                                  finalOptions
                                )

                                await eachCallResult
                                duration = Date.now() - timeStart
                                // resultForOf_Each = _resultEach
                              } catch (error) {
                                console.log('ERROR expected', expected, 'error', error)
                                resultForOf_Each = error as any
                              }

                              break
                            }
                          }
                        } catch (error) {
                          resultForOf_Each = error as any
                        }
                      })

                      if (_.isError(expected)) {
                        it(`throws: matches expected Error, with ${functionTitle}`, () => {
                          expect(resultForOf_Each).to.be.an('error')
                          expect((resultForOf_Each as any).toString()).to.equal(
                            expected.toString()
                          )
                        })
                      } else if (_.isArray(expected)) {
                        it(`correct result with ${functionTitle}: ${util.inspect(expected)}`, () => {
                          if (!_.isEqual(resultForOf_Each, expected)) {
                            console.error(
                              c.red(`Discrepancy in ${functionTitle}: \nresult =\n`),
                              util.inspect(resultForOf_Each),
                              c.red(`\nexpected =\n`),
                              util.inspect(expected)
                            )
                          }

                          // console.error(expected[0][0] === resultForOf_Each[0][0])

                          expect(resultForOf_Each).to.deep.equal(expected)
                          expect((resultForOf_Each as any).length).to.equal(expected.length)
                        })

                        if (isAsyncIterator(input) || isAsyncGenerator(input)) {
                          describe(`It's an AsyncIterator / AsyncGenerator:`, () => {
                            it.skip(`iterates in a reasonable time`, () => {
                              const expectedDuration =
                                delaySecs * (finalOptions as any)._itemsAndPropsCountDelay ||
                                0 * 1000

                              expect(duration).to.be.lessThan(expectedDuration + 20)
                              expect(duration).to.be.greaterThan(expectedDuration - 2)
                            })

                            switch (testFunction) {
                              case 'loop': {
                                if (finalOptions.props === true) {
                                  it(`loopGenerator is an NOT an AsyncIterator, cause props: true (i.e only)`, () => {
                                    expect(isAsyncIterator(loopGenerator)).to.be.false
                                  })

                                  it(`loopGenerator is a Generator, cause props: true (i.e only)`, () => {
                                    expect(isGenerator(loopGenerator)).to.be.true
                                  })
                                } else {
                                  // async iteration over items
                                  it(`loopGenerator is a AsyncGenerator`, () => {
                                    expect(isAsyncGenerator(loopGenerator)).to.be.true
                                  })
                                }

                                break
                              }

                              case 'each': {
                                if (finalOptions.props === true) {
                                  it(`eachCallResult is NOT a Promise, cause props: true (i.e only)`, () => {
                                    expect(isPromise(eachCallResult)).to.be.false
                                  })

                                  it(`each() returns input, without await, cause props: true (i.e only)`, async () => {
                                    expect(eachCallResult).to.be.equal(input)
                                  })
                                } else {
                                  // async iteration over items
                                  it(`eachCallResult is a Promise`, () => {
                                    expect(isPromise(eachCallResult)).to.be.true
                                  })

                                  it(`awaited each() returns input`, async () => {
                                    expect(await eachCallResult).to.be.equal(input)
                                  })
                                }
                                break
                              }
                            }
                          })
                        } else {
                          switch (testFunction) {
                            case 'loop': {
                              it(`loopGenerator is a Generator`, () => {
                                expect(isGenerator(loopGenerator)).to.be.true
                              })
                              break
                            }

                            case 'each': {
                              it(`each() returns input`, () => {
                                expect(eachCallResult).to.be.equal(input)
                              })
                              break
                            }
                          }
                        }
                      } else {
                        throw new TypeError(
                          `expectedLoopOrEach is not an Error, Function or an Array: ${util.inspect(expected)}`
                        )
                      }
                    }
                  )

                  break
                }

                case 'map':
                case 'clone':
                case 'filter':
                case filter_STOPed_resembling_take:
                case map_STOPed_resembling_take:
                case 'take': {
                  describe(getSUITEname(), () => {
                    if (
                      ([map_STOPed_resembling_take, filter_STOPed_resembling_take].includes(
                        testFunction
                      ) &&
                        isSingleOrWeak(input)) ||
                      (isAnyJustIterator(input) && finalOptions.symbol && finalOptions.strict)
                    )
                      return

                    let result: any | Error = null

                    before(async () => {
                      try {
                        // @todo: implement isAsyncIterator / isAsyncGenerator
                        if (isAsyncIterator(input) || isAsyncGenerator(input)) {
                          // await each(input, finalOptions, async (item, idxOrKey) => {
                          //   // resultEach.push([item, idxOrKey])
                          // })
                          if (!_.isError(expected))
                            throw new Error(
                              ' isAsyncIterator / isAsyncGenerator NOT IMPLEMENTED HERE'
                            )
                        }

                        switch (testFunction) {
                          case 'map':
                            result = map(input, getMapProjection(), finalOptions)
                            break
                          case 'clone':
                            result = clone(input, finalOptions)
                            break
                          case 'filter':
                            result = filter(input, filterValues, finalOptions)
                            break
                          case 'take':
                            result = take(input, TAKE_ITEMS_COUNT, finalOptions)
                            break
                          case filter_STOPed_resembling_take:
                            result = filter(
                              input,
                              filter_takeN(
                                isNumber(defaultOptions.take)
                                  ? defaultOptions.take
                                  : TAKE_ITEMS_COUNT
                              ),
                              finalOptions
                            )
                            break
                          case map_STOPed_resembling_take:
                            result = map(
                              input,
                              map_takeN(
                                isNumber(defaultOptions.take)
                                  ? defaultOptions.take
                                  : TAKE_ITEMS_COUNT
                              ),
                              finalOptions
                            )
                            break
                          default:
                            throw new Error(
                              `Test internal error while switch (testFunction) { result = xxx } - unknown testFunction '${testFunction}'`
                            )
                        }
                      } catch (error) {
                        result = error
                      }
                    })

                    if (_.isError(expected)) {
                      it(`throws: ${cFunction(`z.${testFunction}`)} matches expected Error`, () => {
                        expect(result.toString()).to.equal(expected.toString())
                      })
                    } else {
                      if (expected === undefined) {
                        it.skip(`WARNING: testFunction: ${testFunction} expected === undefined for ${getSUITEname()}`, () =>
                          expect(true).to.equal(false))
                        return
                      }

                      if (expected === DONE) {
                        // it(`NOT SUPPORTED / CANT BE IMPLEMENTED HERE`, () => {})
                        return
                      }

                      if (isNothing(expected))
                        it(`${cFunction(`z.${testFunction}`)} result is '${String(NOTHING)}'`, () => {
                          expect(result).to.equal(NOTHING)
                        })
                      else
                        it(`${cFunction(`z.${testFunction}`)} result is the correct type of '${cType(input)}'`, () => {
                          if (type(result) === type(input))
                            expect(type(result)).to.equal(type(input))
                          else {
                            console.error(
                              c.red(`z.${testFunction} type(result) !== type(input)`),
                              '\n type(input) =',
                              type(input),
                              '\n type(result)=',
                              type(result)
                            )
                            expect(type(result)).to.equal(type(input))
                          }
                        })

                      // @todo: isAsyncIterator(input) || isAsyncGenerator(input) ||

                      if (isGenerator(input) || isPlainIterator(input)) {
                        // expected is an Array or (input) => array, irrespective of the input type
                        // to compare the iteration results with expected
                        it(`${cFunction(
                          `z.${testFunction}`
                        )} returns correct iteration of Generator/Plain Iterator result of '${cType(input)}':`, async () => {
                          const iterationResult: any[] = []

                          for (const item of result) iterationResult.push(item)

                          expect(iterationResult).to.deep.equal(
                            isFunction(expected) ? expected(input) : expected
                          )
                        })

                        // we can't check the right keys are copied over, but we've tested this with POJSOs & in filter-spec / map-spec
                      } else {
                        it(`${cFunction(
                          `z.${testFunction}`
                        )} returns correct projection of '${cType(input)}': ${util.inspect(expected)}`, () => {
                          if (
                            isEqual(result, expected, {
                              // always consider all props, for effective comparison
                              props: 'all',
                              symbol: true,
                              exclude: [`next`, Symbol.iterator, Symbol.asyncIterator],
                              dataViewType: options.dataViewType,
                            })
                          )
                            expect(true).to.equal(true)
                          else {
                            console.error(
                              c.red(`z.${testFunction} NOT (isEqual(result, expected)`),
                              'expected =',
                              expected,
                              '\n result=',
                              result
                            )
                            expect(false).to.equal(true)
                          }
                        })

                        if (_.isObject(input) && !isNothing(expected))
                          it(`${cFunction(`z.${testFunction}`)} returns a new value / different ref '${cType(input)}'`, () => {
                            expect(result).to.not.equal(input)
                            expect(result).to.not.equal(expectedClone)
                            expect(result).to.not.equal(expectedMap)
                            expect(result).to.not.equal(expectedFilter)
                          })

                        if (
                          (_.isArray(expected) || _.isSet(expected)) &&
                          !finalOptions.filter
                        ) {
                          it(`${cFunction(`z.${testFunction}`)} returns '${cType(input)}' with correct size/length`, () => {
                            expect(_.size(result)).to.equal(_.size(expected))
                          })
                        }
                      }
                    }
                  })

                  break
                }

                default:
                  throw new Error(
                    `Test SpecHandler **Internal Error**: Unknown testFunction: ${testFunction}`
                  )
              }
            }
          )
        })
    )
  })
