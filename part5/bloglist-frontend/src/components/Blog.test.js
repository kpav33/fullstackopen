import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import Blog from "./Blog";

describe("blog component tests", () => {
  const blog = {
    title: "Magnificent title",
    author: "John Smith",
    url: "www.example.com",
    likes: 5,
  };

  const mockUser = {};
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
});
