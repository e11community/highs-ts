# highs-ts

A type-safe interface for [highs-js](https://github.com/lovasoa/highs-js) with convenient abstractions that make it easier to express linear programming problems as objects

# Motivation

I loved the flexibility, power, and performance of [highs-js](https://github.com/lovasoa/highs-js), but I kept running into puzzling bugs (all user error) and also wanted it to be easier to build linear programs dynamically for a supply order optimization problem I was working on.

# Usage

You can express a linear program as an object:

```ts
const input: ILPInput = {
  optimizationType: "max",
  objective: "x1 + 2 x2 + 4 x3 + x4",
  constraints: ["- x1 + x2 + x3 + 10 x4 <= 20", "x1 - 4 x2 + x3 <= 30", "x2 - 0.5 x4 = 0"],
  bounds: ["0 <= x1 <= 40", "2 <= x4 <= 3"],
}
const result = await solveLinearProgram(input)
// { objectiveValue: 87.5, variableValues: { x1: 17.5, x2: 1, x3: 16.5, x4: 2 } }
```

If you know your variables in advance, you can use ILPInput with a generic type for the variables and it will check your bounds, integers and binaries.

```ts
const variables = ["x1", "x2", "x3", "x4"] as const
type Variables = (typeof variables)[number]

const input: ILPInput<Variables[]> = {
  optimizationType: "max",
  objective: "x1 + 2 x2 + 4 x3 + x4",
  constraints: ["- x1 + x2 + x3 + 10 x4 <= 20", "x1 - 4 x2 + x3 <= 30", "x2 - 0.5 x4 = 0"],
  bounds: ["0 <= x1 <= 40", "2 <= x4 <= 3"],
}
const result = await solveLinearProgram(input)
// { objectiveValue: 87.5, variableValues: { x1: 17.5, x2: 1, x3: 16.5, x4: 2 } }
```

## Direct usage

# Reference material

Useful material for working with Linear Programs:

- Linear Programming basics: https://web.mit.edu/lpsolve/doc/LPBasics.htm
- How to solve fixed costs with binaries: https://en.wikipedia.org/wiki/Big_M_method and https://www.youtube.com/watch?v=oVOuR-_x3U0
-

# TO DO:

- [ ] Test on web
- [ ] Allow highs to be init in a more configurable way (e.g. with self-hosting of the wasm file)
