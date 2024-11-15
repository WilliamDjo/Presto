import ThumbnailUpload from '../../src/Components/ThumbnailUpload';
import { mount } from 'cypress/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

describe('ThumbnailUpload Component', () => {
  const theme = createTheme();
  
  const mountComponent = (props = {}) => {
    return mount(
      <ThemeProvider theme={theme}>
        <ThumbnailUpload
          thumbnail=""
          resetThumbnail={cy.stub().as('resetThumbnail')}
          onThumbnailChange={cy.stub().as('onThumbnailChange')}
          {...props}
        />
      </ThemeProvider>
    );
  };

  it('renders default state correctly', () => {
    mountComponent();

    cy.contains('Thumbnail').should('exist');
    cy.get('[data-testid="thumbnail-upload-input"]')
      .should('exist')
      .and('not.be.visible');
    cy.get('[data-testid="thumbnail-upload"]')
      .should('exist')
      .find('svg')
      .should('exist');
    cy.contains('Click to add thumbnail').should('exist');
    cy.get('button').contains('Reset').should('exist');
  });

  it('renders uploaded thumbnail correctly', () => {
    const thumbnailUrl = 'https://example.com/test-image.jpg';
    mountComponent({ thumbnail: thumbnailUrl });

    cy.get('img[title="Presentation thumbnail"]')
      .should('exist')
      .and('have.attr', 'src', thumbnailUrl);
    
    cy.contains('Click to add thumbnail').should('not.exist');
  });

  it('handles file upload correctly', () => {
    mountComponent();

    // Create a test file
    const fileName = 'test-image.jpg';
    
    // Get the actual input element and attach file
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName,
      mimeType: 'image/jpeg',
    }, { force: true });

    // Check if onThumbnailChange was called
    cy.get('@onThumbnailChange').should('have.been.called');
  });

  it('handles reset button click', () => {
    mountComponent();

    cy.get('button').contains('Reset').click();
    cy.get('@resetThumbnail').should('have.been.calledOnce');
  });

  it('handles card click to trigger file upload', () => {
    mountComponent();

    cy.get('[data-testid="thumbnail-upload"]').click();
    cy.get('[data-testid="thumbnail-upload-input"]').should('exist');
  });

  it('applies correct styles and dimensions', () => {
    mountComponent();

    cy.get('.MuiCard-root')
      .should('have.css', 'max-width', '345px');

    cy.get('.MuiCardMedia-root')
      .should('have.css', 'height', '194px');
  });

  it('only accepts image files', () => {
    mountComponent();

    cy.get('[data-testid="thumbnail-upload-input"]')
      .should('have.attr', 'accept', 'image/*');
  });
});