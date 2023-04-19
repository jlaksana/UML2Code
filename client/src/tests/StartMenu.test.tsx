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
    const { getByLabelText, getByText, getByAltText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const input = getByLabelText('Diagram ID');
    const goButton = getByText('Go');

    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.click(goButton);

    await waitFor(() => {
      expect(getByText('ID: 1234')).toBeInTheDocument();
    });

    const homeButton = getByAltText('logo');
    fireEvent.click(homeButton);
  });

  it('click create new and redirects to editor', async () => {
    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const createButton = getByText('Create New');

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(getByText('ID: 1234')).toBeInTheDocument();
    });
  });
});
