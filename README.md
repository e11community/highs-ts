# highs-ts

A type-safe interface for [highs-js](https://github.com/lovasoa/highs-js) with convenient abstractions that make it easier to express linear programming problems as objects

# Motivation

I loved the flexibility, power, and performance of [highs-js](https://github.com/lovasoa/highs-js), but I kept running into puzzling bugs (all user error) and also wanted it to be easier to build linear programs dynamically for a supply order optimization problem I was working on.

# Usage

You can express a linear program as an object:

```ts
const input: LPInput = {
  optimizationType: "max",
  objective: "x1 + 2 x2 + 4 x3 + x4",
  constraints: ["- x1 + x2 + x3 + 10 x4 <= 20", "x1 - 4 x2 + x3 <= 30", "x2 - 0.5 x4 = 0"],
  bounds: ["0 <= x1 <= 40", "0 <= x3 <= 20.5"],
  integers: ["x2"],
  binaries: ["x4"],
}
const result = await solveLinearProgram(input)
// { objectiveValue: 91.5, variableValues: { x1: 9.5, x2: 0, x3: 20.5, x4: 0 } }
```

If you know your variables in advance, you can use LPInput with a generic type for the variables and it will check your bounds, integers and binaries.

```ts
const variables = ["x1", "x2", "x3", "x4"] as const
type Variables = (typeof variables)[number]

const input: LPInput<Variables[]> = {
  optimizationType: "max",
  objective: "x1 + 2 x2 + 4 x3 + x4",
  constraints: ["- x1 + x2 + x3 + 10 x4 <= 20", "x1 - 4 x2 + x3 <= 30", "x2 - 0.5 x4 = 0"],
  bounds: ["0 <= x1 <= 40", "0 <= x3 <= 20.5"],
  integers: ["x2"],
  binaries: ["x4"],
}
const result = await solveLinearProgram(input)
// { objectiveValue: 91.5, variableValues: { x1: 9.5, x2: 0, x3: 20.5, x4: 0 } }
```

## Input building

For complex problems, you may want to build your input dynamically and merge together variables from different sources.

We expose some type-safe utilities to help with this.

```ts
const part1: LPInputPart = {
  constraints: ["a > 0", "b > 0"],
  objective: `1 a + 2 b`,
  binaries: ["a"],
  bounds: [],
  integers: ["b"],
}
const part2: LPInputPart = {
  constraints: ["c > 0", "d > 0"],
  objective: `3 c + 4 d`,
  binaries: ["c"],
  bounds: [],
  integers: ["d"],
}
const parts = [part1, part2]

const input = inputPartsToInput(parts, { optimizationType: "min" })
const expected = {
  constraints: ["a > 0", "b > 0", "c > 0", "d > 0"],
  objective: "1 a + 2 b + 3 c + 4 d",
  bounds: [],
  integers: ["b", "d"],
  binaries: ["a", "c"],
  optimizationType: "min",
}
expect(input).toEqual(expected)
```

or if you need to merge input parts ahead of time: `mergeInputParts([part1, part2])`

## Variable formatting

If you're working with dynamic variable names and running into bugs with invalid characters (e.g. -\*^[]+ or variables starting with a number), try `LPFormatter.formatVariable` to make a best-effort attempt at making your variable names valid.

# Reference material

Useful material for working with Linear Programs:

- Linear Programming basics: https://web.mit.edu/lpsolve/doc/LPBasics.htm
- How to solve fixed costs with binaries: https://en.wikipedia.org/wiki/Big_M_method and https://www.youtube.com/watch?v=oVOuR-_x3U0

# TO DO:

- [ ] Test on web
- [ ] Allow highs to be init in a more configurable way (e.g. with self-hosting of the wasm file)
