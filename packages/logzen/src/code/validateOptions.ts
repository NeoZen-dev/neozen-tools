import * as _ from 'lodash'
import { ValidationError } from 'class-validator'
import { TransformValidationOptions } from 'class-transformer-validator'
import { plainToInstance } from 'class-transformer'

// NeoZen
import { isOk, isRealObject } from '@neozen/zen'
import {
  getValidationErrorsString,
  validateObject,
} from '@neozen/validzen'

// local
import { BuiltInOutputsOptions, Options, Output, TBuiltInOutputNames } from './types'
import { internalInspect } from './inspect'
import { getTinyLog } from './utils/tiny-log'

const _log = getTinyLog(false, '// src/code/validateOptions.ts')

export const filenameCheckForFileOutputs = (
  builtInOutputsOptions: BuiltInOutputsOptions,
  outputName = 'file'
) => {
  if (_.startsWith('file', outputName) && !_.isString(builtInOutputsOptions.filename))
    throw new TypeError(`\n - (filenameCheckForFileOutputs): Using builtInOutputs.file, expected a string filename, got: ${internalInspect(
      builtInOutputsOptions.filename
    )}.
    - The builtInOutputsOptions = ${internalInspect(builtInOutputsOptions)}.
    - Should be {output: ['file', {filename: 'some/relative/path/output-filename.txt'}]}.`)
}

const transformAndValidateSyncOptions: TransformValidationOptions = {
  validator: {
    forbidNonWhitelisted: true,
    // forbidUnknownValues: true, // class-validator 0.14.x defaults to true
    whitelist: true,
  },
}

const builtInOutputsNames: TBuiltInOutputNames[] = [
  // TBuiltInOutputNames
  'console',
  'consoleJSON',
  'std',
  'stdJSON',
  'file',
  'fileJSON',
]

const checkbuiltInOutputsName = (outputName: string) => {
  if (!builtInOutputsNames.includes(outputName as any))
    throw new TypeError(
      `\n - checkbuiltInOutputsName (No such Built-In Outputs '${outputName}': Built-In Outputs are: ${internalInspect(builtInOutputsNames)})`
    )

  return outputName as TBuiltInOutputNames
}
const transformAndValidateLogZenOptions = (
  options: Options,
  actualOptionsClass = Options,
  path: string[] = []
): Options => {
  // Pre-transform to class instances using logzen's class-transformer, so nested
  // @Type() decorators are resolved from the same MetadataStorage singleton that
  // registered them (avoids module duplication issues in monorepo setups).
  const transformedOptions = plainToInstance(actualOptionsClass, options)
  const validatedOptions = validateObject(transformedOptions, actualOptionsClass, {
    ...transformAndValidateSyncOptions,
    validzen: { path },
  })

  _log('transformAndValidateLogZenOptions():, path = ', path)

  // path.push('options')
  // handle kids [] with nulls manually, cause of https://github.com/typestack/class-validator/issues/1382#issuecomment-1745802645
  if (validatedOptions.kids) {
    path.push('kids')
    validatedOptions.kids = _.map(validatedOptions.kids, (kid, idx) => {
      path.push(String(idx))
      const validatedKidOptions = isOk(kid)
        ? transformAndValidateLogZenOptions(kid, actualOptionsClass, path)
        : kid
      path.pop()

      return validatedKidOptions
    })
    path.pop()
  }

  //
  if (validatedOptions.inspect) {
    if (validatedOptions.inspect === true) validatedOptions.inspect = {}
  }

  // Validate output
  // Handle **output** manually, cause of https://github.com/typestack/class-validator/issues/160
  // type is: output?: Output | TBuiltInOutputNames | [TBuiltInOutputNames, BuiltInOutputsOptions]
  if (validatedOptions.output) {
    path.push('output')
    const { output } = validatedOptions

    if (_.isString(output)) {
      checkbuiltInOutputsName(output)
    } else if (_.isArray(output)) {
      const [outputName, builtInOutputOptions = {}] = output

      validatedOptions.output = [
        checkbuiltInOutputsName(outputName),
        validateObject(builtInOutputOptions, BuiltInOutputsOptions, {
          ...transformAndValidateSyncOptions,
          validzen: {
            path,
          },
        }),
      ]
      // eslint-disable-next-line
      filenameCheckForFileOutputs(validatedOptions.output[1], outputName)
    } else if (isRealObject(output) && !(output instanceof Output)) {
      ;(validatedOptions as any).output = validateObject(output, Output, {
        ...transformAndValidateSyncOptions,
        validzen: {
          path,
        },
      })
    }

    path.pop()
  }

  return validatedOptions
}

export const validateOptions = (options: Options, actualOptionsClass = Options): Options => {
  const path = [] // ['logZenOptions']
  try {
    // return options
    return transformAndValidateLogZenOptions(options, actualOptionsClass, path)
  } catch (err) {
    const errors: ValidationError[] = err
    _log('validateOptions():, path = ', path, 'options = ', options, 'Original errors:', errors)

    throw new TypeError(
      `LogZen: Options Validation: ${getValidationErrorsString(errors, {
        validzen: { path },
      })}`,
      { cause: errors }
    )
  }
}
