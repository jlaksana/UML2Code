import { TextField } from '@mui/material';
import { RelationshipType } from '../../../types';
import {
  getSourceLabel,
  getTargetLabel,
  umlMultiplicityRegex,
} from '../modals/utils';
import ShortRelationshipInput from './ShortRelationshipInput';

type LongRelationshipInputProps = {
  type: RelationshipType;
  source: string;
  setSource: (source: string) => void;
  target: string;
  setTarget: (target: string) => void;
  label: string;
  setLabel: (label: string) => void;
  srcMultiplicity: string;
  setSrcMultiplicity: (srcMultiplicity: string) => void;
  tgtMultiplicity: string;
  setTgtMultiplicity: (tgtMultiplicity: string) => void;
};

function LongRelationshipInput({
  type,
  source,
  setSource,
  target,
  setTarget,
  label,
  setLabel,
  srcMultiplicity,
  setSrcMultiplicity,
  tgtMultiplicity,
  setTgtMultiplicity,
}: LongRelationshipInputProps) {
  return (
    <div className="long-relationship-input">
      <ShortRelationshipInput
        type={type}
        source={source}
        setSource={setSource}
        target={target}
        setTarget={setTarget}
      />
      <div className="section">
        <TextField
          variant="standard"
          label="Label"
          fullWidth
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <div className="sub-section">
          {type === 'Association' ? (
            <TextField
              variant="standard"
              label={`${getSourceLabel(type)} Multiplicity`}
              value={srcMultiplicity}
              onChange={(e) => setSrcMultiplicity(e.target.value)}
              sx={{ width: 190 }}
              error={umlMultiplicityRegex.test(srcMultiplicity) === false}
            />
          ) : null}
          <TextField
            variant="standard"
            label={`${getTargetLabel(type)} Multiplicity`}
            value={tgtMultiplicity}
            onChange={(e) => setTgtMultiplicity(e.target.value)}
            sx={{ width: 190 }}
            error={umlMultiplicityRegex.test(tgtMultiplicity) === false}
          />
        </div>
      </div>
    </div>
  );
}

export default LongRelationshipInput;
