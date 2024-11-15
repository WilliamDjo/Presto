import BackButton from '../../src/Components/BackButton'; 
import { mount } from 'cypress/react';

describe('BackButton Component', () => {
  it('renders correctly with default props', () => {
    mount(<BackButton onClick={cy.stub().as('onClick')} />);
    
    // Check if button exists
    cy.get('button').should('exist');
    
    // Check if ArrowBackIosNew icon exists
    cy.get('svg').should('exist');
    
    // Check title attribute
    cy.get('button').should('have.attr', 'title', 'Go back');
  });

  it('handles click events', () => {
    const onClickStub = cy.stub().as('onClick');
    mount(<BackButton onClick={onClickStub} />);
    
    cy.get('button').click();
    cy.get('@onClick').should('have.been.calledOnce');
  });

  it('applies custom color prop', () => {
    mount(<BackButton onClick={cy.stub()} color="primary" />);
    
    // Check for MUI's color class
    cy.get('button').should('have.class', 'MuiIconButton-colorPrimary');
  
  });

  it('applies custom styles through sx prop', () => {
    const customSx = {
      backgroundColor: 'rgb(0, 0, 255)',
      padding: '16px'
    };
    
    mount(<BackButton onClick={cy.stub()} sx={customSx} />);
    
    cy.get('button')
      .should('have.css', 'background-color', 'rgb(0, 0, 255)')
      .and('have.css', 'padding', '16px');
  });

  it('shows hover state correctly', () => {
    mount(<BackButton onClick={cy.stub()} />);
    
    // Using trigger instead of realHover
    cy.get('button')
      .trigger('mouseover')
      .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)');
  });
});