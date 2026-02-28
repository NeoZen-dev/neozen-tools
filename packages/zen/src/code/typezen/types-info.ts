import { TypedArray, ValueOf } from 'type-fest'

import { AsyncFunction } from './isAsyncFunction'
import { MapIteratorEntries } from './isMapIterator'
import { SetIteratorEntries } from './isSetIterator'
import {
  GeneratorReturnType,
  InstanceTypeAll,
  InsideKeys,
  InsideValues,
  PropsString,
  PropsSymbol,
  TypedArrayExact,
  ValueOfStrict,
} from './type-utils'

// Note: the types are used when using keys()/values()/loop() etc functions, but the values literals are only used in tests! Props & and values are always fresh data, retrieved at runtime!

// Common - Object

export const object_stringNonEnumerablesInheritedTop = [
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'valueOf',
  'toLocaleString',
  'toString',
] as const

// @ts-expect-error OK constructor missing in keyof Object, but returned at runtime
object_stringNonEnumerablesInheritedTop.push('constructor')

export type Tobject_stringNonEnumerablesInheritedTop =
  (typeof object_stringNonEnumerablesInheritedTop)[number]

export const object_stringNonEnumerablesInheritedTopHidden = [
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
  '__proto__',
] as const

export type Tobject_stringNonEnumerablesInheritedTopHidden =
  (typeof object_stringNonEnumerablesInheritedTopHidden)[number]

export const object_stringNonEnumerablesInheritedTop_values =
  object_stringNonEnumerablesInheritedTop.map((v) => ({})[v])

// ### Array props

export const array_prototype_stringNonEnumerablesOwn = ['length'] as const // appears both as own & inherited

export type Tarray_prototype_stringNonEnumerablesOwn =
  (typeof array_prototype_stringNonEnumerablesOwn)[number] // i.e "length"[]

export const array_prototype_stringNonEnumerablesInherited = [
  'at',
  'concat',
  'copyWithin',
  'fill',
  'find',
  'findIndex',
  'lastIndexOf',
  'pop',
  'push',
  'reverse',
  'shift',
  'unshift',
  'slice',
  'sort',
  'splice',
  'includes',
  'indexOf',
  'join',
  'keys',
  'entries',
  'values',
  'forEach',
  'filter',
  'flat',
  'flatMap',
  'map',
  'every',
  'some',
  'reduce',
  'reduceRight',
  'toLocaleString',
  'toString',
] as const satisfies PropsString<Array<any>>[]

// @ts-expect-error OK appears both here and array_prototype_stringNonEnumerablesOwn
array_prototype_stringNonEnumerablesInherited.unshift('length')

export const array_prototype_stringNonEnumerablesInherited_ES2023 = [
  'findLast',
  'findLastIndex',
  'toReversed',
  'toSorted',
  'toSpliced',
  'with',
] as const satisfies PropsString<Array<any>>[]

// @ts-expect-error OK constructor missing in keyof Array, but returned at runtime
array_prototype_stringNonEnumerablesInherited_ES2023.push('constructor')

export type Tarray_prototype_stringNonEnumerablesInherited =
  | (typeof array_prototype_stringNonEnumerablesInherited)[number]
  | (typeof array_prototype_stringNonEnumerablesInherited_ES2023)[number]

export const array_prototype_symbolNonEnumerablesInherited = [
  Symbol.iterator,
  Symbol.unscopables,
] as const satisfies PropsSymbol<Array<any>>[]

export type Tarray_prototype_symbolNonEnumerablesInherited =
  (typeof array_prototype_symbolNonEnumerablesInherited)[number]

// ### Array values

export type Tarray_prototype_stringNonEnumerablesOwn_values = number // length

export type Tarray_prototype_stringNonEnumerablesInherited_values<Tinput> = ValueOfStrict<
  Array<InsideValues<Tinput>>,
  Tarray_prototype_stringNonEnumerablesInherited
>

export type Tarray_prototype_symbolNonEnumerablesInherited_values<Tinput> = ValueOfStrict<
  Array<InsideValues<Tinput>>,
  Tarray_prototype_symbolNonEnumerablesInherited
>

// ### IArguments (they behave mostly like an array, but with NumberString indexes as NestedKeys)
// Unlike Arrays and all other system objects, they have only extra properties only as own, no inherited ones

export const arguments_prototype_stringNonEnumerablesOwn = [
  'length',
  'callee',
] as const satisfies PropsString<IArguments>[]
export type Targuments_prototype_stringNonEnumerablesOwn =
  (typeof arguments_prototype_stringNonEnumerablesOwn)[number]

export const arguments_prototype_symbolNonEnumerablesOwn = [
  Symbol.iterator,
] as const satisfies PropsSymbol<IArguments>[]
export type Targuments_prototype_symbolNonEnumerablesOwn =
  (typeof arguments_prototype_symbolNonEnumerablesOwn)[number]

export const arguments_prototype_stringNonEnumerablesInherited: never[] = [] as const
export const arguments_prototype_stringNonEnumerablesInherited_ES2023: never[] = [] as const

export type Targuments_prototype_stringNonEnumerablesInherited =
  | (typeof arguments_prototype_stringNonEnumerablesInherited)[number]
  | (typeof arguments_prototype_stringNonEnumerablesInherited_ES2023)[number]

export const arguments_prototype_symbolNonEnumerablesInherited: never[] = [] as const
export type Targuments_prototype_symbolNonEnumerablesInherited =
  (typeof arguments_prototype_symbolNonEnumerablesInherited)[number]

// ### IArguments values. Note: reading arguments values (of props like `callee`) breaks at runtime

export type Targuments_prototype_stringNonEnumerablesOwn_values = ValueOfStrict<
  IArguments,
  Targuments_prototype_stringNonEnumerablesOwn
>
export type Targuments_prototype_stringNonEnumerablesInherited_values = ValueOfStrict<
  IArguments,
  Targuments_prototype_stringNonEnumerablesInherited
>
export type Targuments_prototype_symbolNonEnumerablesOwn_values = () => IterableIterator<any>
export type Targuments_prototype_symbolNonEnumerablesInherited_values = ValueOfStrict<
  IArguments,
  Targuments_prototype_symbolNonEnumerablesInherited
>

// ### TypedArray props

// Typed arrays don't have own properties (no length)
export const typedArray_prototype_stringNonEnumerablesOwn: never[] = []
export type TtypedArray_prototype_stringNonEnumerablesOwn =
  (typeof typedArray_prototype_stringNonEnumerablesOwn)[number]

export const typedArray_prototype_stringNonEnumerablesInherited = [
  'BYTES_PER_ELEMENT',
  'buffer',
  'byteLength',
  'byteOffset',
  'length',
  'entries',
  'keys',
  'values',
  'at',
  'copyWithin',
  'every',
  'fill',
  'filter',
  'find',
  'findIndex',
  'forEach',
  'includes',
  'indexOf',
  'join',
  'lastIndexOf',
  'map',
  'reverse',
  'reduce',
  'reduceRight',
  'set',
  'slice',
  'some',
  'sort',
  'subarray',
  'toLocaleString',
  'toString',
] as const satisfies PropsString<TypedArray>[]

export const typedArray_prototype_stringNonEnumerablesInherited_ES2023 = [
  'findLast',
  'findLastIndex',
  'toReversed',
  'toSorted',
  'with',
] as const satisfies PropsString<TypedArray>[]

