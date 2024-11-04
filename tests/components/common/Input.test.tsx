import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../common/Input';
import React from 'react'; 
import ReactDOM from 'react-dom/client'; 

describe('Input', () => {
  it('should render an input element with the correct ID', () => {
    render(<Input id="test-input" />);
    const inputElement = screen.getByRole('textbox', { name: 'test-input' });
    expect(inputElement).toBeInTheDocument();
  });

  it('should render an input element with the correct type', () => {
    render(<Input id="test-input" type="email" />);
    const inputElement = screen.getByRole('textbox', { name: 'test-input' });
    expect(inputElement).toHaveAttribute('type', 'email');
  });

  it('should render an input element with the correct placeholder', () => {
    render(<Input id="test-input" placeholder="Enter your email" />);
    const inputElement = screen.getByRole('textbox', { name: 'test-input' });
    expect(inputElement).toHaveAttribute('placeholder', 'Enter your email');
  });

  it('should update the value when the input changes', () => {
    render(<Input id="test-input" />);
    const inputElement = screen.getByRole('textbox', { name: 'test-input' });
    fireEvent.change(inputElement, { target: { value: 'test@example.com' } });
    expect(inputElement).toHaveValue('test@example.com');
  });

  it('should call the onChange handler when the input changes', () => {
    const handleChange = jest.fn();
    render(<Input id="test-input" onChange={handleChange} />);
    const inputElement = screen.getByRole('textbox', { name: 'test-input' });
    fireEvent.change(inputElement, { target: { value: 'test@example.com' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('should render an input element with the correct className', () => {
    render(<Input id="test-input" className="custom-class" />);
    const inputElement = screen.getByRole('textbox', { name: 'test-input' });
    expect(inputElement).toHaveClass('custom-class');
  });
});