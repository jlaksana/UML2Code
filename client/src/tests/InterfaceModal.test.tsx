import { cleanup, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import InterfaceModal from '../components/forms/modals/InterfaceModal';

vi.mock('axios');

describe('InterfaceModal', () => {
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
      <InterfaceModal open handleClose={() => {}} />
    );

    const title = getByText('Create Interface');
    expect(title).toBeInTheDocument();

    const nameInput = getByLabelText('Interface Name *');
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
});
