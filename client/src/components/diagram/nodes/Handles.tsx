import { Handle, Position } from 'reactflow';

function Handles() {
  return (
    <>
      <Handle
        id="top-left"
        type="source"
        position={Position.Top}
        style={{ left: '25%' }}
      />
      <Handle id="top-middle" type="source" position={Position.Top} />
      <Handle
        id="top-right"
        type="source"
        position={Position.Top}
        style={{ left: '75%' }}
      />
      <Handle
        id="left-top"
        type="source"
        position={Position.Left}
        style={{ top: '25%' }}
      />
      <Handle id="left-middle" type="source" position={Position.Left} />
      <Handle
        id="left-bottom"
        type="source"
        position={Position.Left}
        style={{ top: '75%' }}
      />
      <Handle
        id="right-top"
        type="source"
        position={Position.Right}
        style={{ top: '25%' }}
      />
      <Handle id="right-middle" type="source" position={Position.Right} />
      <Handle
        id="right-bottom"
        type="source"
        position={Position.Right}
        style={{ top: '75%' }}
      />
      <Handle
        id="bottom-left"
        type="source"
        position={Position.Bottom}
        style={{ left: '25%' }}
      />
      <Handle id="bottom-middle" type="source" position={Position.Bottom} />
      <Handle
        id="bottom-right"
        type="source"
        position={Position.Bottom}
        style={{ left: '75%' }}
      />
    </>
  );
}

export default Handles;
