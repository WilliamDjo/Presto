import ThumbnailDisplay from '../../src/Components/ThumbnailDisplay';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material';

describe('ThumbnailDisplay Component', () => {
  const theme = createTheme();
  const sampleImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExIVFRUVFhUXGBgYFxUVFhcYFRUXGBUVFRYYHSggGBolHRcWITEiJSkrMC4uFyAzODMtNygtLisBCgoKDg0OGhAQGS0lHyUtLS0tLS8tKzctLSstLS0tLS0tLS0rLS0tLS0wLS0tLS8vLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAAIDBQYBBwj/xABGEAABAwIDBAgDBAgEBAcAAAABAAIRAyEEEjEFQVFhBhMiMnGBkaGxwfBCUnLRBxQjYoKS4fEzorLCFjRTcxUkRIOTo9L/xAAaAQACAwEBAAAAAAAAAAAAAAAAAwECBAUG/8QAMhEAAgIBAwEFBQgDAQAAAAAAAAECAxEEITESBRNBUWEiMnGx8BRCgZGhwdHhM1JiNP/aAAwDAQACEQMRAD8A'; // truncated for brevity
  
  beforeEach(() => {
    cy.viewport(500, 500);
  });

  it('renders default icon when no thumbnail is provided', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <ThumbnailDisplay />
      </ThemeProvider>
    );

    cy.get('svg.MuiSvgIcon-root')
      .should('exist')
      .and('have.css', 'width', '40px')
      .and('have.css', 'height', '40px')
      .and('have.css', 'color', 'rgb(255, 255, 255)');
  });

  it('renders default icon with custom size', () => {
    const customSize = 60;
    
    cy.mount(
      <ThemeProvider theme={theme}>
        <ThumbnailDisplay size={customSize} />
      </ThemeProvider>
    );

    cy.get('svg.MuiSvgIcon-root')
      .should('exist')
      .and('have.css', 'width', `${customSize}px`)
      .and('have.css', 'height', `${customSize}px`);
  });

  it('renders thumbnail image when provided', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <ThumbnailDisplay thumbnail={sampleImage} />
      </ThemeProvider>
    );

    // Wait for image to load
    cy.get('img').should('exist').and('be.visible')
      .should('have.attr', 'src', sampleImage)
      .and('have.css', 'width', '40px')
      .and('have.css', 'height', '40px')
      .and('have.css', 'object-fit', 'cover');
  });

  it('renders thumbnail image with custom size', () => {
    const customSize = 60;
    
    cy.mount(
      <ThemeProvider theme={theme}>
        <ThumbnailDisplay thumbnail={sampleImage} size={customSize} />
      </ThemeProvider>
    );

    cy.get('img')
      .should('exist')
      .should('have.attr', 'src', sampleImage)
      .and('have.css', 'width', `${customSize}px`)
      .and('have.css', 'height', `${customSize}px`);
  });

  it('applies correct border radius to thumbnail image', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <ThumbnailDisplay thumbnail={sampleImage} />
      </ThemeProvider>
    );

    cy.get('img')
      .should('have.css', 'border-radius', '4px');
  });

  it('handles undefined thumbnail prop', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <ThumbnailDisplay thumbnail={undefined} />
      </ThemeProvider>
    );

    cy.get('svg.MuiSvgIcon-root').should('exist');
    cy.get('img').should('not.exist');
  });

  it('handles null thumbnail prop', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <ThumbnailDisplay thumbnail={null} />
      </ThemeProvider>
    );

    cy.get('svg.MuiSvgIcon-root').should('exist');
    cy.get('img').should('not.exist');
  });

  it('handles empty string thumbnail prop', () => {
    cy.mount(
      <ThemeProvider theme={theme}>
        <ThumbnailDisplay thumbnail="" />
      </ThemeProvider>
    );

    cy.get('svg.MuiSvgIcon-root').should('exist');
    cy.get('img').should('not.exist');
  });
});