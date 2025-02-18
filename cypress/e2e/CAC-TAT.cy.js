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
    cy.contains('button', 'Enviar').click();

    cy.get(".success").should("be.visible");
  });

  const longText = Cypress._.repeat("QA teste plataforma CAC-TAT ", 15);
  const invalidEmails = [
    "cremoso-pompeugmail.com",
    "cremoso pompeu@gmail.com",
    "cremoso-pompeu@gmailcom",
    "cremoso-pompeu@ gmailcom",
  ];

  invalidEmails.forEach((email) => {
    it(`exibe mensagem de erro ao submeter e-mails inválidos ${email}`, () => {
      cy.get("#firstName").type("Cremoso");
      cy.get("#lastName").type("Pompeu");
      cy.get("#email").type(email);
      cy.get("#open-text-area").type(longText, { delay: 0 });
      cy.contains('button', 'Enviar').click();

      cy.get(".error", { timeout: 10000 }).should("be.visible");
      cy.get("body").then(($body) => {
        if ($body.find(".success").length > 0) {
          cy.get(".success").should("not.be.visible");
        }
      });
      cy.get("#email").clear();
      cy.reload()
    });
  });

  it('mantém o campo de telefone vazio ao inserir valores não numéricos', () => {
    cy.get("#phone")
      .type("`˜!@#$%ˆ&* ()_-+={[}];:'<,>.?/abcA")
      .should('be.empty')
  });
  
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário',()=>{
    const longText = Cypress._.repeat("QA teste plataforma CAC-TAT ", 15);
    cy.get("#firstName").type("Pomposo");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("pomposo-silva@gmail.com");
    cy.get('#phone').should('not.have.attr', 'required')
    cy.get('#phone-checkbox').check();
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains('button', 'Enviar').click();

    cy.get('#phone').should('have.value', '')
    cy.get('#phone').should('have.attr', 'required')
    cy.get(".error").should("be.visible");
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', ()=>{
    cy.get("#firstName")
      .type("Pomposo")
      .should('have.value', 'Pomposo');
    cy.get("#lastName")
      .type("Silva")
      .should('have.value', 'Silva');
    cy.get("#email")
      .type("pomposo-silva@gmail.com")
      .should('have.value', 'pomposo-silva@gmail.com');
    cy.get('#phone')
      .type('11987654321')
      .should('have.value', '11987654321')
     
    cy.get("#firstName")
      .clear()
      .should('be.empty');
    cy.get("#lastName")
      .clear()
      .should('be.empty');
    cy.get("#email")
      .clear()
      .should('be.empty');
    cy.get('#phone')
      .clear()
      .should('be.empty')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios.', ()=> {
    cy.contains('button', 'Enviar').click();

    cy.get('.sucess').should('not.be.exist')
    cy.get('.error').should('be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', ()=>{
    cy.fillMandatoryFieldsAndSubmit()

    cy.get(".success").should("be.visible");
        
  })

  it('seleciona um produto (YouTube) por seu texto', ()=> {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
   
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', ()=> {
    cy.get('#product')
    .select('mentoria')
    .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', ()=> {
    cy.get('#product')
    .select(1)
    .should('have.value', 'blog')
  })

  it('marca o tipo de atendimento "Feedback"',()=> {
    cy.get('[type="radio"]')
      .check('feedback')
      .should('have.value', 'feedback')
  })

  it('seleciona e verifica o valor de cada tipo de atendimento', ()=> {
    const valuesRadio = [ 'ajuda', 'elogio', 'feedback']
    cy.get('[type="radio"]')
      .should('have.length', valuesRadio.length)
      .each( ($radio, index)=> {
        cy.wrap($radio)
          .check()
          .should('be.checked')
          .and('have.value', valuesRadio[index])
      })
  })

  it('marca ambos checkboxes, depois desmarca o último', ()=> {
    cy.get('[type="checkbox"]').as('checkbox')
      .each( ($check)=> {
        cy.wrap($check)
          .check()
          .should('be.checked')
      })
    
    cy.get('@checkbox')
      .last()
      .uncheck()
      .should('not.be.checked')
  })
     
})
