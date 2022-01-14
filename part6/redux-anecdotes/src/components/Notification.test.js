import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../store";
import Notification from "./Notification";

describe("<Notification /> component tests", () => {
  // test("displays the notification", () => {
  //   const mockNotification = {
  //     message: "A message",
  //   };
  //   const component = render(<Notification notification={mockNotification} />);
  //   expect(component.container).toHaveTextContent("A message");
  // });
  // test("doesn't display the notification if its value is null", () => {
  //   const mockNotification = null;
  //   const component = render(<Notification notification={mockNotification} />);
  //   expect(component.container).toHaveTextContent("");
  // });
  // const store = { notification: "Hello" };

  test("doesn't display the notification by default", () => {
    const component = render(
      <Provider store={store}>
        <Notification />
      </Provider>
    );

    expect(component.container).toHaveTextContent("");
  });
});
