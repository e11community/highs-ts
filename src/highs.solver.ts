import { isBrowser } from "./util"

export interface HighsResponse {
  Status: string // 'Optimal
  Columns: Record<string, HighsVar>
  Rows: Omit<HighsVar, "type">[]
  ObjectiveValue: number
}
export interface HighsVar<Name = string> {
  Index: number
  Lower: number
  Upper: number
  Primal: number
  Type?: string
  Name: Name
}

/**
 *
 * @param problem must be posed in form https://lim.univ-reunion.fr/staff/fred/Enseignement/Optim/doc/CPLEX-LP/CPLEX-LP-file-format.html
 * @returns
 */
export async function highsSolve(problem: string): Promise<HighsResponse> {
  const highs = await initHighs()
  try {
    return highs.solve(problem)
  } catch (e: any) {
    console.error(problem)
    throw e
  }
}

type Highs = {
  solve(problem: string): HighsResponse
}

/** The single instance of the highs promise we are loading*/
let highsPromise: Promise<Highs> | undefined

/**
 * Loads highs into state and returns it OR if already loaded, returns that
 * TODO: Consider how to enable eager init of highs by consuming apps/libraries
 */
function initHighs(): Promise<Highs> {
  if (highsPromise) return highsPromise
  /**
   * Check env. If Browser, pass locateFile - should follow a standard path
   * `locateFile: (file: string) => '/assets/wasm/' + file,`
   * OR <link rel="prefetch" href="highs.wasm"> on web
   */

  const highs_settings = {
    // In node, locateFile is not needed
    // In the browser, point locateFile to the URL of the wasm file (see below)
    // locateFile: (file: string) => 'https://lovasoa.github.io/highs-js/' + file,
    locateFile: isBrowser() ? (file: string) => "https://lovasoa.github.io/highs-js/" + file : undefined,
  }
  const highs_promise = require("highs")(highs_settings)
  highsPromise = highs_promise
  return highs_promise
}
