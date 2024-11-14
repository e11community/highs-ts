type Operator = '+' | '-'
type LessThanComparison = '<=' | '<'
type GreaterThanComparison = '>=' | '>'
type Eq = '='
type Lower = `${number} ${LessThanComparison | Eq}`
type Upper = `${LessThanComparison | Eq} ${number}`
type Comparison = LessThanComparison | GreaterThanComparison | Eq
export type Bound<Var extends string = string> = `${Lower} ${Var}` | `${Var} ${Upper}` | `${Lower} ${Var} ${Upper}`

export type Constraint = `${string} ${Comparison} ${number}`

/**
 * Expressions must conform to format: https://web.mit.edu/lpsolve/doc/CPLEX-format.htm
 * Variables names cannot exceed 255 characters, all of which must be alphanumeric (a-z, A-Z, 0-9) or one of these symbols: ! " # $ % & ( ) / , . ; ? @ _ ` ' { } | ~. Longer names are truncated to 255 characters. A variable name cannot begin with a number or a period.
 */
export interface ILPInput<Variables extends string[] = string[]> {
  optimizationType: 'min' | 'max'
  /** Of form  '29 a + 15 b + 111 c + 12 d' */
  objective: string // TODO:  ExpressionRecursive<Variables[number], Variables['length']> Also: Consider breaking down into array of VariableTerms
  /** Of form  '100 a + 200 b >= 300' - number must be on its own on LHS */
  constraints: Constraint[]
  /** Variables that must take 0 or 1 as their value */
  binaries?: Variables
  /** Variables that can only be integers */
  integers?: Variables
  /** Of form  '0 <= a <= 100' - all variables are assumed to be >=0 unless otherwise stated */
  bounds?: Bound<Variables[number]>[]
  /**
   * ! Warning: Affects performance significantly. Only use if strictly necessary.
   *
   * If passed in, will substitute exact matches of these variables for valid variables during the calculation - these will be substituted back out before returning.
   * This is for convenience. Using LPFormatter directly when creating the variables will result in better performance
   */
  formatVariables?: Variables
}

export interface ILPResponse<Variables extends string[] = string[]> {
  objectiveValue: number
  variableValues: Record<Variables[number], number>
}

// type VariableTerm<Var extends string> = `${number} ${Var}`

// type DepthMinusOne<T extends number> = T extends 1
//   ? never
//   : T extends 2
//   ? 1
//   : T extends 3
//   ? 2
//   : T extends 4
//   ? 3
//   : T extends 5
//   ? 4
//   : T extends 6
//   ? 5
//   : T extends 7
//   ? 6
//   : T extends 8
//   ? 7
//   : T extends 9
//   ? 8
//   : T extends 10
//   ? 9
//   : never

// type ExpressionRecursive<Var extends string, Depth extends number = 0> = Depth extends 1
//   ? VariableTerm<Var>
//   : `${VariableTerm<Var>} ${Operator} ${ExpressionRecursive<Var, DepthMinusOne<Depth>>}`
