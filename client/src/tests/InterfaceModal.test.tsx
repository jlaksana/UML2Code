import { cleanup, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import InterfaceModal from '../components/forms/InterfaceModal';

vi.mock('axios');

describe('InterfaceModal', () => {
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
      <InterfaceModal open handleClose={() => {}} />
    );

    const title = getByText('Create Interface');
    expect(title).toBeInTheDocument();

    const nameInput = getByLabelText('Interface Name');
    expect(nameInput).toBeInTheDocument();

    const constantsTab = getByText('Constants');
    expect(constantsTab).toBeInTheDocument();

    const methodsTab = getByText('Methods');
    expect(methodsTab).toBeInTheDocument();

    const cancelButton = getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const OKButton = getByText('OK');
    expect(OKButton).toBeInTheDocument();
  });

  test('calls handleClose when cancel button is clicked', () => {
    const handleCloseMock = vi.fn();
    const { getByText } = render(
      <InterfaceModal open handleClose={handleCloseMock} />
    );

    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  test('shows error when name is empty', () => {
    const { getByText } = render(
      <InterfaceModal open handleClose={() => {}} />
    );

    const OKButton = getByText('OK');
    fireEvent.click(OKButton);

    const error = getByText('No fields can be empty');
    expect(error).toBeInTheDocument();
  });

  test('adds constants when add button is clicked', () => {
    const { getByText, getAllByText, getAllByLabelText } = render(
      <InterfaceModal open handleClose={() => {}} />
    );

    const constantsTab = getByText('Constants');
    fireEvent.click(constantsTab);

    const addButton = getByText('Add');
    fireEvent.click(addButton);

    const nameInput = getAllByLabelText('Name');
    fireEvent.change(nameInput[0], { target: { value: 'Constant 1' } });

    const typeInput = getAllByLabelText('Type');
    fireEvent.mouseDown(typeInput[0]);
    const typeMenuItem = getByText('int');
    fireEvent.click(typeMenuItem);

    fireEvent.click(addButton);

    const nameInput2 = getAllByLabelText('Name');
    fireEvent.change(nameInput2[1], { target: { value: 'Constant 2' } });

    const typeInput2 = getAllByLabelText('Type');
    fireEvent.mouseDown(typeInput2[1]);
    const typeMenuItem2 = getAllByText('string');
    fireEvent.click(typeMenuItem2[1]);

    expect(nameInput2).toHaveLength(2);
  });

  test('adds methods when add button is clicked', () => {
    const { getByText, getAllByText, getAllByLabelText } = render(
      <InterfaceModal open handleClose={() => {}} />
    );

    const methodsTab = getByText('Methods');
    fireEvent.click(methodsTab);

    const addButton = getByText('Add');
    fireEvent.click(addButton);

    const nameInput = getAllByLabelText('Name');
    fireEvent.change(nameInput[0], { target: { value: 'Method 1' } });

    const returnInput = getAllByLabelText('Returns');
    fireEvent.mouseDown(returnInput[0]);
    const returnMenuItem = getByText('int');
    fireEvent.click(returnMenuItem);

    const visibilityInput = getAllByLabelText('Visibility');
    fireEvent.mouseDown(visibilityInput[0]);
    const visibilityMenuItem = getByText('#');
    fireEvent.click(visibilityMenuItem);

    const staticCheckbox = getAllByLabelText('Static');
    fireEvent.click(staticCheckbox[0]);

    fireEvent.click(addButton);

    const nameInput2 = getAllByLabelText('Name');
    fireEvent.change(nameInput2[1], { target: { value: 'Method 2' } });

    const returnInput2 = getAllByLabelText('Returns');
    fireEvent.mouseDown(returnInput2[1]);
    const returnMenuItem2 = getAllByText('string');
    fireEvent.click(returnMenuItem2[1]);

    expect(nameInput2).toHaveLength(2);
  });
});
