import { render, screen } from '@testing-library/react';
import Footer from '../../layout/Footer';

describe('Footer', () => {
  it('should render the footer with the correct content', () => {
    render(<Footer />);

    expect(screen.getByText(/©/i)).toBeInTheDocument();
    expect(screen.getByText('Fitness Tracker')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });
});