describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "John Smith",
      username: "John",
      password: "password",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    const secondUser = {
      name: "Mike Smith",
      username: "Mike",
      password: "other-password",
    };
    cy.request("POST", "http://localhost:3003/api/users", secondUser);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("log in to application");
    cy.contains("username");
    cy.contains("password");
    cy.contains("Login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("input[name='Username']").type("John");
      cy.get("input[name='Password']").type("password");
      cy.get("#login-button").click();

      cy.contains("John Smith logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("input[name='Username']").type("John");
      cy.get("input[name='Password']").type("wrong-password");
      cy.get("#login-button").click();

      cy.get(".error").should("contain", "wrong username or password");
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
      cy.get(".error").should("have.css", "border-style", "solid");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      //   cy.get("input[name='Username']").type("John");
      //   cy.get("input[name='Password']").type("password");
      //   cy.get("#login-button").click();

      cy.login({ username: "John", password: "password" });
    });

    it("a blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("input[name='title']").type("Blog title");
      cy.get("input[name='author']").type("Blog author");
      cy.get("input[name='url']").type("www.example.com");
      cy.contains("Create").click();

      cy.contains("Blog title Blog author");
    });

    it("users can like a blog", function () {
      //   cy.contains("create new blog").click();
      //   cy.get("input[name='title']").type("Blog title");
      //   cy.get("input[name='author']").type("Blog author");
      //   cy.get("input[name='url']").type("www.example.com");
      //   cy.contains("Create").click();

      cy.createBlog({
        title: "Blog title",
        author: "Blog author",
        url: "www.example.com",
      });

      cy.contains("Blog title Blog author");
      cy.contains("view").click();
      cy.get("#like-button").click();
      cy.get("#like-button").click();
      cy.contains("2");
    });

    it("users who created the blog can delete it", function () {
      cy.createBlog({
        title: "Blog title",
        author: "Blog author",
        url: "www.example.com",
      });

      cy.contains("Blog title Blog author");
      cy.contains("view").click();
      cy.get("#remove-button").click();

      cy.get(".success").should(
        "contain",
        "Blog title by Blog author has been deleted"
      );
      cy.get(".success").should("have.css", "color", "rgb(0, 128, 0)");
      cy.get(".success").should("have.css", "border-style", "solid");

      cy.get("html").should("not.contain", "Blog title Blog author");
    });

    it("users who did not create the blog can not delete it", function () {
      cy.createBlog({
        title: "Blog title",
        author: "Blog author",
        url: "www.example.com",
      });

      cy.contains("Logout").click();
      cy.login({ username: "Mike", password: "other-password" });
      cy.contains("Mike Smith logged in");

      cy.contains("Blog title Blog author");
      cy.contains("view").click();
      cy.get("#remove-button").should("not.exist");
    });
  });
});
