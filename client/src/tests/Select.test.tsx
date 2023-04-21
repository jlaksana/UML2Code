import { cleanup, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import GenericSelect from '../components/selects/GenericSelect';
import TypeSelect from '../components/selects/TypeSelect';
import VisibilitySelect from '../components/selects/VisibilitySelect';

describe('GenericSelect', () => {
  const options = ['Option 1', 'Option 2', 'Option 3'];

  afterEach(cleanup);

  test('renders label and options correctly', () => {
    const { getByRole, getByText, getAllByText } = render(
      <GenericSelect
        option=""
        setOption={() => {}}
        options={options}
        label="Select an option"
        error={false}
      />
    );

    const label = getAllByText('Select an option');
    expect(label[0]).toBeInTheDocument();

    const select = getByRole('button');
    fireEvent.mouseDown(select);

    options.forEach((option) => {
      if (option) {
        const menuItem = getByText(option);
        expect(menuItem).toBeInTheDocument();
      }
    });
  });

  test('calls setOption when an option is selected', () => {
    const setOptionMock = vi.fn();
    const { getByRole, getByText } = render(
      <GenericSelect
        option={options[0]}
        setOption={setOptionMock}
        options={options}
        label="Select an option"
        error={false}
      />
    );

    const select = getByRole('button');

    fireEvent.mouseDown(select);
    const menuItem = getByText(options[1]);
    fireEvent.click(menuItem);

    expect(setOptionMock).toHaveBeenCalledWith(options[1]);
  });

  test('shows error message when option is not selected', () => {
    const { getByText } = render(
      <GenericSelect
        option={null}
        setOption={() => {}}
        options={options}
        label="Select an option"
        error
      />
    );

    const errorMessage = getByText('Required *');
    expect(errorMessage).toBeInTheDocument();
  });

  test('does not show error message when option is selected', () => {
    const { queryByText } = render(
      <GenericSelect
        option={options[0]}
        setOption={() => {}}
        options={options}
        label="Select an option"
        error
      />
    );

    const errorMessage = queryByText('Required *');
    expect(errorMessage).not.toBeInTheDocument();
  });
});

describe('TypeSelect', () => {
  afterEach(cleanup);

  const types = ['int', 'float', 'double', 'char', 'boolean', 'string'];

  test('renders correctly', () => {
    const { getAllByText, getByRole } = render(
      <TypeSelect option="int" setOption={() => {}} error={false} />
    );

    const label = getAllByText('Type');
    expect(label[0]).toBeInTheDocument();

    const select = getByRole('button');
    fireEvent.mouseDown(select);

    types.forEach((type) => {
      const menuItem = getByRole('option', { name: type });
      expect(menuItem).toBeInTheDocument();
    });
  });

  test('renders void option when forMethod is true', () => {
    const { getByText, getByRole } = render(
      <TypeSelect option="int" setOption={() => {}} error={false} forMethod />
    );

    const select = getByRole('button');
    fireEvent.mouseDown(select);

    const voidOption = getByText('void');
    expect(voidOption).toBeInTheDocument();
  });

  test('does not render void option when forMethod is false', () => {
    const { queryByText, getByRole } = render(
      <TypeSelect option="int" setOption={() => {}} error={false} />
    );

    const select = getByRole('button');
    fireEvent.mouseDown(select);

    const voidOption = queryByText('void');
    expect(voidOption).not.toBeInTheDocument();
  });
});

describe('VisibilitySelect', () => {
  afterEach(cleanup);

  const visibilities = ['+', '-', '#'];

  test('renders correctly', () => {
    const { getAllByText, getByRole } = render(
      <VisibilitySelect option="+" setOption={() => {}} error={false} />
    );

    const select = getByRole('button');
    fireEvent.mouseDown(select);

    visibilities.forEach((visibility) => {
      const menuItem = getAllByText(visibility);
      expect(menuItem[0]).toBeInTheDocument();
    });
  });
});
