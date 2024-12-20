// import * as z from '@neozen/zen'
// import * as _ from 'lodash'
//
// type ExpectedResult = any | null
// /**
//  *
//  * @param expectedStuff
//  */
// export const getExpectedStringsAndResult = (
//   expectedStuff: null | string | [string, ExpectedResult] | [string[], ExpectedResult]
// ): [string[], any] => {
//   // if expectedStrings is null, we dont care about expectedStrings / no output
//   let expectedStrings: string[] | null
//   // if expectedResult is null, we don't care about expectedResult
//   let expectedResult: any = null
//
//   if (_.isArray(expectedStuff)) {
//     ;[expectedStrings, expectedResult] = expectedStuff as [string[], ExpectedResult]
//     expectedStrings = expectedStrings === null ? null : z.arrayize(expectedStrings)
//   } else {
//     expectedStrings = [expectedStuff]
//   }
//
//   if (_.isUndefined(expectedResult)) expectedResult = null
//
//   if (_.isArray(expectedStrings))
//     expectedStrings = expectedStrings.map((es) => {
//       if (z.isRealObject(es)) return JSON.stringify(es)
//       if (_.isString(es)) return es
//       throw new Error(`getExpectedStuff: Unknown value for expectedStrings:${es}`)
//     })
//
//   return [expectedStrings, expectedResult]
// }
