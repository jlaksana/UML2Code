/* eslint-disable react/jsx-no-undef */
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { Mock, describe, expect, it, vi } from 'vitest';
import App from '../App';
import NotFound from '../components/NotFound';

// mock ResizeObserver to get around vitest not supporting it
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.mock('axios');

describe('StartMenu', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('displays error text when an invalid ID is entered', async () => {
    (axios.get as Mock).mockRejectedValue({
      response: { data: { message: 'Invalid Diagram id' } },
    });

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
      expect(getByText('Invalid Diagram id')).toBeInTheDocument();
    });
  });

  it('redirects to a valid diagram', async () => {
    (axios.get as Mock).mockResolvedValue({ data: { id: '1234' } });

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
    (axios.post as Mock).mockResolvedValue({ data: { id: '1234' } });

    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const createButton = getByText('Create New');

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(getByText(/ID: 1234/i)).toBeInTheDocument();
    });
  });
});

describe('NotFound', () => {
  afterEach(cleanup);

  test('renders the 404 error message', () => {
    const { getByText } = render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    const errorMessage = getByText(/404 Not Found/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
