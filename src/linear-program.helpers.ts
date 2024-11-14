import {ILPInput} from './linear-program.types'

type InputPartKeys = 'objective' | 'bounds' | 'integers' | 'binaries' | 'constraints'
/** Input parts are used for breaking down complex LP problems into smaller parts */
export type ILPInputPart = Pick<ILPInput, InputPartKeys>
export type ILPInputRest = Omit<ILPInput, InputPartKeys>

/**
 * A tool for merging input parts together and building the {@link ILPInput}
 */
export function inputPartsToInput(parts: ILPInputPart[], rest: ILPInputRest): ILPInput {
  return {...mergeInputParts(parts), ...rest}
}

type ObjectiveSign = '+' | '-'
/**
 * A tool for merging multiple input parts into one
 * MUST use either + or - when merging objective functions, not both. Defaults to +
 * TODO: Detect "-" in beginning of objective parts and omit the +
 */
export function mergeInputParts(parts: ILPInputPart[], objectiveSign: ObjectiveSign = '+'): ILPInputPart {
  const objective = parts.map(p => p.objective).join(` ${objectiveSign} `)
  const bounds = parts.flatMap(p => p.bounds ?? [])
  const integers = parts.flatMap(p => p.integers ?? [])
  const binaries = parts.flatMap(p => p.binaries ?? [])
  const constraints = parts.flatMap(p => p.constraints ?? [])
  return {constraints, objective, bounds, integers, binaries}
}
