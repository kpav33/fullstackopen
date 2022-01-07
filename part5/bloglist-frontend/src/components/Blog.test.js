import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("<Blog /> component tests", () => {
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

  test("if the likes button is pressed twice, the event handler is called twice", () => {
    const component = render(
      <Blog
        blog={blog}
        user={mockUser}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
      />
    );

    const viewButton = component.getByText("view");
    fireEvent.click(viewButton);
    const likeButton = component.getByText("Like");
    fireEvent.click(likeButton);

    expect(mockUpdateBlog.mock.calls).toHaveLength(1);
  });

  test("if the remove button is clicked once, the event handler is called once", () => {
    const component = render(
      <Blog
        blog={blog}
        user={mockUser}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
      />
    );

    const viewButton = component.getByText("view");
    fireEvent.click(viewButton);
    const removeButton = component.getByText("remove");
    fireEvent.click(removeButton);

    expect(mockDeleteBlog.mock.calls).toHaveLength(1);
  });

  test("dont show remove button if usernames are not the same", () => {
    const differentUser = {
      username: "root",
    };

    const component = render(
      <Blog
        blog={blog}
        user={differentUser}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
      />
    );

    const viewButton = component.getByText("view");
    fireEvent.click(viewButton);

    expect(component.container).not.toHaveTextContent("remove");
  });
});