// @ts-expect-error OK constructor missing in keyof, but returned at runtime
typedArray_prototype_stringNonEnumerablesInherited_ES2023.unshift('constructor')

export type TtypedArray_prototype_stringNonEnumerablesInherited =
  | (typeof typedArray_prototype_stringNonEnumerablesInherited)[number]
  | (typeof typedArray_prototype_stringNonEnumerablesInherited_ES2023)[number]

export const typedArray_prototype_symbolNonEnumerablesInherited = [
  Symbol.iterator,
  Symbol.toStringTag,
] as const satisfies PropsSymbol<TypedArray>[]

export type TtypedArray_prototype_symbolNonEnumerablesInherited =
  (typeof typedArray_prototype_symbolNonEnumerablesInherited)[number]

// ### TypedArray values

export type TtypedArray_prototype_stringNonEnumerablesOwn_values = never

export type TtypedArray_prototype_stringNonEnumerablesInherited_values<
  Tinput extends TypedArray,
> = ValueOfStrict<TypedArrayExact<Tinput>, TtypedArray_prototype_stringNonEnumerablesInherited>

export type TtypedArray_prototype_symbolNonEnumerablesInherited_values<
  Tinput extends TypedArray,
> = ValueOfStrict<TypedArrayExact<Tinput>, TtypedArray_prototype_symbolNonEnumerablesInherited>

// ### ArrayBuffer props

export const arrayBuffer_prototype_stringNonEnumerablesOwn: never[] = [] as const
export type TarrayBuffer_prototype_stringNonEnumerablesOwn =
  (typeof arrayBuffer_prototype_stringNonEnumerablesOwn)[number]

export const arrayBuffer_prototype_stringNonEnumerablesInherited = [
  'byteLength',
  'slice',
  // missing from TS definition ;-( Why - ES2023?
  // 'maxByteLength',
  // 'resizable',
  // 'resize',
  // 'constructor'
] as const satisfies (PropsString<ArrayBuffer> | keyof ArrayBuffer)[]
;['constructor', 'maxByteLength', 'resizable', 'resize'].forEach((k) =>
  // @ts-expect-error: these are missing in keyof, but returned at runtime
  arrayBuffer_prototype_stringNonEnumerablesInherited.push(k)
)

export type TarrayBuffer_prototype_stringNonEnumerablesInherited =
  (typeof arrayBuffer_prototype_stringNonEnumerablesInherited)[number]

export const arrayBuffer_prototype_symbolNonEnumerablesInherited = [
  Symbol.toStringTag,
] as const satisfies PropsSymbol<ArrayBuffer>[]
export type TarrayBuffer_prototype_symbolNonEnumerablesInherited =
  (typeof arrayBuffer_prototype_symbolNonEnumerablesInherited)[number]

// ### ArrayBuffer values

export type TarrayBuffer_prototype_stringNonEnumerablesOwn_values = never

export type TarrayBuffer_prototype_symbolNonEnumerablesInherited_values = ValueOfStrict<
  ArrayBuffer,
  TarrayBuffer_prototype_symbolNonEnumerablesInherited
>

export type TarrayBuffer_prototype_stringNonEnumerablesInherited_values = ValueOfStrict<
  ArrayBuffer,
  TarrayBuffer_prototype_stringNonEnumerablesInherited
>

// ### Set props

export const set_prototype_stringNonEnumerablesOwn: never[] = [] as const
export type Tset_prototype_stringNonEnumerablesOwn =
  (typeof set_prototype_stringNonEnumerablesOwn)[number]

export const set_prototype_stringNonEnumerablesInherited = [
  'has',
  'add',
  'delete',
  'clear',
  'entries',
  'forEach',
  'size',
  'values',
  'keys',
] as const satisfies PropsString<Set<any>>[]

// @ts-expect-error OK constructor missing in keyof, but returned at runtime
set_prototype_stringNonEnumerablesInherited.unshift('constructor')

// @ts-expect-error Set methods added in ES2025 (Node 22+), not yet in TS 5.6 lib types
;['union', 'intersection', 'difference', 'symmetricDifference', 'isSubsetOf', 'isSupersetOf', 'isDisjointFrom'].forEach((m) => set_prototype_stringNonEnumerablesInherited.push(m))

export type Tset_prototype_stringNonEnumerablesInherited =
  (typeof set_prototype_stringNonEnumerablesInherited)[number]

export const set_prototype_symbolNonEnumerablesInherited = [
  Symbol.iterator,
  Symbol.toStringTag,
] as const satisfies PropsSymbol<Set<any>>[]
export type Tset_prototype_symbolNonEnumerablesInherited =
  (typeof set_prototype_symbolNonEnumerablesInherited)[number]

// ### Set values

export type Tset_prototype_stringNonEnumerablesOwn_values = never

export type Tset_prototype_symbolNonEnumerablesInherited_values<TinputSet extends Set<any>> =
  ValueOfStrict<Set<InsideValues<TinputSet>>, Tset_prototype_symbolNonEnumerablesInherited>

export type Tset_prototype_stringNonEnumerablesInherited_values<TinputSet extends Set<any>> =
  ValueOfStrict<Set<InsideValues<TinputSet>>, Tset_prototype_stringNonEnumerablesInherited>

// ### Map props

export const map_prototype_stringNonEnumerablesOwn: never[] = [] as const
export type Tmap_prototype_stringNonEnumerablesOwn =
  (typeof map_prototype_stringNonEnumerablesOwn)[number]

export const map_prototype_stringNonEnumerablesInherited = [
  'has',
  'get',
  'set',
  'delete',
  'clear',
  'entries',
  'forEach',
  'size',
  'values',
  'keys',
] as const satisfies PropsString<Map<any, any>>[]
// @ts-expect-error OK constructor missing in keyof, but returned at runtime
map_prototype_stringNonEnumerablesInherited.unshift('constructor')
export type Tmap_prototype_stringNonEnumerablesInherited =
  (typeof map_prototype_stringNonEnumerablesInherited)[number]

export const map_prototype_symbolNonEnumerablesInherited = [
  Symbol.iterator,
  Symbol.toStringTag,
] as const satisfies PropsSymbol<Map<any, any>>[]
export type Tmap_prototype_symbolNonEnumerablesInherited =
  (typeof map_prototype_symbolNonEnumerablesInherited)[number]

// ### Map values

export type Tmap_prototype_stringNonEnumerablesOwn_values = never

export type Tmap_prototype_stringNonEnumerablesInherited_values<
  TinputMap extends Map<any, any>,
> = ValueOfStrict<
  Map<InsideKeys<TinputMap>, InsideValues<TinputMap>>,
  Tmap_prototype_stringNonEnumerablesInherited
>

export type Tmap_prototype_symbolNonEnumerablesInherited_values<
  TinputMap extends Map<any, any>,
> = ValueOfStrict<
  Map<InsideKeys<TinputMap>, InsideValues<TinputMap>>,
  Tmap_prototype_symbolNonEnumerablesInherited
>

// ### Set or Map Entries (same) props

export const setOrMapEntries_prototype_stringNonEnumerablesOwn: never[] = [] as const
export type TsetOrMapEntries_prototype_stringNonEnumerablesOwn =
  (typeof setOrMapEntries_prototype_stringNonEnumerablesOwn)[number]

export const setOrMapEntries_prototype_stringNonEnumerablesInherited = [
  'next',
] as const satisfies (keyof SetIteratorEntries<any>)[]

