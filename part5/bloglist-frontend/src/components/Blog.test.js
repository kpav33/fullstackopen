import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("blog component tests", () => {
  const blog = {
    title: "Magnificent title",
    author: "John Smith",
    url: "www.example.com",
    likes: 5,
    user: {
      username: "user",
    },
  };

  const mockUser = {
    username: "user",
  };
  const mockUpdateBlog = jest.fn();
  const mockDeleteBlog = jest.fn();

  test("renders blog component with only title and url", () => {
    const component = render(
      <Blog
        blog={blog}
        user={mockUser}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
      />
    );

    expect(component.container).toHaveTextContent(
      "Magnificent title John Smith"
    );
    //   expect(component.container).toHaveTextContent("My author");
    expect(component.container).not.toHaveTextContent("www.example.com");
    expect(component.container).not.toHaveTextContent("5");
  });

  test("show url and number of likes when the toggle button is clicked", () => {
    const component = render(
      <Blog
        blog={blog}
        user={mockUser}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
      />
    );

    const button = component.getByText("view");
    fireEvent.click(button);

    expect(component.container).toHaveTextContent(
      "Magnificent title John Smith"
    );
    expect(component.container).toHaveTextContent("www.example.com");
    expect(component.container).toHaveTextContent("5");
  });

  test("hide url and number of likes when hide button is clicked", () => {
    const component = render(
      <Blog
        blog={blog}
        user={mockUser}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
      />
    );

    const button = component.getByText("view");
    fireEvent.click(button);

    expect(button).toHaveTextContent("hide");
    fireEvent.click(button);

    expect(component.container).toHaveTextContent(
      "Magnificent title John Smith"
    );
    expect(component.container).not.toHaveTextContent("www.example.com");
    expect(component.container).not.toHaveTextContent("5");
  });
});
