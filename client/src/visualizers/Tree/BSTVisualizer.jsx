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
  const [highlightNode, setHighlightNode] = useState(null);

  const log = (msg) => setActivityLog(prev => [msg, ...prev]);
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const insert = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || animating) return;
    setAnimating(true);
    setComplexity({ operation: 'Insert', time: 'O(log n)', space: 'O(n)' });
    log(`Inserting ${val}`);

    if (!root) {
      setRoot(new TreeNode(val));
      log(`Root created: ${val}`);
      setInputValue('');
      setAnimating(false);
      return;
    }

    let current = root;
    // Traverse animation needs deep copy or state manipulation logic
    // For simplicity in React, we just update the structure directly for now
    // In a real generic viz, we would animate the traversal path.
    


    // Clone tree to trigger re-render
    const newRoot = JSON.parse(JSON.stringify(root)); // Shallow-ish clone for structure
    // Re-creating class instances manually for the traversal if methods needed, 
    // but here we just use data objects for rendering. 
    // Actually, JSON.parse loses class type. Let's use a simpler object approach.
    
    // Re-implementing insert with pure objects for easier cloning
    // Recursive insert helper with duplicate prevention
    const insertObj = (node, value) => {
      if (value === node.value) return false; // No duplicates
      if (value < node.value) {
         if (!node.left) {
           node.left = { value, left: null, right: null };
           return true; 
         }
         return insertObj(node.left, value);
      } else {
         if (!node.right) {
           node.right = { value, left: null, right: null };
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
    setRoot(newRoot);
    setInputValue('');
    setAnimating(false);
  };

  const reset = () => {
    setRoot(null);
    setActivityLog([]);
    setComplexity(null);
    setInputValue('');
  };

  // Tree Rendering Logic
  const renderTree = (node, x, y, level) => {
    if (!node) return null;
    const gap = 200 / level; 

    return (
      <g key={`node-${node.value}-${x}-${y}`}>
        {node.left && (
          <line x1={x} y1={y + 20} x2={x - gap} y2={y + 80 - 20} stroke="#cbd5e1" strokeWidth="2" />
        )}
        {node.right && (
          <line x1={x} y1={y + 20} x2={x + gap} y2={y + 80 - 20} stroke="#cbd5e1" strokeWidth="2" />
        )}
        
        <circle cx={x} cy={y} r="20" fill="white" stroke="#6366f1" strokeWidth="3" />
        <text x={x} y={y} dy=".3em" textAnchor="middle" fontWeight="bold" fontSize="14" fill="#1f2937">
          {node.value}
        </text>

        {renderTree(node.left, x - gap, y + 80, level + 0.5)}
        {renderTree(node.right, x + gap, y + 80, level + 0.5)}
      </g>
    );
  };

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
        <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
           {root && renderTree(root, 400, 50, 1.2)}
           {!root && <text x="400" y="300" textAnchor="middle" fill="#9ca3af" fontSize="18">Empty Tree</text>}
        </svg>
      </div>
    </VisualizerLayout>
  );
};

export default BSTVisualizer;