// @ts-expect-error Iterator Helpers added in ES2025 (Node 22+), not yet in TS 5.6 lib types
;['constructor', 'map', 'filter', 'take', 'drop', 'flatMap', 'reduce', 'toArray', 'forEach', 'some', 'every', 'find'].forEach((m) => setOrMapEntries_prototype_stringNonEnumerablesInherited.push(m))

export type TsetOrMapEntries_prototype_stringNonEnumerablesInherited =
  | (typeof setOrMapEntries_prototype_stringNonEnumerablesInherited)[number]
  // Missing from actual result, but we should report them
  | 'return'
  | 'throw'

export const setOrMapEntries_prototype_symbolNonEnumerablesInherited = [
  Symbol.iterator,
  // Symbol.toStringTag, // missing from ES2023 definition ;-(
] as const satisfies (keyof SetIteratorEntries<any>)[]
// @ts-expect-error OK Symbol.toStringTag missing in keyof, but returned at runtime
setOrMapEntries_prototype_symbolNonEnumerablesInherited.unshift(Symbol.toStringTag)
// @ts-expect-error Symbol.dispose added in ES2025 (Node 24+), not yet in TS 5.6 lib types
if (Symbol.dispose) setOrMapEntries_prototype_symbolNonEnumerablesInherited.push(Symbol.dispose)

export type TsetOrMapEntries_prototype_symbolNonEnumerablesInherited =
  (typeof setOrMapEntries_prototype_symbolNonEnumerablesInherited)[number]

// ### Set or Map Entries values

export type TsetOrMapEntries_prototype_stringNonEnumerablesOwn_values = never

export type TsetOrMapEntries_prototype_stringNonEnumerablesInherited_values<
  TsetOrMapEntries extends SetIteratorEntries<any>,
> = ValueOfStrict<
  IterableIterator<[InsideKeys<TsetOrMapEntries>, InsideValues<TsetOrMapEntries>], any, unknown>,
  TsetOrMapEntries_prototype_stringNonEnumerablesInherited
>

export type TsetOrMapEntries_prototype_symbolNonEnumerablesInherited_values<
  TsetOrMapEntries extends SetIteratorEntries<any>,
> = ValueOfStrict<
  IterableIterator<[InsideKeys<TsetOrMapEntries>, InsideValues<TsetOrMapEntries>], any, unknown>,
  TsetOrMapEntries_prototype_symbolNonEnumerablesInherited
>

// ### Generator props

export const generator_prototype_stringNonEnumerablesOwn: never[] = [] as const
export type Tgenerator_prototype_stringNonEnumerablesOwn =
  (typeof generator_prototype_stringNonEnumerablesOwn)[number]

export const generator_prototype_stringNonEnumerablesInherited = [
  'next',
  'return',
  'throw',
] as const satisfies PropsString<Generator<any>>[]
// @ts-expect-error OK constructor missing in keyof, but returned at runtime
generator_prototype_stringNonEnumerablesInherited.unshift('constructor')

// @ts-expect-error Iterator Helpers added in ES2025 (Node 22+), not yet in TS 5.6 lib types
;['map', 'filter', 'take', 'drop', 'flatMap', 'reduce', 'toArray', 'forEach', 'some', 'every', 'find'].forEach((m) => generator_prototype_stringNonEnumerablesInherited.push(m))

export type Tgenerator_prototype_stringNonEnumerablesInherited =
  (typeof generator_prototype_stringNonEnumerablesInherited)[number]

export const generator_prototype_symbolNonEnumerablesInherited = [
  Symbol.iterator,
] as const satisfies PropsSymbol<Generator<any>>[]
// @ts-expect-error OK Symbol.toStringTag missing in keyof, but returned at runtime
generator_prototype_symbolNonEnumerablesInherited.unshift(Symbol.toStringTag)
// @ts-expect-error Symbol.dispose added in ES2025 (Node 24+), not yet in TS 5.6 lib types
if (Symbol.dispose) generator_prototype_symbolNonEnumerablesInherited.push(Symbol.dispose)
export type Tgenerator_prototype_symbolNonEnumerablesInherited =
  (typeof generator_prototype_symbolNonEnumerablesInherited)[number]

// ### Generator values

export type Tgenerator_prototype_stringNonEnumerablesOwn_values = never

export type Tgenerator_prototype_stringNonEnumerablesInherited_values<
  TinputGenerator extends Generator<any>,
> = ValueOfStrict<
  Generator<
    InsideValues<TinputGenerator>,
    GeneratorReturnType<TinputGenerator>,
    // @todo(222): infer Tnext (how?) and dont use any for it!
    any
  >,
  Tgenerator_prototype_stringNonEnumerablesInherited
>

export type Tgenerator_prototype_symbolNonEnumerablesInherited_values<
  TinputGenerator extends Generator<any>,
> = ValueOfStrict<
  Generator<
    InsideValues<TinputGenerator>,
    GeneratorReturnType<TinputGenerator>
    // @todo(222): infer Tnext and dont use any for it!
  >,
  Tgenerator_prototype_symbolNonEnumerablesInherited
>

// ### AsyncGenerator props

export const asyncGenerator_prototype_stringNonEnumerablesOwn: never[] = [] as const
export type TasyncGenerator_prototype_stringNonEnumerablesOwn =
  (typeof asyncGenerator_prototype_stringNonEnumerablesOwn)[number]

export const asyncGenerator_prototype_stringNonEnumerablesInherited = [
  'next',
  'return',
  'throw',
] as const satisfies PropsString<AsyncGenerator<any>>[]
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
asyncGenerator_prototype_stringNonEnumerablesInherited.push('constructor')

export type TasyncGenerator_prototype_stringNonEnumerablesInherited =
  (typeof asyncGenerator_prototype_stringNonEnumerablesInherited)[number]

export const asyncGenerator_prototype_symbolNonEnumerablesInherited = [
  Symbol.asyncIterator,
  // Symbol.toStringTag // breaks in ES2020
] as const satisfies PropsSymbol<AsyncGenerator<any>>[]
// @ts-expect-error OK Symbol.toStringTag missing in keyof, but returned at runtime
asyncGenerator_prototype_symbolNonEnumerablesInherited.push(Symbol.toStringTag)
// @ts-expect-error Symbol.asyncDispose added in ES2025 (Node 24+), not yet in TS 5.6 lib types
if (Symbol.asyncDispose) asyncGenerator_prototype_symbolNonEnumerablesInherited.push(Symbol.asyncDispose)
export type TasyncGenerator_prototype_symbolNonEnumerablesInherited =
  (typeof asyncGenerator_prototype_symbolNonEnumerablesInherited)[number]

// ### AsyncGenerator values

export type TasyncGenerator_prototype_stringNonEnumerablesOwn_values = never

export type TasyncGenerator_prototype_stringNonEnumerablesInherited_values<
  TinputAsyncGenerator extends AsyncGenerator<any>,
> = ValueOfStrict<
  AsyncGenerator<
    InsideValues<TinputAsyncGenerator>,
    GeneratorReturnType<TinputAsyncGenerator>
    // @todo(222): infer Tnext and dont use any for it!
  >,
  TasyncGenerator_prototype_stringNonEnumerablesInherited
>

export type TasyncGenerator_prototype_symbolNonEnumerablesInherited_values<
  TinputAsyncGenerator extends AsyncGenerator<any>,
