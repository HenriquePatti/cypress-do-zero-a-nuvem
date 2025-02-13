// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('fillMandatoryFieldsAndSubmit', ( dataField = {
    firstName: 'Contoso',
    lastName: 'Numeric',
    mail: 'contosonumeric@gmail.com',
    description: 'QA Teste QA Test QA Test' 
})=> {
    cy.get("#firstName").type(dataField.firstName);
    cy.get("#lastName").type(dataField.lastName);
    cy.get("#email").type(dataField.mail);
    cy.get("#open-text-area").type(dataField.description, { delay: 0 })
    cy.get('button[type="submit"]').click();
})