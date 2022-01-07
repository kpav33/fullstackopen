import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { Notification } from "./Notification";

describe("<Notification /> component tests", () => {
  test("dont show the message if notification is equal null", () => {
    const mockNotification = null;

    const component = render(<Notification notification={mockNotification} />);

    expect(component.container).toHaveTextContent("");
  });

  test("show the success notification with appropriate values", () => {
    const mockNotification = {
      type: "success",
      message: "message",
    };

    const component = render(<Notification notification={mockNotification} />);
    const div = component.container.querySelector(".success");

    expect(component.container).toHaveTextContent("message");
    expect(div).toBeDefined();
    expect(div).not.toHaveClass("error");
  });

  test("show the error notification with appropriate values", () => {
    const mockNotification = {
      type: "error",
      message: "message",
    };

    const component = render(<Notification notification={mockNotification} />);
    const div = component.container.querySelector(".error");

    expect(component.container).toHaveTextContent("message");
    expect(div).toBeDefined();
    expect(div).not.toHaveClass("success");
  });
});