> = ValueOfStrict<
  AsyncGenerator<
    InsideValues<TinputAsyncGenerator>,
    GeneratorReturnType<TinputAsyncGenerator>
    // @todo(222): infer Tnext and dont use any for it!
  >,
  TasyncGenerator_prototype_symbolNonEnumerablesInherited
>

// ### Boxed Number

export const boxedNumber_prototype_stringNonEnumerablesOwn: never[] = [] as const
export type TboxedNumber_prototype_stringNonEnumerablesOwn =
  (typeof boxedNumber_prototype_stringNonEnumerablesOwn)[number]

export const boxedNumber_prototype_stringNonEnumerablesInherited = [
  'toString',
  'toLocaleString',
  'toExponential',
  'toFixed',
  'toPrecision',
  'valueOf',
] as const satisfies PropsString<Number>[]
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
boxedNumber_prototype_stringNonEnumerablesInherited.push('constructor')
export type TboxedNumber_prototype_stringNonEnumerablesInherited =
  (typeof boxedNumber_prototype_stringNonEnumerablesInherited)[number]

export const boxedNumber_prototype_symbolNonEnumerablesInherited: never[] = [] as const
export type TboxedNumber_prototype_symbolNonEnumerablesInherited =
  (typeof boxedNumber_prototype_symbolNonEnumerablesInherited)[number]

export type TboxedNumber_prototype_stringNonEnumerablesOwn_values = never

export type TboxedNumber_prototype_stringNonEnumerablesInherited_values = ValueOfStrict<
  Number,
  TboxedNumber_prototype_stringNonEnumerablesInherited
>

export type TboxedNumber_prototype_symbolNonEnumerablesInherited_values = never

// ### Boxed Boolean

export const boxedBoolean_prototype_stringNonEnumerablesOwn: never[] = [] as const
export type TboxedBoolean_prototype_stringNonEnumerablesOwn =
  (typeof boxedBoolean_prototype_stringNonEnumerablesOwn)[number]

export const boxedBoolean_prototype_stringNonEnumerablesInherited = [
  'valueOf',
] as const satisfies PropsString<Boolean>[]

// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
boxedBoolean_prototype_stringNonEnumerablesInherited.push('constructor')
// @ts-expect-error OK 'toString' missing in keyof, but returned at runtime
boxedBoolean_prototype_stringNonEnumerablesInherited.push('toString')

export type TboxedBoolean_prototype_stringNonEnumerablesInherited =
  (typeof boxedBoolean_prototype_stringNonEnumerablesInherited)[number]

export const boxedBoolean_prototype_symbolNonEnumerablesInherited: never[] = [] as const
export type TboxedBoolean_prototype_symbolNonEnumerablesInherited =
  (typeof boxedBoolean_prototype_symbolNonEnumerablesInherited)[number]

export type TboxedBoolean_prototype_stringNonEnumerablesOwn_values = ValueOfStrict<
  Boolean,
  TboxedBoolean_prototype_stringNonEnumerablesOwn
>
export type TboxedBoolean_prototype_stringNonEnumerablesInherited_values = ValueOfStrict<
  Boolean,
  TboxedBoolean_prototype_stringNonEnumerablesInherited
>
export type TboxedBoolean_prototype_symbolNonEnumerablesInherited_values = ValueOfStrict<
  Boolean,
  TboxedBoolean_prototype_symbolNonEnumerablesInherited
>

// ### Boxed String

export const boxedString_prototype_stringNonEnumerablesOwn = ['length'] as const
export type TboxedString_prototype_stringNonEnumerablesOwn =
  (typeof boxedString_prototype_stringNonEnumerablesOwn)[number]

export const boxedString_prototype_stringNonEnumerablesInherited = [
  'length',
  'anchor',
  'at',
  'big',
  'blink',
  'bold',
  'charAt',
  'charCodeAt',
  'codePointAt',
  'concat',
  'endsWith',
  'fontcolor',
  'fontsize',
  'fixed',
  'includes',
  'indexOf',
  'italics',
  'lastIndexOf',
  'link',
  'localeCompare',
  'match',
  'matchAll',
  'normalize',
  'padEnd',
  'padStart',
  'repeat',
  'replace',
  'replaceAll',
  'search',
  'slice',
  'small',
  'split',
  'strike',
  'sub',
  'substr',
  'substring',
  'sup',
  'startsWith',
  'trim',
  'trimStart',
  'trimLeft',
  'trimEnd',
  'trimRight',
  'toLocaleLowerCase',
  'toLocaleUpperCase',
  'toLowerCase',
  'toUpperCase',
  'valueOf',
  'toString',
] as const satisfies PropsString<String>[]
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
boxedString_prototype_stringNonEnumerablesInherited.push('constructor')
export const boxedString_prototype_stringNonEnumerablesInherited_ES2023: never[] = [
  // @todo(491): update when TS5.5 is out
  // 'isWellFormed',
  // 'toWellFormed',
] as const satisfies PropsString<String>[]
// @ts-expect-error OK 'isWellFormed' missing in keyof, but returned at runtime
boxedString_prototype_stringNonEnumerablesInherited.push('isWellFormed')
// @ts-expect-error OK 'isWellFormed' missing in keyof, but returned at runtime
boxedString_prototype_stringNonEnumerablesInherited.push('toWellFormed')

export type TboxedString_prototype_stringNonEnumerablesInherited =
  | (typeof boxedString_prototype_stringNonEnumerablesInherited)[number]
  | (typeof boxedString_prototype_stringNonEnumerablesInherited_ES2023)[number]

export const boxedString_prototype_symbolNonEnumerablesInherited = [
  Symbol.iterator,
] as const satisfies PropsSymbol<String>[]

export type TboxedString_prototype_symbolNonEnumerablesInherited =
  (typeof boxedString_prototype_symbolNonEnumerablesInherited)[number]

// ### Boxed String values

export type TboxedString_prototype_stringNonEnumerablesOwn_values = ValueOfStrict<
  String,
  TboxedString_prototype_stringNonEnumerablesOwn
>
export type TboxedString_prototype_stringNonEnumerablesInherited_values = ValueOfStrict<
  String,
  TboxedString_prototype_stringNonEnumerablesInherited
>
export type TboxedString_prototype_symbolNonEnumerablesInherited_values = ValueOfStrict<
  String,
  TboxedString_prototype_symbolNonEnumerablesInherited
>

// ### Date

export const date_prototype_stringNonEnumerablesOwn: never[] = [] as const
export type Tdate_prototype_stringNonEnumerablesOwn =
  (typeof date_prototype_stringNonEnumerablesOwn)[number]

export const date_prototype_stringNonEnumerablesInherited = [
  'toDateString',
  'toTimeString',
  'toISOString',
  'toUTCString',
  'getDate',
  'setDate',
  'getDay',
  'getFullYear',
  'setFullYear',
  'getHours',
  'setHours',
  'getMilliseconds',
  'setMilliseconds',
  'getMinutes',
  'setMinutes',
  'getMonth',
  'setMonth',
  'getSeconds',
  'setSeconds',
  'getTime',
  'setTime',
  'getTimezoneOffset',
  'getUTCDate',
  'setUTCDate',
  'getUTCDay',
  'getUTCFullYear',
  'setUTCFullYear',
  'getUTCHours',
  'setUTCHours',
  'getUTCMilliseconds',
  'setUTCMilliseconds',
  'getUTCMinutes',
  'setUTCMinutes',
  'getUTCMonth',
  'setUTCMonth',
  'getUTCSeconds',
  'setUTCSeconds',
  'toJSON',
  'toLocaleDateString',
  'toLocaleTimeString',
  'toString',
  'valueOf',
  'toLocaleString',
] as const satisfies PropsString<Date>[]
//
// | NestedValuesType<typeof date_prototype_stringNonEnumerablesInherited_DEPRACATED>
;[
  'constructor',
  // These are DEPRECATED
  'toGMTString',
  'getYear',
  'setYear',
].forEach((k) =>
  // @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
  date_prototype_stringNonEnumerablesInherited.push(k)
)

