describe('Central de Atendimento ao Cliente TAT', () => {
 
  beforeEach(()=>{
    cy.visit('./src/index.html')
  })
  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', ()=>{
    cy.get('#firstName').type( 'Pomposo')
    cy.get('#lastName').type('Silva')
    cy.get('#email').type('pomposo-silva@gmail.com')
    cy.get('#open-text-area').type('QA teste plataforma CAC-TAT')
    cy.get('button[type="submit"]').click()

    cy.get('.success').should('be.visible')
  })
})