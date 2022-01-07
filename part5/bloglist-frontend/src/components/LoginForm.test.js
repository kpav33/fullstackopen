import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import { LoginForm } from "./LoginForm";

describe("<LoginForm /> component tests", () => {
  const mockHandleSubmit = jest.fn();
  const mockUsername = "username";
  const mockHandleUsernameChange = jest.fn();
  const mockPassword = "password";
  const mockHandlePasswordChange = jest.fn();

  test("on submit event the function gets called once", () => {
    const component = render(
      <LoginForm
        handleSubmit={mockHandleSubmit}
        username={mockUsername}
        handleUsernameChange={mockHandleUsernameChange}
        password={mockPassword}
        handlePasswordChange={mockHandlePasswordChange}
      />
    );

    const form = component.container.querySelector("form");
    fireEvent.submit(form);

    expect(mockHandleSubmit.mock.calls).toHaveLength(1);
  });
});
