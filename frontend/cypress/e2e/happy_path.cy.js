describe('user happy path', () => {
  // it('should navigate to landing page', () => {
  //   cy.visit('localhost:3000/')
  //   cy.url().should('include', 'localhost:3000')
  // })

  // it('should navigate to register page succressfully', () => {
  //   // cy.getCustomButton({ testId: 'button-register' }).click();
  //   cy.visit('localhost:3000/')
  //   cy.get('button[data-testid="button-register"]').click();
  //   cy.url().should('include', 'localhost:3000/register');
  // })

  // it('should register successfully', () => {
  //   // cy.getCustomButton({ testId: 'button-register' }).click();
  //   cy.intercept('POST', '/admin/auth/register', { statusCode: 200, body: {} }).as('register');
  //   cy.visit('localhost:3000/register')
  //   cy.get('[data-testid="register-full-name"]').find('input').type('Happy User');
  //   cy.get('[data-testid="register-email"]').find('input').type('happy@email.com');
  //   cy.get('[data-testid="register-password"]').find('input').type('#HappyUser123');
  //   cy.get('[data-testid="register-confirm-password"]').find('input').type('#HappyUser123');
  //   cy.get('button[data-testid="button-register"]').click();
  //   // cy.url().should('include', 'localhost:3000/dashboard');
  //   cy.url().should('include', 'localhost:3000/dashboard');
  //   // cy.url().should('include', 'localhost:3000/register');
  // })

  it('should successfully create a new presentation', () => {
    cy.intercept('POST', '/admin/auth/register', {
      statusCode: 200,
      body: {
        token: 'mocked-jwt-token', // Replace with any string as a mock token
      },
    }).as('register');
  
    cy.visit('localhost:3000/register')
    cy.get('[data-testid="register-full-name"]').find('input').type('Happy User');
    cy.get('[data-testid="register-email"]').find('input').type('happy@email.com');
    cy.get('[data-testid="register-password"]').find('input').type('#HappyUser123');
    cy.get('[data-testid="register-confirm-password"]').find('input').type('#HappyUser123');
    cy.get('button[data-testid="button-register"]').click();

    // Wait for the registration request to complete and set the token in localStorage
    cy.wait('@register').then((interception) => {
      const token = interception.response.body.token;
      window.localStorage.setItem('authToken', token); // Use the key your app expects
    });

    cy.get('button[data-testid="button-new-presentation"]').click();
    cy.get('[data-testid="presentation-name"]').find('input').type('Happy Presentation');
    cy.get('button[data-testid="button-create-presentation"]').click();
    cy.get('[data-testid="card-0"]').click();

    cy.get('[data-testid="settings-button"]').click();
  })
})