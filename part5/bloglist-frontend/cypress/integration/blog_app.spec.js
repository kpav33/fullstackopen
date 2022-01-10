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

  it("login form is shown", function () {
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
});
