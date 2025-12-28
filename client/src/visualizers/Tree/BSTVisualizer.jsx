import { useState } from 'react';
import VisualizerLayout from '../common/VisualizerLayout';
import './Tree.css';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
  }
}

const BSTVisualizer = () => {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [animating, setAnimating] = useState(false);
  
  // State for SVG ViewBox
  const [treeBounds, setTreeBounds] = useState({ minX: 0, maxX: 800, minY: 0, maxY: 600 });

  const log = (msg) => setActivityLog(prev => [msg, ...prev]);
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper to Calculate Node Positions and Bounds
  const calculateLayout = (node) => {
    if (!node) return { minX: 0, maxX: 800, minY: 0, maxY: 600 };

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = 0; // Root always at 50 (ignoring padding for calc)
    let maxY = 0;

    const traverse = (n, x, y, level) => {
      if (!n) return;
      
      n.x = x;
      n.y = y;
      
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      const gap = 200 / (level * 1.2); // Reduces gap as we go deeper
      traverse(n.left, x - gap, y + 80, level + 1);
      traverse(n.right, x + gap, y + 80, level + 1);
    };

    traverse(node, 400, 50, 1);
    
    // Add some padding
    return {
      minX: minX - 50,
      maxX: maxX + 50,
      minY: minY - 50,
      maxY: maxY + 100 // More padding at bottom
    };
  };

  const insert = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || animating) return;
    setAnimating(true);
    setComplexity({ operation: 'Insert', time: 'O(log n)', space: 'O(n)' });
    log(`Inserting ${val}`);

    if (!root) {
      const newRoot = new TreeNode(val);
      newRoot.x = 400;
      newRoot.y = 50;
      setRoot(newRoot);
      setTreeBounds(calculateLayout(newRoot));
      log(`Root created: ${val}`);
      setInputValue('');
      setAnimating(false);
      return;
    }

    // Clone tree
    // We need a proper deep clone to modify safe properties
    // For this simple structure, JSON parse/stringify is "ok" but loses class methods if any
    // Let's rebuild the structure with traverse to be safer or just use the JSON hack for MVP data
    const newRoot = JSON.parse(JSON.stringify(root));

    const insertObj = (node, value) => {
      if (value === node.value) return false;
      if (value < node.value) {
         if (!node.left) {
           node.left = { value, left: null, right: null, x: 0, y: 0 };
           return true; 
         }
         return insertObj(node.left, value);
      } else {
         if (!node.right) {
           node.right = { value, left: null, right: null, x: 0, y: 0 };
           return true;
         }
         return insertObj(node.right, value);
      }
    };

    const inserted = insertObj(newRoot, val);
    if (!inserted) {
      setAnimating(false);
      log(`${val} already exists`);
      return; 
    }
    
    await wait(500);
    // Recalculate layout for the WHOLE tree
    const bounds = calculateLayout(newRoot);
    setTreeBounds(bounds);
    setRoot(newRoot);
    
    setInputValue('');
    setAnimating(false);
  };

  const reset = () => {
    setRoot(null);
    setActivityLog([]);
    setComplexity(null);
    setInputValue('');
    setTreeBounds({ minX: 0, maxX: 800, minY: 0, maxY: 600 });
  };

  // Tree Rendering Logic
  const renderTree = (node) => {
    if (!node) return null;

    return (
      <g key={`node-${node.value}-${node.x}-${node.y}`}>
        {node.left && (
          <line x1={node.x} y1={node.y + 20} x2={node.left.x} y2={node.left.y - 20} stroke="#cbd5e1" strokeWidth="2" />
        )}
        {node.right && (
          <line x1={node.x} y1={node.y + 20} x2={node.right.x} y2={node.right.y - 20} stroke="#cbd5e1" strokeWidth="2" />
        )}
        
        <circle cx={node.x} cy={node.y} r="20" fill="white" stroke="#6366f1" strokeWidth="3" />
        <text x={node.x} y={node.y} dy=".3em" textAnchor="middle" fontWeight="bold" fontSize="14" fill="#1f2937">
          {node.value}
        </text>

        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };

  const viewBox = `${treeBounds.minX} ${treeBounds.minY} ${treeBounds.maxX - treeBounds.minX} ${treeBounds.maxY - treeBounds.minY}`;

  return (
    <VisualizerLayout 
      title="Binary Search Tree"
      complexity={complexity}
      activityLog={activityLog}
      onReset={reset}
    >
      <div className="controls-group">
        <div className="input-with-btn">
          <input 
            type="number"
            className="control-input"
            placeholder="Number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={animating}
            onKeyDown={(e) => e.key === 'Enter' && insert()}
          />
          <button onClick={insert} disabled={animating || !inputValue} className="control-btn primary">Insert</button>
        </div>
      </div>

      <div className="tree-canvas">
        <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
           {root && renderTree(root)}
           {!root && <text x="400" y="300" textAnchor="middle" fill="#9ca3af" fontSize="18">Empty Tree</text>}
        </svg>
      </div>
    </VisualizerLayout>
  );
};

export default BSTVisualizer;
