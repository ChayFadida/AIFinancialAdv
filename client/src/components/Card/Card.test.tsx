import { render, screen } from '@testing-library/react';
import { Card } from './Card';
import { Theme } from '@mui/material';

describe('Card Component', () => {
  it('renders title and children correctly', () => {
    const title = 'Test Title';
    const childContent = 'Test Content';

    render(
      <Card title={title}>
        <div>{childContent}</div>
      </Card>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(childContent)).toBeInTheDocument();
  });

  it('renders with custom styles through sx prop', () => {
    const customStyles = {
      backgroundColor: 'red',
      width: '500px',
    };

    const { container } = render(
      <Card title="Test" sx={customStyles}>
        <div>Content</div>
      </Card>
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveStyle({
      backgroundColor: 'red',
      width: '500px',
    });
  });

  it('renders with ReactNode title', () => {
    const titleNode = (
      <div data-testid="custom-title">
        <span>Complex</span>
        <span>Title</span>
      </div>
    );

    render(
      <Card title={titleNode}>
        <div>Content</div>
      </Card>
    );

    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('renders multiple children correctly', () => {
    render(
      <Card title="Test">
        <div>First Child</div>
        <div>Second Child</div>
        <div>Third Child</div>
      </Card>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
  });

  it('renders with minimum width of 200px', () => {
    const { container } = render(
      <Card title="Test">
        <div>Content</div>
      </Card>
    );

    const cardElement = container.firstChild as HTMLElement;
    expect(cardElement).toHaveStyle({
      minWidth: '200px',
    });
  });
});