export const date_prototype_stringNonEnumerablesInherited_ES2023: never[] = []

export type Tdate_prototype_stringNonEnumerablesInherited =
  | (typeof date_prototype_stringNonEnumerablesInherited)[number]
  | (typeof date_prototype_stringNonEnumerablesInherited_ES2023)[number]

export const date_prototype_symbolNonEnumerablesInherited = [
  Symbol.toPrimitive,
] as const satisfies PropsSymbol<Date>[]

export type Tdate_prototype_symbolNonEnumerablesInherited =
  (typeof date_prototype_symbolNonEnumerablesInherited)[number]

// ### Date values

export type Tdate_prototype_stringNonEnumerablesOwn_values = ValueOfStrict<
  Date,
  Tdate_prototype_stringNonEnumerablesOwn
>
export type Tdate_prototype_stringNonEnumerablesInherited_values = ValueOfStrict<
  Date,
  Tdate_prototype_stringNonEnumerablesInherited
>
export type Tdate_prototype_symbolNonEnumerablesInherited_values = ValueOfStrict<
  Date,
  Tdate_prototype_symbolNonEnumerablesInherited
>

// ### DataView

export const dataView_prototype_stringNonEnumerablesOwn: never[] = [] as const
export type TdataView_prototype_stringNonEnumerablesOwn =
  (typeof dataView_prototype_stringNonEnumerablesOwn)[number]

export const dataView_prototype_stringNonEnumerablesInherited = [
  'buffer',
  'byteLength',
  'byteOffset',
  'getInt8',
  'setInt8',
  'getUint8',
  'setUint8',
  'getInt16',
  'setInt16',
  'getUint16',
  'setUint16',
  'getInt32',
  'setInt32',
  'getUint32',
  'setUint32',
  'getFloat32',
  'setFloat32',
  'getFloat64',
  'setFloat64',
  'getBigInt64',
  'setBigInt64',
  'getBigUint64',
  'setBigUint64',
] as const satisfies PropsString<DataView>[]
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
dataView_prototype_stringNonEnumerablesInherited.push('constructor')

// @ts-expect-error Float16 methods added in ES2025 (Node 24+), not yet in TS 5.6 lib types
if (typeof DataView.prototype.getFloat16 === 'function') ['getFloat16', 'setFloat16'].forEach((m) => dataView_prototype_stringNonEnumerablesInherited.push(m))

export const dataView_prototype_stringNonEnumerablesInherited_ES2023: never[] = []

export type TdataView_prototype_stringNonEnumerablesInherited =
  | (typeof dataView_prototype_stringNonEnumerablesInherited)[number]
  | (typeof dataView_prototype_stringNonEnumerablesInherited_ES2023)[number]

export const dataView_prototype_symbolNonEnumerablesInherited = [
  Symbol.toStringTag,
] as const satisfies PropsSymbol<DataView>[]

export type TdataView_prototype_symbolNonEnumerablesInherited =
  (typeof dataView_prototype_symbolNonEnumerablesInherited)[number]

// ### DataView values

export type TdataView_prototype_stringNonEnumerablesOwn_values = ValueOfStrict<
  DataView,
  TdataView_prototype_stringNonEnumerablesOwn
>

export type TdataView_prototype_stringNonEnumerablesInherited_values = ValueOfStrict<
  DataView,
  TdataView_prototype_stringNonEnumerablesInherited
>

export type TdataView_prototype_symbolNonEnumerablesInherited_values = ValueOfStrict<
  DataView,
  TdataView_prototype_symbolNonEnumerablesInherited
>

// ### Error

export const error_prototype_stringNonEnumerablesOwn = [
  'stack',
  'message',
  'cause', // note: tests must have this
] as const satisfies PropsString<Error>[]
export type Terror_prototype_stringNonEnumerablesOwn =
  (typeof error_prototype_stringNonEnumerablesOwn)[number]

export const error_prototype_stringNonEnumerablesInherited = [
  'name',
  'message',
] as const satisfies PropsString<Error>[]
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
error_prototype_stringNonEnumerablesInherited.push('constructor')
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
error_prototype_stringNonEnumerablesInherited.push('toString')
export const error_prototype_stringNonEnumerablesInherited_ES2023: never[] = [] as const

export type Terror_prototype_stringNonEnumerablesInherited =
  | (typeof error_prototype_stringNonEnumerablesInherited)[number]
  | (typeof error_prototype_stringNonEnumerablesInherited_ES2023)[number]

export const error_prototype_symbolNonEnumerablesInherited: never[] =
  [] as const satisfies PropsSymbol<Error>[]

export type Terror_prototype_symbolNonEnumerablesInherited =
  (typeof error_prototype_symbolNonEnumerablesInherited)[number]

// ### Error values

// Note: unknown, cause of `cause: unknown` in Error
export type Terror_prototype_stringNonEnumerablesOwn_values = ValueOfStrict<
  Error,
  Terror_prototype_stringNonEnumerablesOwn
>
export type Terror_prototype_stringNonEnumerablesInherited_values = ValueOfStrict<
  Error,
  Terror_prototype_stringNonEnumerablesInherited
>
export type Terror_prototype_symbolNonEnumerablesInherited_values = ValueOfStrict<
  Error,
  Terror_prototype_symbolNonEnumerablesInherited
>

// ### Function

export const function_prototype_stringNonEnumerablesOwn = [
  'length',
  'name',
] as const satisfies PropsString<Function>[]
export type Tfunction_prototype_stringNonEnumerablesOwn =
  (typeof function_prototype_stringNonEnumerablesOwn)[number]

export const function_prototype_stringNonEnumerablesInherited = [
  'arguments',
  'caller',
  'apply',
  'bind',
  'call',
  'toString',
  // both as own and inherited
  'length',
  'name',
] as const satisfies PropsString<Function>[]
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
function_prototype_stringNonEnumerablesInherited.push('constructor')

export const function_prototype_stringNonEnumerablesInherited_ES2023: never[] = [] as const

export type Tfunction_prototype_stringNonEnumerablesInherited =
  // | 'prototype'
  | (typeof function_prototype_stringNonEnumerablesInherited)[number]
  | (typeof function_prototype_stringNonEnumerablesInherited_ES2023)[number]

export const function_prototype_symbolNonEnumerablesInherited = [
  Symbol.hasInstance,
] as const satisfies PropsSymbol<Function>[]
export type Tfunction_prototype_symbolNonEnumerablesInherited =
  (typeof function_prototype_symbolNonEnumerablesInherited)[number]

// ### Function values

export type Tfunction_prototype_stringNonEnumerablesOwn_values = ValueOfStrict<
  Function,
  Tfunction_prototype_stringNonEnumerablesOwn
>
export type Tfunction_prototype_stringNonEnumerablesInherited_values = ValueOfStrict<
  Function,
  Tfunction_prototype_stringNonEnumerablesInherited
