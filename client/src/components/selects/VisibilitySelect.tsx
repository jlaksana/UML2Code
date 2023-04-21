import { Visibility } from '../../types';
import GenericSelect, { GenericSelectProps } from './GenericSelect';

function VisibilitySelect({
  option,
  setOption,
  error,
}: GenericSelectProps<Visibility>) {
  const visibilities: Visibility[] = ['+', '-', '#'];
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
