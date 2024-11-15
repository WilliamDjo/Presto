import CustomPaper from '../../src/Components/CustomPaper';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

describe('CustomPaper Component', () => {
  const theme = createTheme();
  
  it('renders children correctly', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <CustomPaper>
          <div data-testid="test-child">Test Content</div>
        </CustomPaper>
      </ThemeProvider>
    );

    cy.get('[data-testid="test-child"]')
      .should('exist')
      .and('have.text', 'Test Content');
  });

  it('applies correct styles', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <CustomPaper>
          <div>Test Content</div>
        </CustomPaper>
      </ThemeProvider>
    );

    // Check elevation shadow
    cy.get('.MuiPaper-elevation3').should('exist');

    // Check padding and border radius
    cy.get('.MuiPaper-root')
      .should('have.css', 'padding', '32px')
      .and('have.css', 'border-radius', '8px');
  });

  it('applies styles consistently across different viewports', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <CustomPaper>
          <div>Test Content</div>
        </CustomPaper>
      </ThemeProvider>
    );

    // Test mobile viewport
    cy.viewport(320, 568);
    cy.get('.MuiPaper-root')
      .should('have.css', 'padding', '32px')
      .and('have.css', 'border-radius', '8px');

    // Test desktop viewport
    cy.viewport(1024, 768);
    cy.get('.MuiPaper-root')
      .should('have.css', 'padding', '32px')
      .and('have.css', 'border-radius', '8px');
  });
});