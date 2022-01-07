import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import { BlogForm } from "./BlogForm";

describe("blog form component tests", () => {
  const mockCreateBlog = jest.fn();

  test("<BlogForm /> updates parent state and calls onSubmit", () => {
    const component = render(<BlogForm createBlog={mockCreateBlog} />);

    const form = component.container.querySelector("form");
    const inputTitle = component.container.querySelector("input[name='title']");
    const inputAuthor = component.container.querySelector(
      "input[name='author']"
    );
    const inputUrl = component.container.querySelector("input[name='url']");

    fireEvent.change(inputTitle, {
      target: { value: "Blog title" },
    });
    fireEvent.change(inputAuthor, {
      target: {
        value: "Author name",
      },
    });
    fireEvent.change(inputUrl, {
      target: { value: "www.example.com" },
    });
    fireEvent.submit(form);

    expect(mockCreateBlog.mock.calls).toHaveLength(1);
    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      title: "Blog title",
      author: "Author name",
      url: "www.example.com",
    });
  });
});
