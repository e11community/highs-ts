import {LPFormatter, isBrowser} from '../src/util'

describe('isBrowser', () => {
  it('should return false in test', () => {
    expect(isBrowser()).toBe(false)
  })
})

describe('LPFormatter.formatVariable', () => {
  it('should remove - in var name', () => {
    const illegalVar = 'a-a'
    const legalVar = LPFormatter.formatVariable(illegalVar)
    expect(legalVar).not.toContain('-')
  })
  it('should remove * in var name', () => {
    const illegalVar = 'a*a'
    const legalVar = LPFormatter.formatVariable(illegalVar)
    expect(legalVar).not.toContain('*')
  })
  it('should not permit the first character to be a number or period', () => {
    const legalVar = LPFormatter.formatVariable('0a')
    expect(legalVar[0]).not.toBe('0')
  })
  it('should not permit over 255 characters', () => {
    const illegalVar =
      'aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_aaaaaaaaa_'
    const legalVar = LPFormatter.formatVariable(illegalVar)
    expect(legalVar.length).toBeLessThanOrEqual(255)
  })
})

describe('LPFormatter.getFormattedVariables', () => {
  it('should return an object mapping the illegal variable to the legal one', () => {
    const illegalVars = ['a-a', '0a']
    const formattedVariables = LPFormatter.getFormattedVariables(illegalVars)
    // console.log(formattedVariables)
    expect(formattedVariables).toHaveProperty(illegalVars[0])
    expect(formattedVariables[illegalVars[0]]).not.toContain('-')
  })
})
