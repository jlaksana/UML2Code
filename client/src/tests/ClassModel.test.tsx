import { cleanup, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import ClassModal from '../components/forms/ClassModal';

describe('ClassModal', () => {
  afterEach(cleanup);

  test('renders correctly', () => {
    const { getByText, getByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
    );

    const title = getByText('Create Class');
    expect(title).toBeInTheDocument();

    const nameInput = getByLabelText('Class Name');
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

  test('calls handleClose and creates class when OK button is clicked', () => {
    const handleCloseMock = vi.fn();
    const { getByText } = render(
      <ClassModal open handleClose={handleCloseMock} />
    );

    const OKButton = getByText('OK');
    fireEvent.click(OKButton);
    // TODO: test that class is created

    expect(handleCloseMock).toHaveBeenCalled();
  });

  // TODO: uncomment these tests when backend is implemented
  // test('shows error message when name is not specified', () => {
  //   const { getByText } = render(<ClassModal open handleClose={() => {}} />);

  //   const OKButton = getByText('OK');
  //   fireEvent.click(OKButton);

  //   const errorMessage = getByText('No field can be empty');
  //   expect(errorMessage).toBeInTheDocument();
  // });

  // test('shows error message when name is not unique', () => {
  //   const { getByText, getByLabelText } = render(
  //     <ClassModal open handleClose={() => {}} />
  //   );

  //   const nameInput = getByLabelText('Class Name');
  //   fireEvent.change(nameInput, { target: { value: 'Class 1' } });

  //   const OKButton = getByText('OK');
  //   fireEvent.click(OKButton);

  //   const errorMessage = getByText('Name must be unique');
  //   expect(errorMessage).toBeInTheDocument();
  // });

  test('adds constants when add button is clicked', () => {
    const { getByText, getAllByText, getAllByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
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

  test('deletes constants when delete button is clicked', () => {
    const { getByText, getAllByRole, getAllByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
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

    const deleteButtons = getAllByRole('button', { name: 'delete constant' });
    fireEvent.click(deleteButtons[0]);

    expect(getAllByLabelText('Name')).toHaveLength(1);
    expect(getAllByLabelText('Type')).toHaveLength(1);
  });

  test('adds attributes when add button is clicked', () => {
    const { getByText, getAllByText, getAllByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
    );

    const attributesTab = getByText('Attributes');
    fireEvent.click(attributesTab);

    const addButton = getByText('Add');
    fireEvent.click(addButton);

    const nameInput = getAllByLabelText('Name');
    fireEvent.change(nameInput[0], { target: { value: 'Attribute 1' } });

    const typeInput = getAllByLabelText('Type');
    fireEvent.mouseDown(typeInput[0]);
    const typeMenuItem = getByText('int');
    fireEvent.click(typeMenuItem);

    const visibilityInput = getAllByLabelText('Visibility');
    fireEvent.mouseDown(visibilityInput[0]);
    const visibilityMenuItem = getByText('+');
    fireEvent.click(visibilityMenuItem);

    fireEvent.click(addButton);

    const nameInput2 = getAllByLabelText('Name');
    fireEvent.change(nameInput2[1], { target: { value: 'Attribute 2' } });

    const typeInput2 = getAllByLabelText('Type');
    fireEvent.mouseDown(typeInput2[1]);
    const typeMenuItem2 = getAllByText('string');
    fireEvent.click(typeMenuItem2[1]);

    expect(nameInput2).toHaveLength(2);
  });

  test('deletes attributes when delete button is clicked', () => {
    const { getByText, getAllByRole, getAllByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
    );

    const attributesTab = getByText('Attributes');
    fireEvent.click(attributesTab);

    const addButton = getByText('Add');
    fireEvent.click(addButton);

    const nameInput = getAllByLabelText('Name');
    fireEvent.change(nameInput[0], { target: { value: 'Attribute 1' } });

    const typeInput = getAllByLabelText('Type');
    fireEvent.mouseDown(typeInput[0]);
    const typeMenuItem = getByText('int');
    fireEvent.click(typeMenuItem);

    fireEvent.click(addButton);

    const deleteButtons = getAllByRole('button', { name: 'delete attribute' });
    fireEvent.click(deleteButtons[0]);

    expect(getAllByLabelText('Name')).toHaveLength(1);
    expect(getAllByLabelText('Type')).toHaveLength(1);
  });

  test('adds methods when add button is clicked', () => {
    const { getByText, getAllByText, getAllByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
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

  test('deletes methods when delete button is clicked', () => {
    const { getByText, getAllByRole, getAllByLabelText } = render(
      <ClassModal open handleClose={() => {}} />
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

    fireEvent.click(addButton);

    const deleteButtons = getAllByRole('button', { name: 'delete method' });
    fireEvent.click(deleteButtons[0]);

    expect(getAllByLabelText('Name')).toHaveLength(1);
    expect(getAllByLabelText('Returns')).toHaveLength(1);
  });
});
