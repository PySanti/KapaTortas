


describe('Prueba minima', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
    cy.get('.justify-end > .gap-2').click()
    cy.url().should('include', 'http://localhost:3000/login')
    cy.get('#email-input').type('sebaveaa@gmail.com')
    cy.get('#password-input').type('123456')
    cy.get('.bg-primary').click()

  })
})