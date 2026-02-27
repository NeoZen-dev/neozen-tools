import * as chai from 'chai'
import {select} from "./draft"

const { expect } = chai
// z = require 'zen' #
// data = require '../test-data'
describe('isAgree works against', () => {
  it('a String against another String', () => {
    expect(select()).to.eq(true)
  })
})
