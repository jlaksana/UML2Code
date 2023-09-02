import { RelationshipType } from '../../../types';
import {
  getSourceLabel,
  getSourcePermittedEntities,
  getTargetLabel,
  getTargetPermittedEntities,
} from '../modals/utils';
import GroupSelect from '../selects/GroupSelect';

type ShortRelationshipInputProps = {
  type: RelationshipType;
  source: string;
  setSource: (source: string) => void;
  target: string;
  setTarget: (target: string) => void;
};

function ShortRelationshipInput({
  type,
  source,
  setSource,
  target,
  setTarget,
}: ShortRelationshipInputProps) {
  const sourcePermittedEntities = getSourcePermittedEntities(type);
  const targetPermittedEntities = getTargetPermittedEntities(type);

  return (
    <div className="short-relationship-input">
      <GroupSelect
        option={source}
        setOption={setSource}
        label={getSourceLabel(type)}
        width={190}
        includeClasses={sourcePermittedEntities.includes('class')}
        includeInterfaces={sourcePermittedEntities.includes('interface')}
        includeEnums={sourcePermittedEntities.includes('enum')}
        restrictOptions
      />
      <GroupSelect
        option={target}
        setOption={setTarget}
        label={getTargetLabel(type)}
        width={190}
        includeClasses={targetPermittedEntities.includes('class')}
        includeInterfaces={targetPermittedEntities.includes('interface')}
        includeEnums={targetPermittedEntities.includes('enum')}
        restrictOptions
      />
    </div>
  );
}

export default ShortRelationshipInput;
