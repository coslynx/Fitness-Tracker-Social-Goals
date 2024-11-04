import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../common/Button';

describe('Button', () => {
  it('should render a button with the correct text', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByText('Click Me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('should have the correct styling for the primary variant', () => {
    render(<Button variant="primary">Primary Button</Button>);
    const buttonElement = screen.getByText('Primary Button');
    expect(buttonElement).toHaveClass('bg-brand-primary text-white hover:bg-brand-primary-dark');
  });

  it('should have the correct styling for the secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const buttonElement = screen.getByText('Secondary Button');
    expect(buttonElement).toHaveClass('bg-brand-secondary text-white hover:bg-brand-secondary-dark');
  });

  it('should have the correct styling for the outline variant', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const buttonElement = screen.getByText('Outline Button');
    expect(buttonElement).toHaveClass('text-brand-primary border border-brand-primary hover:bg-brand-primary-light');
  });

  it('should call the onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByText('Click Me');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByText('Disabled Button');
    expect(buttonElement).toBeDisabled();
  });
});