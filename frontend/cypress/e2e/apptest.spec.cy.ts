
beforeEach(() => {
//Inicia Sesion con cuenta
  cy.visit('http://localhost:3000/')
  cy.contains("Inicia sesión").click()
  cy.url().should('include', 'http://localhost:3000/login')
  cy.get('#email-input').type('juanitoalimanasiguioconjuana@gmail.com')
  cy.get('#password-input').type('123456')
  cy.get('#login-button').click()
  //cy.url().should('include', 'http://localhost:3000/dashboard/ajustes')
})

describe('Home page', () => { 
  it('Crear cuenta', () => {
    /*cy.get('.relative > .flex').click();
    cy.contains("Cerrar sesión").click()
    cy.url().should('include', 'http://localhost:3000/login')*/
    //cerraba sesion, ahora registro
    cy.contains("Regístrate").click()
    cy.contains("Regístrate con tu email").click()
    //Datos de registro
    cy.get('[placeholder="Leo Messi"]').type('Juanito Alimaña');
    cy.get('[placeholder= "lmessi@gmail.com"]').type('juanitoalimanasiguioconjuana@gmail.com');    
    cy.get('#register-password-input').type('123456');
    cy.get('#register-confirm-password-input').type('123456');
    cy.contains("Siguiente").click();
    cy.get('[placeholder="V29542675 (Incluya V o E)"]').type('V12345678');
    cy.get('[placeholder="0412-1234567"]').type('04125658533'); 
    cy.contains("Enviar").click();
    // Please confirm the email manually
  })

  it('Editar datos personales', () => {
    cy.url().should('include', 'http://localhost:3000/dashboard/ajustes')
    cy.contains("Editar").first().click()
    cy.get('input').first().clear().type('Pepito Perez')
    cy.contains("Guardar").click()
    cy.reload();
    cy.contains("Juanito Alimaña").should('not.exist');
    //confirmado el cambio de los datos personales
    cy.contains("Editar").first().click()
    cy.get('input').first().clear().type("Juanito Alimaña")
    cy.contains("Guardar").click()
    cy.reload();
    cy.visit('http://localhost:3000/dashboard/ajustes')
    cy.get('.relative > .flex').click();
    cy.contains("Cerrar sesión").click()

  })
  

  it('Inicia Sesion exitosamente', () => {
    cy.url().should('include', 'http://localhost:3000/dashboard/ajustes')
    cy.visit('http://localhost:3000/dashboard/ajustes')
    cy.get('.relative > .flex').click();
    cy.contains("Cerrar sesión").click()
    cy.url().should('include', 'http://localhost:3000/login')
  })
/*
  it('Elimina cuenta', () => {
    cy.visit('http://localhost:3000/dashboard/ajustes')
    cy.contains("Eliminar Perfil").click()
    cy.get('#password').type('123456')
    cy.contains("Confirmar").click()
    cy.get('#email-input').type('sebaveaa@gmail.com')
    cy.get('#password-input').type('123456')
    cy.get('#login-button').click()
    //prueba que no se pueda hacer login
    cy.visit('http://localhost:3000/')
    cy.contains("Inicia sesión").click()
    cy.url().should('include', 'http://localhost:3000/login')
    cy.get('#email-input').type('juanitoalimanasiguioconjuana@gmail.com')
    cy.get('#password-input').type('123456')
    cy.get('#login-button').click()
    cy.url().should('include', 'http://localhost:3000/login') 
  });*/
  

  
})