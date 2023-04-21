import { cleanup, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import GenericSelect from '../components/selects/GenericSelect';

describe('GenericSelect', () => {
  const options = ['Option 1', 'Option 2', 'Option 3'];

  afterEach(cleanup);

  test('renders label and options correctly', () => {
    const { getByRole, getByText } = render(
      <GenericSelect
        option=""
        setOption={() => {}}
        options={options}
        label="Select an option"
        error={false}
      />
    );

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
});