>
export type Tfunction_prototype_symbolNonEnumerablesInherited_values = ValueOfStrict<
  Function,
  Tfunction_prototype_symbolNonEnumerablesInherited
>

// ### Promise

export const promise_prototype_stringNonEnumerablesOwn: never[] =
  [] as const satisfies PropsString<Promise<any>>[]
export type Tpromise_prototype_stringNonEnumerablesOwn =
  (typeof promise_prototype_stringNonEnumerablesOwn)[number]

export const promise_prototype_stringNonEnumerablesInherited = [
  'then',
  'catch',
  'finally',
] as const satisfies PropsString<Promise<any>>[]
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
promise_prototype_stringNonEnumerablesInherited.push('constructor')
export const promise_prototype_stringNonEnumerablesInherited_ES2023: never[] = [] as const

export type Tpromise_prototype_stringNonEnumerablesInherited =
  | (typeof promise_prototype_stringNonEnumerablesInherited)[number]
  | (typeof promise_prototype_stringNonEnumerablesInherited_ES2023)[number]

export const promise_prototype_symbolNonEnumerablesInherited = [
  Symbol.toStringTag,
] as const satisfies PropsSymbol<Promise<any>>[]
export type Tpromise_prototype_symbolNonEnumerablesInherited =
  (typeof promise_prototype_symbolNonEnumerablesInherited)[number]

// ### Promise values

export type Tpromise_prototype_stringNonEnumerablesOwn_values<
  TinputPromise extends Promise<any>,
> = ValueOfStrict<
  Promise<InsideValues<TinputPromise>>,
  Tpromise_prototype_stringNonEnumerablesOwn
>

export type Tpromise_prototype_stringNonEnumerablesInherited_values<
  TinputPromise extends Promise<any>,
> = ValueOfStrict<
  Promise<InsideValues<TinputPromise>>,
  Tpromise_prototype_stringNonEnumerablesInherited
>

export type Tpromise_prototype_symbolNonEnumerablesInherited_values<
  TinputPromise extends Promise<any>,
> = ValueOfStrict<
  Promise<InsideValues<TinputPromise>>,
  Tpromise_prototype_symbolNonEnumerablesInherited
>

// ### RegExp

export const regExp_prototype_stringNonEnumerablesOwn = [
  'lastIndex',
] as const satisfies PropsString<RegExp>[]
export type TregExp_prototype_stringNonEnumerablesOwn =
  (typeof regExp_prototype_stringNonEnumerablesOwn)[number]

export const regExp_prototype_stringNonEnumerablesInherited = [
  'exec',
  'dotAll',
  'flags',
  'global',
  'hasIndices',
  'ignoreCase',
  'multiline',
  'source',
  'sticky',
  'unicode',
  'compile',
  'test',
] as const satisfies PropsString<RegExp>[]
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
regExp_prototype_stringNonEnumerablesInherited.push('constructor')
export const regExp_prototype_stringNonEnumerablesInherited_ES2023: never[] = [
  // 'toString',
  // 'unicodeSets',
] as const satisfies PropsString<RegExp>[]
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
regExp_prototype_stringNonEnumerablesInherited_ES2023.push('toString')
// @ts-expect-error OK 'constructor' missing in keyof, but returned at runtime
regExp_prototype_stringNonEnumerablesInherited_ES2023.push('unicodeSets')

export type TregExp_prototype_stringNonEnumerablesInherited =
  // | 'prototype'
  | (typeof regExp_prototype_stringNonEnumerablesInherited)[number]
  | (typeof regExp_prototype_stringNonEnumerablesInherited_ES2023)[number]

export const regExp_prototype_symbolNonEnumerablesInherited = [
  Symbol.match,
  Symbol.matchAll,
  Symbol.replace,
  Symbol.search,
  Symbol.split,
  // Symbol.toStringTag,
] as const satisfies PropsSymbol<RegExp>[]
export type TregExp_prototype_symbolNonEnumerablesInherited =
  (typeof regExp_prototype_symbolNonEnumerablesInherited)[number]

// ### RegExp values

export type TregExp_prototype_stringNonEnumerablesOwn_values = ValueOfStrict<
  RegExp,
  TregExp_prototype_stringNonEnumerablesOwn
>
export type TregExp_prototype_stringNonEnumerablesInherited_values = ValueOfStrict<
  RegExp,
  TregExp_prototype_stringNonEnumerablesInherited
>
export type TregExp_prototype_symbolNonEnumerablesInherited_values = ValueOfStrict<
  RegExp,
  TregExp_prototype_symbolNonEnumerablesInherited
>

// ### All together

export type PropsOfKnownPrototype_stringNonEnumerablesInherited<Tinput extends object> =
  Tinput extends Array<any>
    ? Tarray_prototype_stringNonEnumerablesInherited
    : Tinput extends IArguments
      ? Targuments_prototype_stringNonEnumerablesInherited
      : Tinput extends TypedArray
        ? TtypedArray_prototype_stringNonEnumerablesInherited
        : Tinput extends ArrayBuffer
          ? TarrayBuffer_prototype_stringNonEnumerablesInherited
          : Tinput extends SetIteratorEntries<any>
            ? TsetOrMapEntries_prototype_stringNonEnumerablesInherited
            : Tinput extends Set<any>
              ? Tset_prototype_stringNonEnumerablesInherited
              : Tinput extends Map<any, any>
                ? Tmap_prototype_stringNonEnumerablesInherited
                : Tinput extends Number
                  ? TboxedNumber_prototype_stringNonEnumerablesInherited
                  : Tinput extends Boolean
                    ? TboxedBoolean_prototype_stringNonEnumerablesInherited
                    : Tinput extends String
                      ? TboxedString_prototype_stringNonEnumerablesInherited
                      : Tinput extends Date
                        ? Tdate_prototype_stringNonEnumerablesInherited
                        : Tinput extends DataView
                          ? TdataView_prototype_stringNonEnumerablesInherited
                          : Tinput extends Error
                            ? Terror_prototype_stringNonEnumerablesInherited
                            : Tinput extends Function
                              ? Tfunction_prototype_stringNonEnumerablesInherited
                              : Tinput extends Promise<any>
                                ? Tpromise_prototype_stringNonEnumerablesInherited
                                : Tinput extends RegExp
                                  ? TregExp_prototype_stringNonEnumerablesInherited
                                  : Tinput extends Generator
                                    ? Tgenerator_prototype_stringNonEnumerablesInherited
                                    : Tinput extends AsyncGenerator
                                      ? TasyncGenerator_prototype_stringNonEnumerablesInherited
                                      : // @todo(714): create & add link to keyofOwn issue
                                        // @todo(237): implement when keyofOwn is implemented for custom classes / instance types
                                        Tinput extends InstanceTypeAll<any>
                                        ? PropsString<Tinput>
                                        : // Tinput extends Class<infer C> ? ????
                                          never

