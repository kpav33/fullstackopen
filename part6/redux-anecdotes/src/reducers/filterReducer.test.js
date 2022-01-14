import filterReducer from "./filterReducer";

describe("filterReducer", () => {
  test("returns existing state with nonexisting action type", () => {
    const state = "";
    const action = {
      type: "WRONG_TYPE",
    };

    const newState = filterReducer(state, action);

    expect(newState).toBe("");
  });

  test("returns new value with action SET_NOTIFICATION", () => {
    const state = "";
    const action = {
      type: "SET_FILTER",
      filter: "Filter",
    };

    const newState = filterReducer(state, action);

    expect(newState).toBe("Filter");
  });
});
