import { cleanup, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import EnumModal from '../components/forms/modals/EnumModal';

vi.mock('axios');

describe('EnumModal', () => {
  beforeEach(() => {
    vi.mock('../context/EntitiesContext', () => {
      return {
        useEntitiesDispatch: () => vi.fn(),
      };
    });
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  test('renders correctly', () => {
    const { getByText, getByLabelText } = render(
      <EnumModal open handleClose={() => {}} />
    );

    const title = getByText('Create Enumeration');
    expect(title).toBeInTheDocument();

    const nameInput = getByLabelText('Enum Name *');
    expect(nameInput).toBeInTheDocument();

    const valuesTab = getByText('Values');
    expect(valuesTab).toBeInTheDocument();

    const cancelButton = getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const OKButton = getByText('OK');
    expect(OKButton).toBeInTheDocument();
  });

  test('calls handleClose when cancel button is clicked', () => {
    const handleCloseMock = vi.fn();
    const { getByText } = render(
      <EnumModal open handleClose={handleCloseMock} />
    );

    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(handleCloseMock).toHaveBeenCalled();
  });

  test('adds values when add button is clicked', () => {
    const { getByText, getByLabelText } = render(
      <EnumModal open handleClose={() => {}} />
    );

    const addButton = getByText('Add');
    fireEvent.click(addButton);

    const valueInput = getByLabelText('Values');
    expect(valueInput).toBeInTheDocument();

    const nameInput = getByLabelText('Name *');
    fireEvent.change(nameInput, { target: { value: 'Value 1' } });
  });

  test('removes values when remove button is clicked', () => {
    const { getByText, getByLabelText, getAllByRole, getAllByLabelText } =
      render(<EnumModal open handleClose={() => {}} />);

    const addButton = getByText('Add');
    fireEvent.click(addButton);

    const valueInput = getByLabelText('Values');
    expect(valueInput).toBeInTheDocument();

    const nameInput = getByLabelText('Name *');
    fireEvent.change(nameInput, { target: { value: 'Value 1' } });

    fireEvent.click(addButton);

    const removeButton = getAllByRole('button', { name: 'delete value' });
    fireEvent.click(removeButton[0]);

    expect(getAllByLabelText('Name *')).toHaveLength(1);
  });
});
