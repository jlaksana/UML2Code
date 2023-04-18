/* eslint-disable react/jsx-no-undef */
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('StartMenu', () => {
  afterEach(cleanup);

  it('displays error text when an invalid ID is entered', async () => {
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const input = getByLabelText('Diagram ID');
    const goButton = getByText('Go');

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(goButton);

    await waitFor(() => {
      expect(getByText('Invalid ID')).toBeInTheDocument();
    });
  });

  it('redirects to a valid diagram', async () => {
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const input = getByLabelText('Diagram ID');
    const goButton = getByText('Go');

    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.click(goButton);

    await waitFor(() => {
      expect(getByText('Editor page')).toBeInTheDocument();
    });
  });
});
