import { cleanup, fireEvent, render } from '@testing-library/react';
import VisibilitySelect from '../components/forms/selects/VisibilitySelect';

describe('VisibilitySelect', () => {
  afterEach(cleanup);

  const visibilities = ['+', '—', '#'];

  test('renders correctly', () => {
    const { getAllByText, getByRole } = render(
      <VisibilitySelect option="+" setOption={() => {}} />
    );

    const select = getByRole('button');
    fireEvent.mouseDown(select);

    visibilities.forEach((visibility) => {
      const menuItem = getAllByText(visibility);
      expect(menuItem[0]).toBeInTheDocument();
    });
  });
});
