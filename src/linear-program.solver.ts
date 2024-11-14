import { HighsResponse, highsSolve } from "./highs.solver"
import { Bound, Constraint, ILPInput, ILPResponse } from "./linear-program.types"
import { LPFormatter, renameKeys } from "./util"
import { invert } from "lodash"

/**
 *
 * Broad reference: https://web.mit.edu/lpsolve/doc/LPBasics.htm
 * How to solve fixed costs with binaries: https://en.wikipedia.org/wiki/Big_M_method and https://www.youtube.com/watch?v=oVOuR-_x3U0
 */
export async function solveLinearProgram<Vars extends string[] = string[]>(input: ILPInput<Vars>): Promise<ILPResponse<Vars>> {
  const validVariablesMap = input.formatVariables ? LPFormatter.getFormattedVariables(input.formatVariables) : undefined
  const formattedInput = validVariablesMap ? formatValidVariables(input, validVariablesMap) : undefined
  const highsInput = formatInputHighs(formattedInput ?? input)
  const highsResponse = await highsSolve(highsInput)
  const lpResponse = highsResponseToLPResponse(highsResponse)
  return validVariablesMap ? recoverOriginalVariables(lpResponse, validVariablesMap) : lpResponse
}

export function highsResponseToLPResponse(highsResponse: HighsResponse): ILPResponse {
  const variableValues: Record<string, number> = {}
  Object.entries(highsResponse.Columns).forEach((entry) => {
    variableValues[entry[0]] = entry[1].Primal
  })
  return { objectiveValue: highsResponse.ObjectiveValue, variableValues }
}

function formatValidVariables(input: ILPInput, validVariablesMap: Record<string, string>): ILPInput {
  let { objective, bounds, constraints, binaries, integers } = input
  Object.entries(validVariablesMap).forEach(([original, formatted]) => {
    objective = objective.replaceAll(original, formatted)
    bounds = bounds?.map((b) => b.replaceAll(original, formatted)) as Bound<string>[] | undefined
    constraints = constraints?.map((c) => c.replaceAll(original, formatted)) as Constraint[]
    binaries = binaries?.map((bin) => bin.replaceAll(original, formatted))
    integers = integers?.map((i) => i.replaceAll(original, formatted))
  })
  return { ...input, objective, bounds, constraints, binaries, integers }
}

function recoverOriginalVariables(response: ILPResponse, validVariablesMap: Record<string, string>): ILPResponse {
  const mapToOriginal = invert(validVariablesMap)
  const variableValues = renameKeys(response.variableValues, mapToOriginal)
  return { ...response, variableValues }
}

/**
 * Will convert a standard input object to a highs string https://lim.univ-reunion.fr/staff/fred/Enseignement/Optim/doc/CPLEX-LP/CPLEX-LP-file-format.html
 */
export function formatInputHighs(input: ILPInput): string {
  const opType = input.optimizationType === "min" ? "Minimize" : "Maximize"
  const bounds = input.bounds?.join("\n  ")
  const integers = input.integers?.join(" ")
  const binaries = input.binaries?.join(" ")
  const constraints = input.constraints.map((v, i) => `c${i + 1}: ${v}`).join("\n  ")
  const toBlock = (heading: string, contents?: string) => (contents ? `\n${heading}\n  ${contents}` : "")

  return `
${opType}
  objective: ${input.objective}
Subject To
  ${constraints}${toBlock("Bounds", bounds)}${toBlock("General", integers)}${toBlock("Binaries", binaries)}
End
`
}
