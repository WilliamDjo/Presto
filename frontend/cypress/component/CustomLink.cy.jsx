import { mount } from 'cypress/react18';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import CustomLink from '../../src/Components/CustomLink';

describe('CustomLink Component', () => {
  const renderComponent = (text, navigateTo) => {
    const routes = [
      {
        path: '/',
        element: <CustomLink text={text} navigateTo={navigateTo} />,
      },
      {
        path: '/test-route',
        element: <div data-testid="test-route">Test Route Content</div>,
      },
      {
        path: '/user/:id',
        element: <div data-testid="user-route">User Profile Content</div>,
      }
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ['/'],
      initialIndex: 0,
    });

    return mount(<RouterProvider router={router} />);
  };

  it('renders with correct text', () => {
    const testText = 'Test Link';
    renderComponent(testText, '/test-route');
    cy.get('a').should('have.text', testText);
  });

  it('has correct styling', () => {
    renderComponent('Test Link', '/test-route');
    
    // Check base styles
    cy.get('a')
      .should('have.attr', 'class')
      .and('include', 'MuiLink-root')
      .and('include', 'MuiLink-underlineHover');

    // Check cursor style
    cy.get('a')
      .invoke('css', 'cursor')
      .should('eq', 'pointer');

    // Check margin-left
    cy.get('a')
      .should('have.css', 'margin-left', '8px');

    // Check text decoration
    cy.get('a')
      .should('have.css', 'text-decoration-line', 'none');
  });

  it('navigates to correct route on click', () => {
    const testRoute = '/test-route';
    renderComponent('Test Link', testRoute);

    cy.get('a').click();
    cy.get('[data-testid="test-route"]')
      .should('exist')
      .and('contain', 'Test Route Content');
  });

  it('handles navigation with parameters', () => {
    const testRoute = '/user/123';
    renderComponent('User Profile', testRoute);

    cy.get('a').click();
    cy.get('[data-testid="user-route"]')
      .should('exist')
      .and('contain', 'User Profile Content');
  });

  it('maintains accessibility standards', () => {
    renderComponent('Accessible Link', '/test');

    cy.get('a')
      .should('be.visible')
      .and('not.have.attr', 'aria-hidden');
  });
});

