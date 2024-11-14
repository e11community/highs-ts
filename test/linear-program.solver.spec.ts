import { ILPInput } from "../src"
import { formatInputHighs, solveLinearProgram } from "../src/linear-program.solver"

describe("formatInputHighs", () => {
  it("should format the input as expected", () => {
    const variables = ["Ms", "Ds", "Mg", "Dg"] as const
    type Variables = (typeof variables)[number]

    const exampleObj: ILPInput<Variables[]> = {
      optimizationType: "min",
      integers: ["Ms", "Ds", "Mg", "Dg"],
      objective: "29 Ms + 15 Ds + 111 Mg + 12 Dg",
      constraints: ["100 Ds + 200 Ms >= 300", "100 Dg + 1000 Mg >= 500"],
      bounds: ["0 <= Ms", "0 <= Ds", "0 <= Mg", "0 <= Dg"],
    }

    const expected = `
Minimize
  objective: 29 Ms + 15 Ds + 111 Mg + 12 Dg
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
    const actual = formatInputHighs(exampleObj)
    // console.log(actual)
    expect(actual).toBe(expected)
  })
})

describe("solveLinearProgram", () => {
  it("should solve a linear program correctly", async () => {
    const variables = ["Ms", "Ds", "Mg", "Dg"] as const
    type Variables = (typeof variables)[number]
    const input: ILPInput<Variables[]> = {
      optimizationType: "min",
      objective: "29 Ms + 15 Ds + 111 Mg + 12 Dg",
      constraints: ["100 Ds + 200 Ms >= 300", "100 Dg + 1000 Mg >= 500"],
      integers: ["Ms", "Ds", "Mg", "Dg"],
    }
    const result = await solveLinearProgram(input)
    expect(result.objectiveValue).toBe(104)
  })
  it("should solve a linear program with binaries correctly", async () => {
    const variables = ["Ms", "Ds", "Mg", "Dg", "Dsh", "Msh"] as const
    type Variables = (typeof variables)[number]
    const input: ILPInput<Variables[]> = {
      optimizationType: "min",
      objective: "29 Ms + 15 Ds + 111 Mg + 12 Dg + 6 Msh + 6 Dsh",
      constraints: ["100 Ds + 200 Ms >= 300", "100 Dg + 1000 Mg >= 500", "9001 Msh - Ms - Mg >= 0", "9001 Dsh - Ds - Dg >= 0"],
      integers: ["Ms", "Ds", "Mg", "Dg"],
      binaries: ["Dsh", "Msh"],
    }
    const result = await solveLinearProgram(input)
    // console.log(result)
    expect(result.objectiveValue).toBe(111)
  })

  it("should auto-fix invalid variables", async () => {
    const formatVariables = ["M-s", "0Ds"]
    const input: ILPInput = {
      optimizationType: "min",
      objective: "29 M-s + 15 0Ds",
      constraints: ["100 0Ds + 200 M-s >= 300"],
      integers: ["M-s", "0Ds"],
      formatVariables,
    }
    const result = await solveLinearProgram(input)
    console.log(result)
    // console.log(Object.keys(result.variableValues))
    expect(Object.keys(result.variableValues)).toEqual(formatVariables)
    expect(result).toEqual({ objectiveValue: 44, variableValues: { "M-s": 1, "0Ds": 1 } })
  })
})
