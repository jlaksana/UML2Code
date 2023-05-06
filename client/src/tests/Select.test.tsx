import { cleanup, fireEvent, render } from '@testing-library/react';
import { vi } from 'vitest';
import GenericSelect from '../components/forms/selects/GenericSelect';
import GroupSelect from '../components/forms/selects/GroupSelect';
import TypeSelect from '../components/forms/selects/TypeSelect';
import VisibilitySelect from '../components/forms/selects/VisibilitySelect';

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
        option=""
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
});

describe('VisibilitySelect', () => {
  afterEach(cleanup);

  const visibilities = ['+', '—', '#'];

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

describe('GroupSelect', () => {
  afterEach(cleanup);

  it('should render without errors', () => {
    const { getAllByText } = render(
      <GroupSelect
        option=""
        setOption={() => {}}
        error={false}
        label="Test Label"
      />
    );
    const label = getAllByText('Test Label');
    expect(label[0]).toBeInTheDocument();
  });

  it('should display error message when error prop is true and option is not set', () => {
    const { getByText } = render(
      <GroupSelect option="" setOption={() => {}} error label="Test Label" />
    );
    const errorText = getByText('Required *');
    expect(errorText).toBeInTheDocument();
  });

  it('should display correct options when includePrimitives prop is true', () => {
    const types = ['int', 'float', 'double', 'char', 'boolean', 'string'];

    const { getByText, getByRole } = render(
      <GroupSelect
        option=""
        setOption={() => {}}
        error={false}
        label="Test Label"
        includePrimitives
      />
    );

    const select = getByRole('button');
    fireEvent.mouseDown(select);

    const label = getByText('Primitives');
    expect(label).toBeInTheDocument();

    types.forEach((type) => {
      const menuItem = getByRole('option', { name: type });
      expect(menuItem).toBeInTheDocument();
    });
  });

  it('should display correct options when includeClasses prop is true', () => {
    const { getByText, getByRole } = render(
      <GroupSelect
        option=""
        setOption={() => {}}
        error={false}
        label="Test Label"
        includeClasses
      />
    );
    const select = getByRole('button');
    fireEvent.mouseDown(select);

    const label = getByText('Classes');
    expect(label).toBeInTheDocument();
  });

  it('should display correct options when includeInterfaces prop is true', () => {
    const { getByText, getByRole } = render(
      <GroupSelect
        option=""
        setOption={() => {}}
        error={false}
        label="Test Label"
        includeInterfaces
      />
    );
    const select = getByRole('button');
    fireEvent.mouseDown(select);

    const label = getByText('Interfaces');
    expect(label).toBeInTheDocument();
  });

  it('should display correct options when includeEnums prop is true', () => {
    const { getByText, getByRole } = render(
      <GroupSelect
        option=""
        setOption={() => {}}
        error={false}
        label="Test Label"
        includeEnums
      />
    );
    const select = getByRole('button');
    fireEvent.mouseDown(select);

    const label = getByText('Enums');
    expect(label).toBeInTheDocument();
  });

  it('should call setOption with selected value when an option is selected', () => {
    const setOptionMock = vi.fn();
    const { getByText, getByRole } = render(
      <GroupSelect
        option=""
        setOption={setOptionMock}
        error={false}
        label="Test Label"
        includePrimitives
      />
    );
    const select = getByRole('button');
    fireEvent.mouseDown(select);

    const menuItem = getByText('int');
    fireEvent.click(menuItem);

    expect(setOptionMock).toHaveBeenCalledWith('int');
  });
});
