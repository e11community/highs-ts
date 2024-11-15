import { LPInput } from "./linear-program.types"

type InputPartKeys = "objective" | "bounds" | "integers" | "binaries" | "constraints"
/** Input parts are used for breaking down complex LP problems into smaller parts */
export type LPInputPart = Pick<LPInput, InputPartKeys>
export type LPInputRest = Omit<LPInput, InputPartKeys>

/**
 * A tool for merging input parts together and building the {@link LPInput}
 */
export function inputPartsToInput(parts: LPInputPart[], rest: LPInputRest): LPInput {
  return { ...mergeInputParts(parts), ...rest }
}

type ObjectiveSign = "+" | "-"
/**
 * A tool for merging multiple input parts into one
 * MUST use either + or - when merging objective functions, not both. Defaults to +
 * TODO: Detect "-" in beginning of objective parts and omit the +
 */
export function mergeInputParts(parts: LPInputPart[], objectiveSign: ObjectiveSign = "+"): LPInputPart {
  const objective = parts.map((p) => p.objective).join(` ${objectiveSign} `)
  const bounds = parts.flatMap((p) => p.bounds ?? [])
  const integers = parts.flatMap((p) => p.integers ?? [])
  const binaries = parts.flatMap((p) => p.binaries ?? [])
  const constraints = parts.flatMap((p) => p.constraints ?? [])
  return { constraints, objective, bounds, integers, binaries }
}
