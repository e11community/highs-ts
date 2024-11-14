import { cloneDeep } from "lodash"

export const isBrowser = () => typeof window === "object"

/**
 * Assists you in formatting variables for a LP problem - useful if you know your variables have bad characters such as -*^[]+ or can start with a number
 * Static class holding utility methods. Class instead of functions to remain tightly scoped to LP and disambiguate what we are formatting for
 */
export class LPFormatter {
  /**
   * Make a best effort attempt to make variable name conform to requirements
   * https://web.mit.edu/lpsolve/doc/CPLEX-format.htm
   */
  static formatVariable(variableName: string): string {
    const removedBadCharacters = variableName.replaceAll(/(-|\*|\^|\[|\]|\+)/gm, "") // do not permit any of: -*^[]+
    const firstCharGood = `_${removedBadCharacters}` // cannot start with a . or a number, so forcing a valid start char
    return firstCharGood.slice(0, 255) // Truncate to char cap
  }

  /**
   *
   * @param variableNames
   * @returns an object mapping bad variable names to good ones, for conversion purposes
   */
  static getFormattedVariables(variableNames: string[]): Record<string, string> {
    const obj: Record<string, string> = {}
    return variableNames.reduce((acc, currentVar) => ({ ...acc, [currentVar]: LPFormatter.formatVariable(currentVar) }), obj)
  }
}

/**
 * Does not mutate the original object
 * @param obj
 * @param keys
 * @returns a new object with the keys renamed
 */

export function renameKeys<T, K extends keyof T>(
  obj: T,
  keys: Record<K, string>
): { [Property in keyof T as Property extends K ? (typeof keys)[Property] : Property]: T[Property] } {
  const objCopy: any = cloneDeep(obj)
  Object.keys(keys).forEach((key) => {
    const oldKey = key as K
    const newKey = keys[oldKey]
    if (oldKey !== newKey) {
      objCopy[newKey] = objCopy[oldKey]
      delete objCopy[oldKey]
    }
  })
  return objCopy
}
