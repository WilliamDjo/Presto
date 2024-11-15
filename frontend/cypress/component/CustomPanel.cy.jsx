import CentralPanel from '../../src/Components/CentralPanel';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

describe('CentralPanel Component', () => {
  const theme = createTheme();
  
  beforeEach(() => {
    // Set viewport to a standard desktop size
    cy.viewport(1024, 768);
  });

  it('renders children correctly', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <CentralPanel>
          <div data-testid="test-child">Test Content</div>
        </CentralPanel>
      </ThemeProvider>
    );

    // Check if children are rendered
    cy.get('[data-testid="test-child"]')
      .should('exist')
      .and('have.text', 'Test Content');
  });

  it('uses default maxWidth (xs)', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <CentralPanel>
          <div>Test Content</div>
        </CentralPanel>
      </ThemeProvider>
    );

    // Check if Container has maxWidth="xs"
    cy.get('.MuiContainer-root')
      .should('have.class', 'MuiContainer-maxWidthXs');
  });

  it('accepts custom maxWidth prop', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <CentralPanel maxWidth="md">
          <div>Test Content</div>
        </CentralPanel>
      </ThemeProvider>
    );

    // Check if Container has maxWidth="md"
    cy.get('.MuiContainer-root')
      .should('have.class', 'MuiContainer-maxWidthMd');
  });

  it('applies correct centering styles', () => {
    cy.viewport(1024, 500);  // Explicitly set viewport
    
    cy.mount(
      <ThemeProvider theme={theme}>
        <CentralPanel>
          <div>Test Content</div>
        </CentralPanel>
      </ThemeProvider>
    );

    // Check Box styling
    cy.get('.MuiBox-root')
      .should('have.css', 'display', 'flex')
      .and('have.css', 'justify-content', 'center')
      .and('have.css', 'align-items', 'center');
      
    // Instead of checking exact height, verify it's at least 100% of viewport
    cy.get('.MuiBox-root')
      .invoke('height')
      .should('be.at.least', 500);
  });

  it('properly nests CustomPaper inside Container', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <CentralPanel>
          <div>Test Content</div>
        </CentralPanel>
      </ThemeProvider>
    );

    // Check component hierarchy
    cy.get('.MuiBox-root')
      .within(() => {
        cy.get('.MuiContainer-root')
          .within(() => {
            cy.get('.MuiPaper-root').should('exist');
          });
      });
  });

  it('is responsive to different viewport sizes', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <CentralPanel>
          <div>Test Content</div>
        </CentralPanel>
      </ThemeProvider>
    );

    // Test mobile viewport
    cy.viewport(320, 568);
    cy.get('.MuiContainer-root').should('be.visible');

    // Test tablet viewport
    cy.viewport(768, 1024);
    cy.get('.MuiContainer-root').should('be.visible');

    // Test desktop viewport
    cy.viewport(1920, 1080);
    cy.get('.MuiContainer-root').should('be.visible');
  });
});