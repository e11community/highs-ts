import {highsSolve} from '../src/highs.solver'
import {highsResponseToLPResponse} from '../src/linear-program.solver'

describe('#lp solver', () => {
  it('should solve a linear program', async () => {
    const SIMPLE_PROBLEM = `
   Minimize
    cost: 29 Ms + 15 Ds + 111 Mg + 12 Dg
   Subject To
    c1: 100 Ds + 200 Ms >= 300
    c2: 100 Dg + 1000 Mg >= 500
   Bounds
    0 <= Ms
    0 <= Ds
    0 <= Mg
    0 <= Dg
   General
    Ms Ds Mg Dg
   End
   `
    const result = await highsSolve(SIMPLE_PROBLEM)
    expect(result.ObjectiveValue).toBe(104)

    // console.log(result)
  })
  it('should solve a linear program with binaries', async () => {
    const SHIPPING_PROBLEM = `
   Minimize
    cost: 29 Ms + 15 Ds + 111 Mg + 12 Dg + 6 Msh + 6 Dsh
   Subject To
    c1: 100 Ds + 200 Ms >= 300
    c2: 100 Dg + 1000 Mg >= 500
    c3: 9001 Msh - Ms - Mg >= 0
    c4: 9001 Dsh - Ds - Dg >= 0
   Bounds
    0 <= Ms
    0 <= Ds
    0 <= Mg
    0 <= Dg
   General
    Ms Ds Mg Dg
   Binaries
    Msh Dsh
   End
   `
    const result = await highsSolve(SHIPPING_PROBLEM)
    expect(result.ObjectiveValue).toBe(111)

    // console.log(result)
  })
  it('should solve a linear program with free shipping', async () => {
    const SHIPPING_PROBLEM = `
   Minimize
    cost: 29 Ms + 15 Ds + 111 Mg + 12 Dg + 6 Msh + 6 Dsh
   Subject To
    c1: 100 Ds + 200 Ms >= 300
    c2: 100 Dg + 1000 Mg >= 500
    c3: 9001 Msh + 9001 MshFree - Ms - Mg >= 0
    c4: 9001 Dsh + 9001 DshFree - Ds - Dg >= 0
    c5: 20 MshFree - 29 Ms - 111 Mg <= 0
    c6: 20 DshFree - 15 Ds - 12 Dg <= 0
   Bounds
    0 <= Ms
    0 <= Ds
    0 <= Mg
    0 <= Dg
   General
    Ms Ds Mg Dg
   Binary
    Msh Dsh MshFree DshFree
   End
   `
    const result = await highsSolve(SHIPPING_PROBLEM)
    // console.log(result)
    const lpResult = highsResponseToLPResponse(result)
    expect(lpResult.objectiveValue).toBe(104)
    // console.log(lpResult)
  })
})
