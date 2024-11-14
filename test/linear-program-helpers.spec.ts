import {ILPInputPart, mergeInputParts} from '../src/linear-program.helpers'

describe('#mergeInputParts', () => {
  it('should merge different input parts correctly', () => {
    const part1: ILPInputPart = {
      constraints: ['a > 0', 'b > 0'],
      objective: `1 a + 2 b`,
      binaries: ['a'],
      bounds: [],
      integers: ['b'],
    }
    const part2: ILPInputPart = {
      constraints: ['c > 0', 'd > 0'],
      objective: `3 c + 4 d`,
      binaries: ['c'],
      bounds: [],
      integers: ['d'],
    }

    const result = mergeInputParts([part1, part2])
    console.log(result)
  })
})
