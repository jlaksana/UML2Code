import { Visibility } from '../../types';
import GenericSelect, { GenericSelectProps } from './GenericSelect';

const visibilities: Visibility[] = ['+', '-', '#'];

function VisibilitySelect({
  option,
  setOption,
  error = false,
}: GenericSelectProps<Visibility>) {
  return (
    <GenericSelect
      option={option}
      setOption={setOption}
      options={visibilities}
      error={error}
      label=""
      width={60}
    />
  );
}

export default VisibilitySelect;
