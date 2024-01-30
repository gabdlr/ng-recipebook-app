import { Ingredient } from "./ingredient.model";

describe("ingredient model", () => {
  it("should be created", () => {
    expect(new Ingredient("mock", 1)).toBeTruthy();
  });
});
