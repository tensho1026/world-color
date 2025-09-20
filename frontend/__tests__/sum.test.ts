import { describe, expect, test } from '@jest/globals'

function sum(a: number, b: number): number {
  return a + b
}

describe("sum", () => {
  test("adds numbers", () => {
    expect(sum(1, 2)).toBe(3)
  })
})