export type PropsValuesOfKnownPrototype_stringNonEnumerablesInherited<Tinput extends object> =
  Tinput extends Array<any>
    ? Tarray_prototype_stringNonEnumerablesInherited_values<Tinput>
    : Tinput extends TypedArray
      ? TtypedArray_prototype_stringNonEnumerablesInherited_values<Tinput>
      : Tinput extends IArguments
        ? Targuments_prototype_stringNonEnumerablesInherited_values
        : Tinput extends ArrayBuffer
          ? ValueOfStrict<Tinput, TarrayBuffer_prototype_stringNonEnumerablesInherited>
          : Tinput extends Set<any>
            ? Tset_prototype_stringNonEnumerablesInherited_values<Tinput>
            : Tinput extends Map<any, any>
              ? Tmap_prototype_stringNonEnumerablesInherited_values<Tinput>
              : Tinput extends SetIteratorEntries<any>
                ? ValueOfStrict<
                    Tinput,
                    TsetOrMapEntries_prototype_stringNonEnumerablesInherited
                  >
                : Tinput extends Number
                  ? ValueOfStrict<Tinput, TboxedNumber_prototype_stringNonEnumerablesInherited>
                  : Tinput extends Boolean
                    ? ValueOfStrict<
                        Tinput,
                        TboxedBoolean_prototype_stringNonEnumerablesInherited
                      >
                    : Tinput extends String
                      ? ValueOfStrict<
                          Tinput,
                          TboxedString_prototype_stringNonEnumerablesInherited
                        >
                      : Tinput extends Date
                        ? // @todo: sometimes, when TS is in watch mode, this becomes a ghost fail ;-( It happened all of a sudden. Saving file or restarting TS build fixes it!
                          ValueOfStrict<Tinput, Tdate_prototype_stringNonEnumerablesInherited>
                        : Tinput extends DataView
                          ? ValueOfStrict<
                              Tinput,
                              TdataView_prototype_stringNonEnumerablesInherited
                            >
                          : Tinput extends Error
                            ? ValueOfStrict<
                                Tinput,
                                Terror_prototype_stringNonEnumerablesInherited
                              >
                            : Tinput extends Function
                              ? ValueOfStrict<
                                  Tinput,
                                  // @todo: sometimes, when TS is in watch mode, this becomes a ghost fail ;-( It happened all of a sudden. Saving file or restarting TS build fixes it!
                                  Tfunction_prototype_stringNonEnumerablesInherited
                                >
                              : Tinput extends Promise<any>
                                ? ValueOfStrict<
                                    Tinput,
                                    Tpromise_prototype_stringNonEnumerablesInherited
                                  >
                                : Tinput extends RegExp
                                  ? ValueOfStrict<
                                      RegExp,
                                      TregExp_prototype_stringNonEnumerablesInherited
                                    >
                                  : Tinput extends Generator
                                    ? ValueOfStrict<
                                        Tinput,
                                        Tgenerator_prototype_stringNonEnumerablesInherited
                                      >
                                    : Tinput extends AsyncGenerator
                                      ? ValueOfStrict<
                                          Tinput,
                                          TasyncGenerator_prototype_stringNonEnumerablesInherited
                                        >
                                      : Tinput extends InstanceTypeAll<any>
                                        ? ValueOfStrict<Tinput, PropsString<Tinput>>
                                        : never

export type PropsOfKnownPrototype_symbolNonEnumerablesInherited<Tinput extends object> =
  Tinput extends Array<any>
    ? Tarray_prototype_symbolNonEnumerablesInherited
    : Tinput extends IArguments
      ? Targuments_prototype_symbolNonEnumerablesInherited
      : Tinput extends TypedArray
        ? TtypedArray_prototype_symbolNonEnumerablesInherited
        : Tinput extends ArrayBuffer
          ? TarrayBuffer_prototype_symbolNonEnumerablesInherited
          : Tinput extends Set<any>
            ? Tset_prototype_symbolNonEnumerablesInherited
            : Tinput extends Map<any, any>
              ? Tmap_prototype_symbolNonEnumerablesInherited
              : Tinput extends SetIteratorEntries<any>
                ? TsetOrMapEntries_prototype_symbolNonEnumerablesInherited
                : Tinput extends MapIteratorEntries<any, any>
                  ? TsetOrMapEntries_prototype_symbolNonEnumerablesInherited
                  : Tinput extends Number
                    ? TboxedNumber_prototype_symbolNonEnumerablesInherited
                    : Tinput extends Boolean
                      ? TboxedBoolean_prototype_symbolNonEnumerablesInherited
                      : Tinput extends String
                        ? TboxedString_prototype_symbolNonEnumerablesInherited
                        : Tinput extends Date
                          ? Tdate_prototype_symbolNonEnumerablesInherited
                          : Tinput extends DataView
                            ? TdataView_prototype_symbolNonEnumerablesInherited
                            : Tinput extends Error
                              ? Terror_prototype_symbolNonEnumerablesInherited
                              : Tinput extends AsyncFunction
                                ?
                                    | Tfunction_prototype_symbolNonEnumerablesInherited
                                    | typeof Symbol.toStringTag
                                : Tinput extends Function
                                  ? Tfunction_prototype_symbolNonEnumerablesInherited
                                  : Tinput extends Promise<any>
                                    ? Tpromise_prototype_symbolNonEnumerablesInherited
                                    : Tinput extends RegExp
                                      ? TregExp_prototype_symbolNonEnumerablesInherited
                                      : Tinput extends Generator
                                        ? Tgenerator_prototype_symbolNonEnumerablesInherited
                                        : Tinput extends AsyncGenerator
                                          ? TasyncGenerator_prototype_symbolNonEnumerablesInherited
                                          : // @todo(714): create & add link to keyofOwn issue
                                            // @todo(237): implement when keyofOwn is implemented for custom classes / instance types
                                            Tinput extends InstanceTypeAll<any>
                                            ? PropsSymbol<Tinput>
                                            : //   : Tinput extends Class<infer C> ? ????
                                              never

export type PropsValuesOfKnownPrototype_symbolNonEnumerablesInherited<Tinput extends object> =
  Tinput extends Array<any>
    ? ValueOfStrict<Tinput, Tarray_prototype_symbolNonEnumerablesInherited>
    : Tinput extends IArguments
      ? ValueOfStrict<Tinput, Targuments_prototype_symbolNonEnumerablesInherited>
      : Tinput extends TypedArray
        ? ValueOfStrict<Tinput, TtypedArray_prototype_symbolNonEnumerablesInherited>
        : Tinput extends ArrayBuffer
          ? ValueOfStrict<Tinput, TarrayBuffer_prototype_symbolNonEnumerablesInherited>
          : Tinput extends Set<any>
            ? ValueOfStrict<Tinput, Tset_prototype_symbolNonEnumerablesInherited>
            : Tinput extends Map<any, any>
              ? ValueOfStrict<Tinput, Tmap_prototype_symbolNonEnumerablesInherited>
              : Tinput extends SetIteratorEntries<any>
                ? ValueOfStrict<
                    Tinput,
                    TsetOrMapEntries_prototype_symbolNonEnumerablesInherited
                  >
                : Tinput extends MapIteratorEntries<any, any>
                  ? ValueOfStrict<
                      Tinput,
                      TsetOrMapEntries_prototype_symbolNonEnumerablesInherited
                    >
                  : Tinput extends Number
                    ? ValueOfStrict<
                        Tinput,
                        TboxedNumber_prototype_symbolNonEnumerablesInherited
                      >
                    : Tinput extends Boolean
                      ? ValueOfStrict<
                          Tinput,
                          TboxedBoolean_prototype_symbolNonEnumerablesInherited
                        >
                      : Tinput extends String
                        ? ValueOfStrict<
                            Tinput,
                            TboxedString_prototype_symbolNonEnumerablesInherited
                          >
                        : Tinput extends Date
                          ? ValueOfStrict<Tinput, Tdate_prototype_symbolNonEnumerablesInherited>
                          : Tinput extends DataView
                            ? ValueOfStrict<
                                Tinput,
                                TdataView_prototype_symbolNonEnumerablesInherited
                              >
                            : Tinput extends Error
                              ? ValueOfStrict<
                                  Tinput,
                                  Terror_prototype_symbolNonEnumerablesInherited
                                >
                              : Tinput extends Function
                                ? ValueOfStrict<
                                    Tinput,
                                    Tfunction_prototype_symbolNonEnumerablesInherited
                                  >
                                : Tinput extends Promise<any>
                                  ? ValueOfStrict<
                                      Tinput,
                                      Tpromise_prototype_symbolNonEnumerablesInherited
                                    >
                                  : Tinput extends RegExp
                                    ? ValueOfStrict<
                                        Tinput,
                                        TregExp_prototype_symbolNonEnumerablesInherited
                                      >
                                    : Tinput extends Generator
                                      ? ValueOfStrict<
                                          Tinput,
                                          Tgenerator_prototype_symbolNonEnumerablesInherited
                                        >
                                      : Tinput extends AsyncGenerator
                                        ? ValueOfStrict<
                                            Tinput,
                                            TasyncGenerator_prototype_symbolNonEnumerablesInherited
                                          >
                                        : Tinput extends InstanceTypeAll<any>
                                          ? ValueOfStrict<Tinput, PropsSymbol<Tinput>>
                                          : never

