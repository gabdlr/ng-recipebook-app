import { Recipe } from "./recipe.model";

describe("Recipe model", () => {
  it("should be created", () => {
    expect(new Recipe("mock", "mock", "mock", [])).toBeTruthy();
  });
});
