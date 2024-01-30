import { User } from "./user.model";

describe("user model", () => {
  it("should be created", () => {
    expect(new User("mock", "mock", "mock", new Date())).toBeTruthy();
  });

  it("should return token if token has not expired", () => {
    const MOCK_TOKEN = "mock";
    const user = new User("mock", "mock", MOCK_TOKEN, new Date());
    expect(user.token).toBe(MOCK_TOKEN);
  });

  it("should not return token if expiration date isn't set", () => {
    const user = new User("mock", "mock", "mock", null);
    expect(user.token).toBe(null);
  });

  it("should not return token if expiration date is passed", () => {
    const user = new User("mock", "mock", "mock", new Date(null));
    expect(user.token).toBe(null);
  });
});
