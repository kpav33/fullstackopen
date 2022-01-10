describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "John Smith",
      username: "John",
      password: "password",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  //   it("front page can be opened", function () {
  //     cy.contains("log in to application");
  //   });

  it("Login form is shown", function () {
    cy.contains("log in to application");
    cy.contains("username");
    cy.contains("password");
    cy.contains("Login");
  });

  //   it("user can login", function () {
  //     cy.get("input[name='Username']").type("John");
  //     cy.get("input[name='Password']").type("password");
  //     cy.get("#login-button");
  //   });

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
      cy.get("input[name='Username']").type("John");
      cy.get("input[name='Password']").type("password");
      cy.get("#login-button").click();
    });

    it("a blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("input[name='title']").type("Blog title");
      cy.get("input[name='author']").type("Blog author");
      cy.get("input[name='url']").type("www.example.com");
      cy.contains("Create").click();

      cy.contains("Blog title Blog author");
    });
  });
});
