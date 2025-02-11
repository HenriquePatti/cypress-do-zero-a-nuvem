describe("Central de Atendimento ao Cliente TAT", () => {
  beforeEach(() => {
    cy.visit("./src/index.html");
  });
  
  it("verifica o título da aplicação", () => {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("preenche os campos obrigatórios e envia o formulário", () => {
    const longText = Cypress._.repeat("QA teste plataforma CAC-TAT ", 15);
    cy.get("#firstName").type("Pomposo");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("pomposo-silva@gmail.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get('button[type="submit"]').click();

    cy.get(".success").should("be.visible");
  });

  const longText = Cypress._.repeat("QA teste plataforma CAC-TAT ", 15);
  const invalidEmails = [
    "cremoso-pompeugmail.com",
    "cremoso  pompeu@gmail.com",
    "cremoso-pompeu@gmailcom",
    "cremoso-pompeu@ gmailcom",
  ];

  invalidEmails.forEach((email) => {
    it(`exibe mensagem de erro ao submeter e-mails inválidos ${email}`, () => {
      cy.get("#firstName").type("Cremoso");
      cy.get("#lastName").type("Pompeu");
      cy.get("#email").type(email);
      cy.get("#open-text-area").type(longText, { delay: 0 });
      cy.get('button[type="submit"]').click();

      cy.get(".error", { timeout: 10000 }).should("be.visible");
      cy.get("body").then(($body) => {
        if ($body.find(".success").length > 0) {
          cy.get(".success").should("not.be.visible");
        }
      });
      cy.get("#email").clear();
    });
  });
  
});
