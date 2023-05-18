import { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import '../../../styles/Node.css';
import { Attribute, Constant, Klass, Method } from '../../../types';

function ClassNode({ data }: NodeProps<Klass>) {
  return (
    <>
      <Handle id="a" type="target" position={Position.Top} />
      <Handle id="b" type="target" position={Position.Left} />
      <div className="node">
        <div className="node-header">
          {data.isAbstract && (
            <div className="node-abstract">{'<abstract>'}</div>
          )}
          <div className="node-title">{data.name}</div>
        </div>
        <hr />
        <div className="node-body">
          <div className="node-attributes">
            {data.constants &&
              data.constants.map((constant: Constant) => (
                <div className="node-attribute" key={constant.id}>
                  {`+ ${constant.name}: ${constant.type} <static>`}
                </div>
              ))}
            {data.attributes &&
              data.attributes.map((attribute: Attribute) => (
                <div className="node-attribute" key={attribute.id}>
                  {attribute.visibility} {attribute.name}: {attribute.type}
                </div>
              ))}
          </div>
          <hr />
          <div className="node-methods">
            {data.methods &&
              data.methods.map((method: Method) => (
                <div className="node-method" key={method.id}>
                  {method.visibility} {method.name}(): {method.returnType}{' '}
                  {method.isStatic ? '<static>' : ''}
                </div>
              ))}
          </div>
        </div>
      </div>
      <Handle id="c" type="source" position={Position.Right} />
      <Handle id="d" type="source" position={Position.Bottom} />
    </>
  );
}

export default memo(ClassNode);
