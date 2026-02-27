import { expect } from 'chai'
import { expectType, TypeEqual } from 'ts-expect'
import { TypedArray } from 'type-fest'
import {
  isBigInt64Array,
  isBigUint64Array,
  isFloat32Array,
  isFloat64Array,
  isInt16Array,
  isInt32Array,
  isInt8Array,
  isTypedArray,
  isTypedArrayBigInt,
  isTypedArrayNumber,
  isUint16Array,
  isUint32Array,
  isUint8Array,
  isUint8ClampedArray,
  TypedArrayBigInt,
  TypedArrayNumber,
} from '../isTypedArray'

describe('isTypedArray & family, with 3x3 typing of test on each: Known variable type (& runtime check), unknown variable type, any variable type. For each variable type, we check on generic isTypedArray(), isTypedArrayNumber() or isTypedArrayBigint and on isXxxArray()', () => {
  describe('Int8Array', () => {
    it(`should return correct type & true for typed Int8Array`, () => {
      const typedInt8Array: TypedArray = new Int8Array([10, 20, 30, 40, 50])
      if (isTypedArray(typedInt8Array))
        expectType<TypeEqual<typeof typedInt8Array, Int8Array>>(true)
      expect(isTypedArray(typedInt8Array)).to.equal(true)

      if (isTypedArrayNumber(typedInt8Array))
        expectType<TypeEqual<typeof typedInt8Array, Int8Array>>(true)
      expect(isTypedArrayNumber(typedInt8Array)).to.equal(true)

      if (isInt8Array(typedInt8Array))
        expectType<TypeEqual<typeof typedInt8Array, Int8Array>>(true)
      expect(isInt8Array(typedInt8Array)).to.equal(true)
    })

    it(`should return correct type for unknown Int8Array`, () => {
      const unknownInt8Array: unknown = new Int8Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(unknownInt8Array))
        expectType<TypeEqual<typeof unknownInt8Array, TypedArray>>(true)

      if (isTypedArrayNumber(unknownInt8Array))
        expectType<TypeEqual<typeof unknownInt8Array, TypedArrayNumber>>(true)

      if (isInt8Array(unknownInt8Array))
        expectType<TypeEqual<typeof unknownInt8Array, Int8Array>>(true)
    })

    it(`should return correct type for any Int8Array`, () => {
      const anyInt8Array: any = new Int8Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(anyInt8Array))
        expectType<TypeEqual<typeof anyInt8Array, TypedArray>>(true)

      if (isTypedArrayNumber(anyInt8Array))
        expectType<TypeEqual<typeof anyInt8Array, TypedArrayNumber>>(true)

      if (isInt8Array(anyInt8Array)) expectType<TypeEqual<typeof anyInt8Array, Int8Array>>(true)
    })
  })

  describe('Uint8Array', () => {
    it(`should return correct type & true for typed Uint8Array`, () => {
      const typedUint8Array: TypedArray = new Uint8Array([10, 20, 30, 40, 50])
      if (isTypedArray(typedUint8Array))
        expectType<TypeEqual<typeof typedUint8Array, Uint8Array>>(true)
      expect(isTypedArray(typedUint8Array)).to.equal(true)

      if (isTypedArrayNumber(typedUint8Array))
        expectType<TypeEqual<typeof typedUint8Array, Uint8Array>>(true)
      expect(isTypedArrayNumber(typedUint8Array)).to.equal(true)

      if (isUint8Array(typedUint8Array))
        expectType<TypeEqual<typeof typedUint8Array, Uint8Array>>(true)
      expect(isUint8Array(typedUint8Array)).to.equal(true)
    })

    it(`should return correct type for unknown Uint8Array`, () => {
      const unknownUint8Array: unknown = new Uint8Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(unknownUint8Array))
        expectType<TypeEqual<typeof unknownUint8Array, TypedArray>>(true)

      if (isTypedArrayNumber(unknownUint8Array))
        expectType<TypeEqual<typeof unknownUint8Array, TypedArrayNumber>>(true)

      if (isUint8Array(unknownUint8Array))
        expectType<TypeEqual<typeof unknownUint8Array, Uint8Array>>(true)
    })

    it(`should return correct type for any Uint8Array`, () => {
      const anyUint8Array: any = new Uint8Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(anyUint8Array))
        expectType<TypeEqual<typeof anyUint8Array, TypedArray>>(true)

      if (isTypedArrayNumber(anyUint8Array))
        expectType<TypeEqual<typeof anyUint8Array, TypedArrayNumber>>(true)

      if (isUint8Array(anyUint8Array))
        expectType<TypeEqual<typeof anyUint8Array, Uint8Array>>(true)
    })
  })

  describe('Uint8ClampedArray', () => {
    it(`should return correct type & true for typed Uint8ClampedArray`, () => {
      const typedUint8ClampedArray: TypedArray = new Uint8ClampedArray([10, 20, 30, 40, 50])
      if (isTypedArray(typedUint8ClampedArray))
        expectType<TypeEqual<typeof typedUint8ClampedArray, Uint8ClampedArray>>(true)
      expect(isTypedArray(typedUint8ClampedArray)).to.equal(true)

      if (isTypedArrayNumber(typedUint8ClampedArray))
        expectType<TypeEqual<typeof typedUint8ClampedArray, Uint8ClampedArray>>(true)
      expect(isTypedArrayNumber(typedUint8ClampedArray)).to.equal(true)

      if (isUint8ClampedArray(typedUint8ClampedArray))
        expectType<TypeEqual<typeof typedUint8ClampedArray, Uint8ClampedArray>>(true)
      expect(isUint8ClampedArray(typedUint8ClampedArray)).to.equal(true)
    })

    it(`should return correct type for unknown Uint8ClampedArray`, () => {
      const unknownUint8ClampedArray: unknown = new Uint8ClampedArray([
        10, 20, 30, 40, 50,
      ]) as any
      if (isTypedArray(unknownUint8ClampedArray))
        expectType<TypeEqual<typeof unknownUint8ClampedArray, TypedArray>>(true)

      if (isTypedArrayNumber(unknownUint8ClampedArray))
        expectType<TypeEqual<typeof unknownUint8ClampedArray, TypedArrayNumber>>(true)

      if (isUint8ClampedArray(unknownUint8ClampedArray))
        expectType<TypeEqual<typeof unknownUint8ClampedArray, Uint8ClampedArray>>(true)
    })

    it(`should return correct type for any Uint8ClampedArray`, () => {
      const anyUint8ClampedArray: any = new Uint8ClampedArray([10, 20, 30, 40, 50]) as any
      if (isTypedArray(anyUint8ClampedArray))
        expectType<TypeEqual<typeof anyUint8ClampedArray, TypedArray>>(true)

      if (isTypedArrayNumber(anyUint8ClampedArray))
        expectType<TypeEqual<typeof anyUint8ClampedArray, TypedArrayNumber>>(true)

      if (isUint8ClampedArray(anyUint8ClampedArray))
        expectType<TypeEqual<typeof anyUint8ClampedArray, Uint8ClampedArray>>(true)
    })
  })

  describe('Int16Array', () => {
    it(`should return correct type & true for typed Int16Array`, () => {
      const typedInt16Array: TypedArray = new Int16Array([10, 20, 30, 40, 50])
      if (isTypedArray(typedInt16Array))
        expectType<TypeEqual<typeof typedInt16Array, Int16Array>>(true)
      expect(isTypedArray(typedInt16Array)).to.equal(true)

      if (isTypedArrayNumber(typedInt16Array))
        expectType<TypeEqual<typeof typedInt16Array, Int16Array>>(true)
      expect(isTypedArrayNumber(typedInt16Array)).to.equal(true)

      if (isInt16Array(typedInt16Array))
        expectType<TypeEqual<typeof typedInt16Array, Int16Array>>(true)
      expect(isInt16Array(typedInt16Array)).to.equal(true)
    })

    it(`should return correct type for unknown Int16Array`, () => {
      const unknownInt16Array: unknown = new Int16Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(unknownInt16Array))
        expectType<TypeEqual<typeof unknownInt16Array, TypedArray>>(true)

      if (isTypedArrayNumber(unknownInt16Array))
        expectType<TypeEqual<typeof unknownInt16Array, TypedArrayNumber>>(true)

      if (isInt16Array(unknownInt16Array))
        expectType<TypeEqual<typeof unknownInt16Array, Int16Array>>(true)
    })

    it(`should return correct type for any Int16Array`, () => {
      const anyInt16Array: any = new Int16Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(anyInt16Array))
        expectType<TypeEqual<typeof anyInt16Array, TypedArray>>(true)

      if (isTypedArrayNumber(anyInt16Array))
        expectType<TypeEqual<typeof anyInt16Array, TypedArrayNumber>>(true)

      if (isInt16Array(anyInt16Array))
        expectType<TypeEqual<typeof anyInt16Array, Int16Array>>(true)
    })
  })

  describe('Uint16Array', () => {
    it(`should return correct type & true for typed Uint16Array`, () => {
      const typedUint16Array: TypedArray = new Uint16Array([10, 20, 30, 40, 50])
      if (isTypedArray(typedUint16Array))
        expectType<TypeEqual<typeof typedUint16Array, Uint16Array>>(true)
      expect(isTypedArray(typedUint16Array)).to.equal(true)

      if (isTypedArrayNumber(typedUint16Array))
        expectType<TypeEqual<typeof typedUint16Array, Uint16Array>>(true)
      expect(isTypedArrayNumber(typedUint16Array)).to.equal(true)

      if (isUint16Array(typedUint16Array))
        expectType<TypeEqual<typeof typedUint16Array, Uint16Array>>(true)
      expect(isUint16Array(typedUint16Array)).to.equal(true)
    })

    it(`should return correct type for unknown Uint16Array`, () => {
      const unknownUint16Array: unknown = new Uint16Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(unknownUint16Array))
        expectType<TypeEqual<typeof unknownUint16Array, TypedArray>>(true)

      if (isTypedArrayNumber(unknownUint16Array))
        expectType<TypeEqual<typeof unknownUint16Array, TypedArrayNumber>>(true)

      if (isUint16Array(unknownUint16Array))
        expectType<TypeEqual<typeof unknownUint16Array, Uint16Array>>(true)
    })

    it(`should return correct type for any Uint16Array`, () => {
      const anyUint16Array: any = new Uint16Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(anyUint16Array))
        expectType<TypeEqual<typeof anyUint16Array, TypedArray>>(true)

      if (isTypedArrayNumber(anyUint16Array))
        expectType<TypeEqual<typeof anyUint16Array, TypedArrayNumber>>(true)

      if (isUint16Array(anyUint16Array))
        expectType<TypeEqual<typeof anyUint16Array, Uint16Array>>(true)
    })
  })

  describe('Int32Array', () => {
    it(`should return correct type & true for typed Int32Array`, () => {
      const typedInt32Array: TypedArray = new Int32Array([10, 20, 30, 40, 50])
      if (isTypedArray(typedInt32Array))
        expectType<TypeEqual<typeof typedInt32Array, Int32Array>>(true)
      expect(isTypedArray(typedInt32Array)).to.equal(true)

      if (isTypedArrayNumber(typedInt32Array))
        expectType<TypeEqual<typeof typedInt32Array, Int32Array>>(true)
      expect(isTypedArrayNumber(typedInt32Array)).to.equal(true)

      if (isInt32Array(typedInt32Array))
        expectType<TypeEqual<typeof typedInt32Array, Int32Array>>(true)
      expect(isInt32Array(typedInt32Array)).to.equal(true)
    })

    it(`should return correct type for unknown Int32Array`, () => {
      const unknownInt32Array: unknown = new Int32Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(unknownInt32Array))
        expectType<TypeEqual<typeof unknownInt32Array, TypedArray>>(true)

      if (isTypedArrayNumber(unknownInt32Array))
        expectType<TypeEqual<typeof unknownInt32Array, TypedArrayNumber>>(true)

      if (isInt32Array(unknownInt32Array))
        expectType<TypeEqual<typeof unknownInt32Array, Int32Array>>(true)
    })

    it(`should return correct type for any Int32Array`, () => {
      const anyInt32Array: any = new Int32Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(anyInt32Array))
        expectType<TypeEqual<typeof anyInt32Array, TypedArray>>(true)

      if (isTypedArrayNumber(anyInt32Array))
        expectType<TypeEqual<typeof anyInt32Array, TypedArrayNumber>>(true)

      if (isInt32Array(anyInt32Array))
        expectType<TypeEqual<typeof anyInt32Array, Int32Array>>(true)
    })
  })

  describe('Uint32Array', () => {
    it(`should return correct type & true for typed Uint32Array`, () => {
      const typedUint32Array: TypedArray = new Uint32Array([10, 20, 30, 40, 50])
      if (isTypedArray(typedUint32Array))
        expectType<TypeEqual<typeof typedUint32Array, Uint32Array>>(true)
      expect(isTypedArray(typedUint32Array)).to.equal(true)

      if (isTypedArrayNumber(typedUint32Array))
        expectType<TypeEqual<typeof typedUint32Array, Uint32Array>>(true)
      expect(isTypedArrayNumber(typedUint32Array)).to.equal(true)

      if (isUint32Array(typedUint32Array))
        expectType<TypeEqual<typeof typedUint32Array, Uint32Array>>(true)
      expect(isUint32Array(typedUint32Array)).to.equal(true)
    })

    it(`should return correct type for unknown Uint32Array`, () => {
      const unknownUint32Array: unknown = new Uint32Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(unknownUint32Array))
        expectType<TypeEqual<typeof unknownUint32Array, TypedArray>>(true)

      if (isTypedArrayNumber(unknownUint32Array))
        expectType<TypeEqual<typeof unknownUint32Array, TypedArrayNumber>>(true)

      if (isUint32Array(unknownUint32Array))
        expectType<TypeEqual<typeof unknownUint32Array, Uint32Array>>(true)
    })

    it(`should return correct type for any Uint32Array`, () => {
      const anyUint32Array: any = new Uint32Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(anyUint32Array))
        expectType<TypeEqual<typeof anyUint32Array, TypedArray>>(true)

      if (isTypedArrayNumber(anyUint32Array))
        expectType<TypeEqual<typeof anyUint32Array, TypedArrayNumber>>(true)

      if (isUint32Array(anyUint32Array))
        expectType<TypeEqual<typeof anyUint32Array, Uint32Array>>(true)
    })
  })

  describe('Float32Array', () => {
    it(`should return correct type & true for typed Float32Array`, () => {
      const typedFloat32Array: TypedArray = new Float32Array([10, 20, 30, 40, 50])
      if (isTypedArray(typedFloat32Array))
        expectType<TypeEqual<typeof typedFloat32Array, Float32Array>>(true)
      expect(isTypedArray(typedFloat32Array)).to.equal(true)

      if (isTypedArrayNumber(typedFloat32Array))
        expectType<TypeEqual<typeof typedFloat32Array, Float32Array>>(true)
      expect(isTypedArrayNumber(typedFloat32Array)).to.equal(true)

      if (isFloat32Array(typedFloat32Array))
        expectType<TypeEqual<typeof typedFloat32Array, Float32Array>>(true)
      expect(isFloat32Array(typedFloat32Array)).to.equal(true)
    })

    it(`should return correct type for unknown Float32Array`, () => {
      const unknownFloat32Array: unknown = new Float32Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(unknownFloat32Array))
        expectType<TypeEqual<typeof unknownFloat32Array, TypedArray>>(true)

      if (isTypedArrayNumber(unknownFloat32Array))
        expectType<TypeEqual<typeof unknownFloat32Array, TypedArrayNumber>>(true)

      if (isFloat32Array(unknownFloat32Array))
        expectType<TypeEqual<typeof unknownFloat32Array, Float32Array>>(true)
    })

    it(`should return correct type for any Float32Array`, () => {
      const anyFloat32Array: any = new Float32Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(anyFloat32Array))
        expectType<TypeEqual<typeof anyFloat32Array, TypedArray>>(true)

      if (isTypedArrayNumber(anyFloat32Array))
        expectType<TypeEqual<typeof anyFloat32Array, TypedArrayNumber>>(true)

      if (isFloat32Array(anyFloat32Array))
        expectType<TypeEqual<typeof anyFloat32Array, Float32Array>>(true)
    })
  })

  describe('Float64Array', () => {
    it(`should return correct type & true for typed Float64Array`, () => {
      const typedFloat64Array: TypedArray = new Float64Array([10, 20, 30, 40, 50])
      if (isTypedArray(typedFloat64Array))
        expectType<TypeEqual<typeof typedFloat64Array, Float64Array>>(true)
      expect(isTypedArray(typedFloat64Array)).to.equal(true)

      if (isTypedArrayNumber(typedFloat64Array))
        expectType<TypeEqual<typeof typedFloat64Array, Float64Array>>(true)
      expect(isTypedArrayNumber(typedFloat64Array)).to.equal(true)

      if (isFloat64Array(typedFloat64Array))
        expectType<TypeEqual<typeof typedFloat64Array, Float64Array>>(true)
      expect(isFloat64Array(typedFloat64Array)).to.equal(true)
    })

    it(`should return correct type for unknown Float64Array`, () => {
      const unknownFloat64Array: unknown = new Float64Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(unknownFloat64Array))
        expectType<TypeEqual<typeof unknownFloat64Array, TypedArray>>(true)

      if (isTypedArrayNumber(unknownFloat64Array))
        expectType<TypeEqual<typeof unknownFloat64Array, TypedArrayNumber>>(true)

      if (isFloat64Array(unknownFloat64Array))
        expectType<TypeEqual<typeof unknownFloat64Array, Float64Array>>(true)
    })

    it(`should return correct type for any Float64Array`, () => {
      const anyFloat64Array: any = new Float64Array([10, 20, 30, 40, 50]) as any
      if (isTypedArray(anyFloat64Array))
        expectType<TypeEqual<typeof anyFloat64Array, TypedArray>>(true)

      if (isTypedArrayNumber(anyFloat64Array))
        expectType<TypeEqual<typeof anyFloat64Array, TypedArrayNumber>>(true)

      if (isFloat64Array(anyFloat64Array))
        expectType<TypeEqual<typeof anyFloat64Array, Float64Array>>(true)
    })
  })

  describe('BigInt64Array', () => {
    it(`should return correct type & true for typed BigInt64Array`, () => {
      const typedBigInt64Array: TypedArray = new BigInt64Array([10n, 20n, 30n, 40n, 50n])
      if (isTypedArray(typedBigInt64Array))
        expectType<TypeEqual<typeof typedBigInt64Array, BigInt64Array>>(true)
      expect(isTypedArray(typedBigInt64Array)).to.equal(true)

      if (isTypedArrayBigInt(typedBigInt64Array))
        expectType<TypeEqual<typeof typedBigInt64Array, BigInt64Array>>(true)
      expect(isTypedArrayBigInt(typedBigInt64Array)).to.equal(true)

      if (isBigInt64Array(typedBigInt64Array))
        expectType<TypeEqual<typeof typedBigInt64Array, BigInt64Array>>(true)
      expect(isBigInt64Array(typedBigInt64Array)).to.equal(true)
    })

    it(`should return correct type for unknown BigInt64Array`, () => {
      const unknownBigInt64Array: unknown = new BigInt64Array([10n, 20n, 30n, 40n, 50n]) as any
      if (isTypedArray(unknownBigInt64Array))
        expectType<TypeEqual<typeof unknownBigInt64Array, TypedArray>>(true)

      if (isTypedArrayBigInt(unknownBigInt64Array))
        expectType<TypeEqual<typeof unknownBigInt64Array, TypedArrayBigInt>>(true)

      if (isBigInt64Array(unknownBigInt64Array))
        expectType<TypeEqual<typeof unknownBigInt64Array, BigInt64Array>>(true)
    })

    it(`should return correct type for any BigInt64Array`, () => {
      const anyBigInt64Array: any = new BigInt64Array([10n, 20n, 30n, 40n, 50n]) as any
      if (isTypedArray(anyBigInt64Array))
        expectType<TypeEqual<typeof anyBigInt64Array, TypedArray>>(true)

      if (isTypedArrayBigInt(anyBigInt64Array))
        expectType<TypeEqual<typeof anyBigInt64Array, TypedArrayBigInt>>(true)

      if (isBigInt64Array(anyBigInt64Array))
        expectType<TypeEqual<typeof anyBigInt64Array, BigInt64Array>>(true)
    })
  })

  describe('BigUint64Array', () => {
    it(`should return correct type & true for typed BigUint64Array`, () => {
      const typedBigUint64Array: TypedArray = new BigUint64Array([10n, 20n, 30n, 40n, 50n])
      if (isTypedArray(typedBigUint64Array))
        expectType<TypeEqual<typeof typedBigUint64Array, BigUint64Array>>(true)
      expect(isTypedArray(typedBigUint64Array)).to.equal(true)

      if (isTypedArrayBigInt(typedBigUint64Array))
        expectType<TypeEqual<typeof typedBigUint64Array, BigUint64Array>>(true)
      expect(isTypedArrayBigInt(typedBigUint64Array)).to.equal(true)

      if (isBigUint64Array(typedBigUint64Array))
        expectType<TypeEqual<typeof typedBigUint64Array, BigUint64Array>>(true)
      expect(isBigUint64Array(typedBigUint64Array)).to.equal(true)
    })

    it(`should return correct type for unknown BigUint64Array`, () => {
      const unknownBigUint64Array: unknown = new BigUint64Array([
        10n,
        20n,
        30n,
        40n,
        50n,
      ]) as any
      if (isTypedArray(unknownBigUint64Array))
        expectType<TypeEqual<typeof unknownBigUint64Array, TypedArray>>(true)

      if (isTypedArrayBigInt(unknownBigUint64Array))
        expectType<TypeEqual<typeof unknownBigUint64Array, TypedArrayBigInt>>(true)

      if (isBigUint64Array(unknownBigUint64Array))
        expectType<TypeEqual<typeof unknownBigUint64Array, BigUint64Array>>(true)
    })

    it(`should return correct type for any BigUint64Array`, () => {
      const anyBigUint64Array: any = new BigUint64Array([10n, 20n, 30n, 40n, 50n]) as any
      if (isTypedArray(anyBigUint64Array))
        expectType<TypeEqual<typeof anyBigUint64Array, TypedArray>>(true)

      if (isTypedArrayBigInt(anyBigUint64Array))
        expectType<TypeEqual<typeof anyBigUint64Array, TypedArrayBigInt>>(true)

      if (isBigUint64Array(anyBigUint64Array))
        expectType<TypeEqual<typeof anyBigUint64Array, BigUint64Array>>(true)
    })
  })

  describe('Normal Array', () => {
    it(`should return false for normal array`, () => {
      const normalArray = [10, 20, 30, 40, 50]
      expect(isTypedArray(normalArray)).to.equal(false)
      expect(isTypedArrayNumber(normalArray)).to.equal(false)
      expect(isTypedArrayBigInt(normalArray)).to.equal(false)

      if (isTypedArray(normalArray))
        // this is not weird, TS trusts us and merges types. The check will fail at runtime anyway!
        expectType<TypeEqual<typeof normalArray, number[] & TypedArray>>(true)
    })
  })

  describe(`ArrayBuffer`, () => {
    it(`should return false for ArrayBuffer`, () => {
      const arrayBuffer = new ArrayBuffer(10)
      expect(isTypedArray(arrayBuffer)).to.equal(false)
      expect(isTypedArrayNumber(arrayBuffer)).to.equal(false)
      expect(isTypedArrayBigInt(arrayBuffer)).to.equal(false)

      if (isTypedArray(arrayBuffer))
        // this is not weird, TS trusts us and merges types. The check will fail at runtime anyway!
        // @ts-ignore-next-line
        expectType<TypeEqual<typeof arrayBuffer, TypedArray>>(true)
    })
  })
})
