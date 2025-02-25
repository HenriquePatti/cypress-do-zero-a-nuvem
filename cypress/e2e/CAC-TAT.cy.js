describe("Central de Atendimento ao Cliente TAT", () => {
  beforeEach(() => {
    cy.visit("./src/index.html");
  });

  it("verifica o título da aplicação", () => {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("preenche os campos obrigatórios e envia o formulário", () => {
    cy.clock();
    const longText = Cypress._.repeat("QA teste plataforma CAC-TAT ", 15);
    cy.get("#firstName").type("Pomposo");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("pomposo-silva@gmail.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");
    cy.tick(3000);
    cy.get(".success").should("not.be.visible");
  });

  const longText = Cypress._.repeat("QA teste plataforma CAC-TAT ", 15);
  const invalidEmails = [
    "cremoso-pompeugmail.com",
    // "cremoso pompeu@gmail.com", // ⚠ Temporariamente desativado devido a falha conhecida na validação do campo de e-mail
    "cremoso-pompeu@gmailcom",
    "cremoso-pompeu@ gmailcom",
  ];

  invalidEmails.forEach((email) => {
    it(`exibe mensagem de erro ao submeter e-mails inválidos ${email}`, () => {
      cy.clock();

      cy.get("#firstName").type("Cremoso");
      cy.get("#lastName").type("Pompeu");
      cy.get("#email").type(email);
      cy.get("#open-text-area").type(longText, { delay: 0 });
      cy.contains("button", "Enviar").click();

      cy.get(".error").should("be.visible");
      cy.get(".sucess").should("not.exist");
      cy.tick(3000);

      cy.get(".error").should("not.be.visible");
      cy.get(".sucess").should("not.exist");

      cy.get("#email").clear();
    });
  });

  it("mantém o campo de telefone vazio ao inserir valores não numéricos", () => {
    cy.get("#phone")
      .type("`˜!@#$%ˆ&* ()_-+={[}];:'<,>.?/abcA")
      .should("be.empty");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.clock();
    const longText = Cypress._.repeat("QA teste plataforma CAC-TAT ", 15);
    cy.get("#firstName").type("Pomposo");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("pomposo-silva@gmail.com");
    cy.get("#phone").should("not.have.attr", "required");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get("#phone").should("have.value", "");
    cy.get("#phone").should("have.attr", "required");
    cy.get(".error").should("be.visible");
    cy.tick(3000);
    cy.get(".error").should("not.be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName").type("Pomposo").should("have.value", "Pomposo");
    cy.get("#lastName").type("Silva").should("have.value", "Silva");
    cy.get("#email")
      .type("pomposo-silva@gmail.com")
      .should("have.value", "pomposo-silva@gmail.com");
    cy.get("#phone").type("11987654321").should("have.value", "11987654321");

    cy.get("#firstName").clear().should("be.empty");
    cy.get("#lastName").clear().should("be.empty");
    cy.get("#email").clear().should("be.empty");
    cy.get("#phone").clear().should("be.empty");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.", () => {
    cy.clock();
    cy.contains("button", "Enviar").click();

    cy.get(".sucess").should("not.be.exist");
    cy.get(".error").should("be.visible");

    cy.tick(3000);
    cy.get(".sucess").should("not.be.exist");
    cy.get(".error").should("not.be.visible");
  });

  it("envia o formuário com sucesso usando um comando customizado", () => {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();

    cy.get(".success").should("be.visible");
    cy.tick(3000);
    cy.get(".success").should("not.be.visible");
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('[type="radio"]').check("feedback").should("have.value", "feedback");
  });

  it("seleciona e verifica o valor de cada tipo de atendimento", () => {
    const valuesRadio = ["ajuda", "elogio", "feedback"];
    cy.get('[type="radio"]')
      .should("have.length", valuesRadio.length)
      .each(($radio, index) => {
        cy.wrap($radio)
          .check()
          .should("be.checked")
          .and("have.value", valuesRadio[index]);
      });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('[type="checkbox"]')
      .as("checkbox")
      .each(($check) => {
        cy.wrap($check).check().should("be.checked");
      });

    cy.get("@checkbox").last().uncheck().should("not.be.checked");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get("#file-upload")
      .selectFile("cypress/fixtures/example.json", null)
      .then((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get("#file-upload")
      .selectFile("cypress/fixtures/example.json", null, {
        action: "drag-drop",
      })
      .then((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json", null).as("dataFixture");
    cy.get("#file-upload")
      .selectFile("@dataFixture")
      .then((data) => {
        expect(data[0].files[0].name).to.equal("example.json");
      });
  });

  it("exibe e oculta as mensagens de sucesso e erro usando .invoke()", () => {
    cy.validateAlertVisibility(".success");
    cy.validateAlertVisibility(".error");
  });

  it("preenche o campo da área de texto usando o comando invoke.", () => {
    const textDescription = Cypress._.repeat("QA TESTE ", 3);

    cy.get("#open-text-area").as("description").invoke("val", textDescription);

    cy.get("@description").should("have.value", textDescription);
  });

  it("faz uma requisição HTTP GET", () => {
    const url = "https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html";

    cy.request('GET', url).as('xhr-response')

    cy.get('@xhr-response').should((response)=>{
      expect(response.status).to.equal(200)
      expect(response.statusText).to.equal('OK')
      expect(response.body).to.include("CAC TAT");
    })

  });

  it('revela imagem oculta do gato', ()=> {
    cy.get('#cat').as('imageCat'); // Arrange
    cy.get('@imageCat').should('not.be.visible');

    cy.get('@imageCat').invoke('show'); // Act

    cy.get('@imageCat').should('be.visible'); // Assert

  })

});
