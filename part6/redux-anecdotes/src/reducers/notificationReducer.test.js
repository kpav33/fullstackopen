import notificationReducer from "./notificationReducer";

describe("notificationReducer", () => {
  test("returns existing state with nonexisting action type", () => {
    const state = null;
    const action = {
      type: "WRONG_TYPE",
    };

    const newState = notificationReducer(state, action);

    expect(newState).toBeNull();
  });

  test("returns new value with action SET_NOTIFICATION", () => {
    const state = null;
    const action = {
      type: "SET_NOTIFICATION",
      notification: "Hello",
    };

    const newState = notificationReducer(state, action);

    expect(newState).toBe("Hello");
  });
});
