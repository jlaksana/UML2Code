import { cleanup, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import ClassModal from '../components/forms/modals/ClassModal';

vi.mock('axios');

describe('ClassModal', () => {
  beforeEach(() => {
    vi.mock('../context/EntitiesContext', () => {
      return {
        useEntitiesDispatch: () => vi.fn(),
        useEntities: () => {
          return [
            { type: 'class', data: { name: 'Class 1' } },
            { type: 'class', data: { name: 'Class 2' } },
            { type: 'interface', data: { name: 'Interface 1' } },
            { type: 'interface', data: { name: 'Interface 2' } },
            { type: 'enum', data: { name: 'Enum 1' } },
            { type: 'enum', data: { name: 'Enum 2' } },
          ];
        },
      };
    });
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  test('renders correctly', () => {
    const { getByText, getByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
    );

    const title = getByText('Create Class');
    expect(title).toBeInTheDocument();

    const nameInput = getByLabelText('Class Name *');
    expect(nameInput).toBeInTheDocument();

    const abstractCheckbox = getByLabelText('Abstract');
    expect(abstractCheckbox).toBeInTheDocument();

    const constantsTab = getByText('Constants');
    expect(constantsTab).toBeInTheDocument();

    const attributesTab = getByText('Attributes');
    expect(attributesTab).toBeInTheDocument();

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
      <ClassModal open handleClose={handleCloseMock} />
    );

    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(handleCloseMock).toHaveBeenCalled();
  });

  test('deletes constants when delete button is clicked', () => {
    const { getByText, getAllByRole, getAllByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
    );

    const constantsTab = getByText('Constants');
    fireEvent.click(constantsTab);

    const addButton = getByText('Add');
    fireEvent.click(addButton);

    const nameInput = getAllByLabelText('Name *');
    fireEvent.change(nameInput[0], { target: { value: 'Constant 1' } });

    const typeInput = getAllByLabelText('Type *');
    fireEvent.mouseDown(typeInput[0]);
    const typeMenuItem = getByText('int');
    fireEvent.click(typeMenuItem);

    fireEvent.click(addButton);

    const deleteButtons = getAllByRole('button', { name: 'delete constant' });
    fireEvent.click(deleteButtons[0]);

    expect(getAllByLabelText('Name *')).toHaveLength(1);
    expect(getAllByLabelText('Type *')).toHaveLength(1);
  });

  test('deletes attributes when delete button is clicked', () => {
    const { getByText, getAllByRole, getAllByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
    );

    const attributesTab = getByText('Attributes');
    fireEvent.click(attributesTab);

    const addButton = getByText('Add');
    fireEvent.click(addButton);

    const nameInput = getAllByLabelText('Name *');
    fireEvent.change(nameInput[0], { target: { value: 'Attribute 1' } });

    const typeInput = getAllByLabelText('Type *');
    fireEvent.mouseDown(typeInput[0]);
    const typeMenuItem = getByText('int');
    fireEvent.click(typeMenuItem);

    fireEvent.click(addButton);

    const deleteButtons = getAllByRole('button', { name: 'delete attribute' });
    fireEvent.click(deleteButtons[0]);

    expect(getAllByLabelText('Name *')).toHaveLength(1);
    expect(getAllByLabelText('Type *')).toHaveLength(1);
  });

  test('deletes methods when delete button is clicked', () => {
    const { getByText, getAllByRole, getAllByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
    );

    const methodsTab = getByText('Methods');
    fireEvent.click(methodsTab);

    const addButton = getByText('Add');
    fireEvent.click(addButton);

    const nameInput = getAllByLabelText('Name *');
    fireEvent.change(nameInput[0], { target: { value: 'Method 1' } });

    const returnInput = getAllByLabelText('Returns *');
    fireEvent.mouseDown(returnInput[0]);
    const returnMenuItem = getByText('int');
    fireEvent.click(returnMenuItem);

    fireEvent.click(addButton);

    const deleteButtons = getAllByRole('button', { name: 'delete method' });
    fireEvent.click(deleteButtons[0]);

    expect(getAllByLabelText('Name *')).toHaveLength(1);
    expect(getAllByLabelText('Returns *')).toHaveLength(1);
  });
});
