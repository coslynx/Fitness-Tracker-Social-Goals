import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../common/Modal';

describe('Modal', () => {
  it('should render a modal with the correct content', () => {
    const modalContent = 'This is the modal content';
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>{modalContent}</div>
      </Modal>,
    );
    const modalElement = screen.getByText(modalContent);
    expect(modalElement).toBeInTheDocument();
  });

  it('should open and close the modal', () => {
    const { container, rerender } = render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(container.querySelector('.modal-container')).not.toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>,
    );

    expect(container.querySelector('.modal-container')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

    expect(container.querySelector('.modal-container')).not.toBeInTheDocument();
  });
});