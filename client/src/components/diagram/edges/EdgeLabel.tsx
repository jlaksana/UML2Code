type EdgeLabelProps = {
  position: string;
  label: string;
  x: number;
  y: number;
};

function EdgeLabel({ position, label, x, y }: EdgeLabelProps) {
  const getTransform = (pos: string) => {
    switch (pos) {
      case 'middle':
        return `translate(-50%, -50%) translate(${x}px,${y}px)`;
      case 'source':
        return `translate(-50%, 0%) translate(${x}px,${y}px)`;
      case 'target':
        return `translate(-50%, -100%) translate(${x}px,${y}px)`;
      default:
        throw new Error('Invalid transform');
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        background: 'transparent',
        padding: 10,
        color: 'black',
        fontSize: 14,
        fontWeight: 700,
        transform: getTransform(position),
      }}
      className="nodrag nopan"
    >
      {label}
    </div>
  );
}

export default EdgeLabel;
