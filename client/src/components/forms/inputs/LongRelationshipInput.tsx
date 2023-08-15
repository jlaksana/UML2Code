import { TextField } from '@mui/material';
import { RelationshipType } from '../../../types';
import {
  getSourcePermittedEntities,
  getTargetPermittedEntities,
  umlMultiplicityRegex,
} from '../modals/utils';
import GroupSelect from '../selects/GroupSelect';

type LongRelationshipInputProps = {
  type: RelationshipType;
  source: string;
  setSource: (source: string) => void;
  target: string;
  setTarget: (target: string) => void;
  srcInfo: { label: string; multiplicity: string };
  setSrcInfo: (srcInfo: { label: string; multiplicity: string }) => void;
  tgtInfo: { label: string; multiplicity: string };
  setTgtInfo: (tgtInfo: { label: string; multiplicity: string }) => void;
};

function LongRelationshipInput({
  type,
  source,
  setSource,
  target,
  setTarget,
  srcInfo,
  setSrcInfo,
  tgtInfo,
  setTgtInfo,
}: LongRelationshipInputProps) {
  const sourcePermittedEntities = getSourcePermittedEntities(type);
  const targetPermittedEntities = getTargetPermittedEntities(type);

  return (
    <div className="long-relationship-input">
      <div className="section">
        <TextField
          variant="standard"
          label="Source Label"
          fullWidth
          required
          value={srcInfo.label}
          onChange={(e) => setSrcInfo({ ...srcInfo, label: e.target.value })}
        />
        <div className="sub-section">
          <GroupSelect
            option={source}
            setOption={setSource}
            label="Source"
            includeClasses={sourcePermittedEntities.includes('class')}
            includeInterfaces={sourcePermittedEntities.includes('interface')}
            includeEnums={sourcePermittedEntities.includes('enum')}
            restrictOptions
          />
          <TextField
            variant="standard"
            label="Multiplicity"
            required
            value={srcInfo.multiplicity}
            onChange={(e) =>
              setSrcInfo({ ...srcInfo, multiplicity: e.target.value })
            }
            sx={{ width: 130 }}
            error={
              umlMultiplicityRegex.test(srcInfo.multiplicity) === false &&
              srcInfo.multiplicity !== ''
            }
          />
        </div>
      </div>
      <div className="section">
        <TextField
          variant="standard"
          label="Target Label"
          fullWidth
          value={tgtInfo.label}
          onChange={(e) => setTgtInfo({ ...tgtInfo, label: e.target.value })}
        />
        <div className="sub-section">
          <GroupSelect
            option={target}
            setOption={setTarget}
            label="Target"
            includeClasses={targetPermittedEntities.includes('class')}
            includeInterfaces={targetPermittedEntities.includes('interface')}
            includeEnums={targetPermittedEntities.includes('enum')}
            restrictOptions
          />
          <TextField
            variant="standard"
            label="Multiplicity"
            required
            value={tgtInfo.multiplicity}
            onChange={(e) =>
              setTgtInfo({ ...tgtInfo, multiplicity: e.target.value })
            }
            sx={{ width: 130 }}
            error={
              umlMultiplicityRegex.test(tgtInfo.multiplicity) === false &&
              tgtInfo.multiplicity !== ''
            }
          />
        </div>
      </div>
    </div>
  );
}

export default LongRelationshipInput;
