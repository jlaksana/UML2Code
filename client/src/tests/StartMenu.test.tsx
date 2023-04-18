import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StartMenu from '../components/StartMenu';

describe('StartMenu', () => {
  it('displays error text when an invalid ID is entered', async () => {
    const { getByLabelText, getByText } = render(<StartMenu />);
    const input = getByLabelText('Diagram ID');
    const goButton = getByText('Go');

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(goButton);

    await waitFor(() => {
      expect(getByText('Invalid ID')).toBeInTheDocument();
    });
  });

  // it('calls the handleGo function with the correct ID', async () => {
  //   const { getByLabelText, getByText } = render(<StartMenu />);
  //   const input = getByLabelText('Diagram ID');
  //   const goButton = getByText('Go');
  //   const mockHandleGo = vi.fn();
  //   const spy = vi.spyOn({}, 'getLatest');

  //   fireEvent.change(input, { target: { value: '1234' } });
  //   fireEvent.click(goButton);

  //   await waitFor(() => {
  //     expect(mockHandleGo).toHaveBeenCalled();
  //   });
  // });

  // it('calls the handleCreate function when the Create New button is clicked', async () => {
  //   const { getByText } = render(<StartMenu />);
  //   const createButton = getByText('Create New');
  //   const mockHandleCreate = vi.fn();

  //   fireEvent.click(createButton);

  //   await waitFor(() => {
  //     expect(mockHandleCreate).toHaveBeenCalled();
  //   });
  // });
});
