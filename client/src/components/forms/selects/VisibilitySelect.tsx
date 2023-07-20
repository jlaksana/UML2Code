import { Visibility } from '../../../types';
import GenericSelect, { GenericSelectProps } from './GenericSelect';

const visibilities: Visibility[] = ['+', '—', '#'];

function VisibilitySelect({
  option,
  setOption,
}: GenericSelectProps<Visibility>) {
  return (
    <GenericSelect
      option={option}
      setOption={setOption}
      options={visibilities}
      label="Visibility"
      width={60}
    />
  );
}

export default VisibilitySelect;