export type PropsOfKnownPrototype_stringNonEnumerablesOwn<Tinput extends object> =
  Tinput extends Array<any>
    ? Tarray_prototype_stringNonEnumerablesOwn
    : Tinput extends TypedArray
      ? TtypedArray_prototype_stringNonEnumerablesOwn
      : Tinput extends ArrayBuffer
        ? TarrayBuffer_prototype_stringNonEnumerablesOwn
        : Tinput extends Set<any>
          ? Tset_prototype_stringNonEnumerablesOwn
          : Tinput extends Map<any, any>
            ? Tmap_prototype_stringNonEnumerablesOwn
            : Tinput extends SetIteratorEntries<any>
              ? TsetOrMapEntries_prototype_stringNonEnumerablesOwn
              : Tinput extends MapIteratorEntries<any, any>
                ? TsetOrMapEntries_prototype_stringNonEnumerablesOwn
                : Tinput extends Number
                  ? TboxedNumber_prototype_stringNonEnumerablesOwn
                  : Tinput extends Boolean
                    ? TboxedBoolean_prototype_stringNonEnumerablesOwn
                    : Tinput extends String
                      ? TboxedString_prototype_stringNonEnumerablesOwn
                      : Tinput extends Date
                        ? Tdate_prototype_stringNonEnumerablesOwn
                        : Tinput extends DataView
                          ? TdataView_prototype_stringNonEnumerablesOwn
                          : Tinput extends Error
                            ? Terror_prototype_stringNonEnumerablesOwn
                            : Tinput extends AsyncFunction
                              ? Tfunction_prototype_stringNonEnumerablesOwn
                              : Tinput extends Function
                                ? Tfunction_prototype_stringNonEnumerablesOwn
                                : Tinput extends Promise<any>
                                  ? Tpromise_prototype_stringNonEnumerablesOwn
                                  : Tinput extends RegExp
                                    ? TregExp_prototype_stringNonEnumerablesOwn
                                    : Tinput extends Generator
                                      ? Tgenerator_prototype_stringNonEnumerablesOwn
                                      : Tinput extends AsyncGenerator
                                        ? TasyncGenerator_prototype_stringNonEnumerablesOwn
                                        : Tinput extends IArguments
                                          ? Targuments_prototype_stringNonEnumerablesOwn
                                          : never

export type PropsValuesOfKnownPrototype_stringNonEnumerablesOwn<Tinput extends object> =
  Tinput extends Array<any>
    ? ValueOfStrict<Tinput, Tarray_prototype_stringNonEnumerablesOwn>
    : Tinput extends TypedArray
      ? ValueOfStrict<Tinput, TtypedArray_prototype_stringNonEnumerablesOwn>
      : Tinput extends ArrayBuffer
        ? ValueOfStrict<Tinput, TarrayBuffer_prototype_stringNonEnumerablesOwn>
        : Tinput extends Set<any>
          ? ValueOfStrict<Tinput, Tset_prototype_stringNonEnumerablesOwn>
          : Tinput extends Map<any, any>
            ? ValueOfStrict<Tinput, Tmap_prototype_stringNonEnumerablesOwn>
            : Tinput extends SetIteratorEntries<any>
              ? ValueOfStrict<Tinput, TsetOrMapEntries_prototype_stringNonEnumerablesOwn>
              : Tinput extends MapIteratorEntries<any, any>
                ? ValueOfStrict<Tinput, TsetOrMapEntries_prototype_stringNonEnumerablesOwn>
                : Tinput extends Number
                  ? ValueOfStrict<Tinput, TboxedNumber_prototype_stringNonEnumerablesOwn>
                  : Tinput extends Boolean
                    ? ValueOfStrict<Tinput, TboxedBoolean_prototype_stringNonEnumerablesOwn>
                    : Tinput extends String
                      ? ValueOfStrict<Tinput, TboxedString_prototype_stringNonEnumerablesOwn>
                      : Tinput extends Date
                        ? ValueOfStrict<Tinput, Tdate_prototype_stringNonEnumerablesOwn>
                        : Tinput extends DataView
                          ? ValueOfStrict<Tinput, TdataView_prototype_stringNonEnumerablesOwn>
                          : Tinput extends Error
                            ? ValueOfStrict<Tinput, Terror_prototype_stringNonEnumerablesOwn>
                            : Tinput extends Function
                              ? ValueOfStrict<
                                  Tinput,
                                  Tfunction_prototype_stringNonEnumerablesOwn
                                >
                              : Tinput extends Promise<any>
                                ? ValueOfStrict<
                                    Tinput,
                                    Tpromise_prototype_stringNonEnumerablesOwn
                                  >
                                : Tinput extends RegExp
                                  ? ValueOfStrict<
                                      Tinput,
                                      TregExp_prototype_stringNonEnumerablesOwn
                                    >
                                  : Tinput extends Generator
                                    ? ValueOfStrict<
                                        Tinput,
                                        Tgenerator_prototype_stringNonEnumerablesOwn
                                      >
                                    : Tinput extends AsyncGenerator
                                      ? ValueOfStrict<
                                          Tinput,
                                          TasyncGenerator_prototype_stringNonEnumerablesOwn
                                        >
                                      : Tinput extends IArguments
                                        ? ValueOfStrict<
                                            Tinput,
                                            Targuments_prototype_stringNonEnumerablesOwn
                                          >
                                        : never

// @todo(714): create & add link to keyofOwn issue
// @todo(237): implement when keyofOwn is implemented for custom classes / instance types

export type PropsOfKnownPrototype_symbolNonEnumerablesOwn<Tinput extends object> =
  Tinput extends IArguments ? Targuments_prototype_symbolNonEnumerablesOwn : never

export type PropsValuesOfKnownPrototype_symbolNonEnumerablesOwn<Tinput extends object> =
  Tinput extends IArguments
    ? ValueOfStrict<Tinput, Targuments_prototype_symbolNonEnumerablesOwn>
    : never
