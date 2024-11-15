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

  it('should successfully create a new presentation', async () => {
    // Intercept the registration request
    cy.intercept('POST', '/admin/auth/register', {
      statusCode: 200,
      body: {
        token: 'mocked-jwt-token',
      },
    }).as('register');

    // Intercept the initial store GET request
    cy.intercept('GET', '/store', {
      statusCode: 200,
      body: {
        store: {
          presentations: []
        }
      }
    }).as('getStore');

    // Intercept the store PUT request
    cy.intercept('PUT', '/store', {
      statusCode: 200,
      body: {
        store: {
          presentations: [
            {
              id: String(Date.now()),
              title: 'Happy Presentation',
              slides: [
                {
                  slideNum: 1,
                  id: String(Date.now()),
                  contents: []
                }
              ]
            }
          ]
        }
      }
    }).as('updateStore');

    // Visit register page
    cy.visit('localhost:3000/register');
    
    // Fill out registration form
    cy.get('[data-testid="register-full-name"]').find('input').type('Happy User');
    cy.get('[data-testid="register-email"]').find('input').type('happy@email.com');
    cy.get('[data-testid="register-password"]').find('input').type('#HappyUser123');
    cy.get('[data-testid="register-confirm-password"]').find('input').type('#HappyUser123');
    cy.get('[data-testid="button-register"]').click();

    // Wait for registration and set token
    cy.wait('@register').then((interception) => {
      const token = interception.response.body.token;
      window.localStorage.setItem('token', token);
      
      // Verify token was set
      cy.window().its('localStorage').invoke('getItem', 'token')
        .should('eq', 'mocked-jwt-token');
    });

    // Create new presentation
    cy.get('button[data-testid="button-new-presentation"]').click();
    cy.get('[data-testid="presentation-name"]').find('input').type('New Presentation');
    cy.get('button[data-testid="button-create-presentation"]').click();

    // Wait for store update and verify it completed
    cy.wait('@updateStore').its('response.statusCode').should('eq', 200);
    
    // Wait for the presentation to be visible and stable before clicking
    await cy.get('[datatestid="presentation-0"]', { timeout: 10000 }).click();

    // Verify we can load the presentation
    cy.wait('@getStore');

    // 3
    cy.get('[data-testid=SettingsIcon').click();
    cy.get('[data-testid=presentation-title-edit]').find('input').type('Happy Presentation')
    cy.get('[data-testid="thumbnail-upload"]').find('button').click();
    
    // // Upload the image
    // cy.get('input[type="file"]').first()
    //   .attachFile({
    //     fileContent: 'data:image/png;base64,testimage',
    //     fileName: 'test.png',
    //     mimeType: 'image/png'
    //   });

  })
})