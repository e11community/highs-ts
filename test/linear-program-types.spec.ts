import {Bound, Constraint, ILPInput} from '../src/linear-program.types'

describe('ILPInput', () => {
  it('Should pass checks with narrow types', () => {
    const variables = ['Ms', 'Ds', 'Mg', 'Dg'] as const
    type Variables = typeof variables[number]
    const exampleObj: ILPInput<Variables[]> = {
      optimizationType: 'min',
      objective: '29 Ms + 15 Ds + 111 Mg + 12 Dg',
      integers: ['Ms', 'Ds', 'Mg', 'Dg'],
      constraints: ['100 Ds + 200 Ms >= 300', '100 Dg + 1000 Mg >= 500'],
      bounds: [`0 <= Ms`, '0 <= Ds', '0 <= Mg', '0 <= Dg'],
    }
  })
  it('Should pass checks with weak types', () => {
    const exampleObj: ILPInput = {
      optimizationType: 'min',
      objective: '29 Ms + 15 Ds + 111 Mg + 12 Dg',
      integers: ['Ms', 'Ds', 'Mg', 'Dg'],
      constraints: ['100 Ds + 200 Ms >= 300', '100 Dg + 1000 Mg >= 500'],
      bounds: [`0 <= Ms`, '0 <= Ds', '0 <= Mg', '0 <= Dg'],
    }
  })
  it('Should enforce bounds', () => {
    const exampleObj: ILPInput = {
      optimizationType: 'min',
      objective: '29 Ms + 15 Ds + 111 Mg + 12 Dg',
      integers: ['Ms', 'Ds', 'Mg', 'Dg'],
      constraints: ['100 Ds + 200 Ms >= 300', '100 Dg + 1000 Mg >= 500'],
      bounds: [`0 <= Ms`, '0 <= Ds', '0 <= Mg', '0 <= Dg'],
    }
  })
})

describe('Bound', () => {
  it('should reject invalid bounds', () => {
    // @ts-expect-error >= should not be on RHS
    const bound: Bound<'x'> = '0 <= x >= 0'
    // @ts-expect-error variable should be correct
    const bound2: Bound<'x'> = '0 <= ayy'
  })
  it('should pass correct bounds', () => {
    const bound: Bound<'x'> = '0 <= x <= 10'
    const bound2: Bound<'x'> = '0 <= x'
    const bound3: Bound<'a'> = '0 <= a <= 100'
  })
})

describe('Constraint', () => {
  it('should reject invalid Constraint', () => {
    // @ts-expect-error variables must not be on RHS
    const constraint: Constraint = '100 a >= 300 - b'
    // @ts-expect-error must contain an inequality
    const constraint2: Constraint = '100 a + 200 b + 300'
    // @ts-expect-error variables must not be on RHS
    const constraint3: Constraint = '3 <= 300 t'
  })
  it('should pass correct Constraint', () => {
    const constraint: Constraint = '100 a + 200 b >= 300'
    const constraint2: Constraint = '100 a + 200 b = 300'
    const constraint3: Constraint = '100 a + 200 b <= 300'
  })
})
