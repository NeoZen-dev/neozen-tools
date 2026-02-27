/* A mini version of LogZen that can be used in tests etc. Until LogZen gets released */
import * as c from 'ansi-colors'
import * as _ from 'lodash'
import { numberEnumToStringKey } from './typezen/numberEnumToStringKey'

export enum ELogLevel {
  NONE = 0,
  fatal = 1,
  critical = 2,
  error = 3,
  warn = 4,
  notice = 5,
  ok = 6,
  info = 7,
  log = 8,
  verbose = 9,
  debug = 10,
  trace = 11,
  silly = 12,
}

export type TlogMethod = (...argsToPrint: any[]) => any[]

export const logLevelEnumToStringKey = (
  logLevel: ELogLevel | keyof typeof ELogLevel
): keyof typeof ELogLevel | undefined => numberEnumToStringKey(ELogLevel, logLevel)

let _l: LogZenMini

let instanceCounter = 0

export class LogZenMini {
  static LEVELS = ELogLevel
  constructor(
    public name: string = 'LogZenMini_' + instanceCounter++,
    public logLevel: ELogLevel = ELogLevel.debug
  ) {}

  private _actualLog(
    logLevelStr: string | undefined,
    logLevel: ELogLevel,
    color: (str: string) => string,
    argsToPrint: any[]
  ) {
    if (logLevel > this.logLevel) return argsToPrint
    console.log(
      color(
        `${c.white(new Date().toLocaleTimeString())} [${_.upperCase(logLevelStr)}|${this.name}]}`
      ),
      ...argsToPrint.map((arg) => (_.isString(arg) ? color(arg) : arg))
    )
    return argsToPrint
  }

  // ############ Log Methods #############

  public fatal(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.fatal),
      ELogLevel.fatal,
      c.bgRed,
      argsToPrint
    )
  }

  public critical(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.critical),
      ELogLevel.critical,
      c.bgRedBright,
      argsToPrint
    )
  }

  public dir(...argsToPrint) {
    return this._actualLog('dir', ELogLevel.log, c.white, argsToPrint)
  }

  public error(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.error),
      ELogLevel.error,
      c.red,
      argsToPrint
    )
  }

  public warn(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.warn),
      ELogLevel.warn,
      c.yellowBright,
      argsToPrint
    )
  }

  public notice(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.notice),
      ELogLevel.notice,
      c.yellow,
      argsToPrint
    )
  }

  public ok(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.ok),
      ELogLevel.ok,
      c.green,
      argsToPrint
    )
  }

  public info(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.info),
      ELogLevel.info,
      c.gray,
      argsToPrint
    )
  }

  public log(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.log),
      ELogLevel.log,
      c.white,
      argsToPrint
    )
  }

  public verbose(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.verbose),
      ELogLevel.verbose,
      c.cyan,
      argsToPrint
    )
  }

  public silly(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.silly),
      ELogLevel.silly,
      c.blue,
      argsToPrint
    )
  }

  public debug(...argsToPrint) {
    return this._actualLog(
      logLevelEnumToStringKey(ELogLevel.debug),
      ELogLevel.debug,
      c.magenta,
      argsToPrint
    )
  }

  static addPathReplacements(...args: any[]) {
    _l.warn('static method `addPathReplacements` is NOT supported on LogZenMini')
  }

  static updateLogPathOptions(...args: any[]) {
    _l.warn(
      'static method `updateLogPathOptions` & options in general are NOT supported on LogZenMini'
    )
  }
}

_l = new LogZenMini('Internal Logger', ELogLevel.log)

// _l.error('Hello world! error')
// _l.warn('Hello world! warn')
// _l.log('Hello world! log')
// _l.debug('Hello world! debug')
// _l.silly('Hello world! silly')
