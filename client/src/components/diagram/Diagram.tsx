import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';
import 'reactflow/dist/base.css';
import '../../styles/Editor.css';
import ClassNode from './nodes/ClassNode';

const nodeTypes = { class: ClassNode };

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'class',
    position: { x: 0, y: 0 },
    data: {
      name: 'Shape',
      isAbstract: true,
      constants: [
        { id: '1', name: 'PI', type: 'double' },
        { id: '2', name: 'E', type: 'double' },
      ],
      attributes: [
        { id: '1', name: 'xPos', type: 'int', visibility: '-' },
        { id: '2', name: 'yPos', type: 'int', visibility: '-' },
      ],
      methods: [
        {
          id: '1',
          name: 'getXPos',
          returnType: 'int',
          visibility: '+',
          isStatic: false,
        },
        {
          id: '2',
          name: 'getYPos',
          returnType: 'int',
          visibility: '+',
          isStatic: false,
        },
        {
          id: '3',
          name: 'perimeter',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
        {
          id: '4',
          name: 'area',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
      ],
    },
  },
  {
    id: '2',
    type: 'class',
    position: { x: 250, y: 250 },
    data: {
      name: 'Square',
      attributes: [
        { id: '1', name: 'xPos', type: 'int', visibility: '-' },
        { id: '2', name: 'yPos', type: 'int', visibility: '-' },
        { id: '3', name: 'sideLength', type: 'int', visibility: '-' },
      ],
      methods: [
        {
          id: '1',
          name: 'getXPos',
          returnType: 'int',
          visibility: '+',
          isStatic: false,
        },
        {
          id: '2',
          name: 'getYPos',
          returnType: 'int',
          visibility: '+',
          isStatic: false,
        },
        {
          id: '3',
          name: 'perimeter',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
        {
          id: '4',
          name: 'area',
          returnType: 'double',
          visibility: '+',
          isStatic: false,
        },
        {
          id: '5',
          name: 'getFormula',
          returnType: 'string',
          visibility: '+',
          isStatic: true,
        },
      ],
    },
  },
];

const initialEdges: Edge[] = [
  { id: '1-2', source: '1', target: '2', type: 'step' },
];

function Diagram() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="diagram">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      >
        <Background color="#444" variant={'dots' as BackgroundVariant} />
        <Controls style={{ flexDirection: 'column', gap: 0, margin: '3em' }} />
      </ReactFlow>
    </div>
  );
}

export default Diagram;
