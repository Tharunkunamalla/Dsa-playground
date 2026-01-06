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
    this.id = `node-${Date.now()}-${Math.random()}`;
  }
}

const BSTVisualizer = () => {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [animating, setAnimating] = useState(false);
  
  // State for SVG ViewBox / Canvas Size
  // We use scrollable canvas, so we need exact dimensions
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [viewBox, setViewBox] = useState('0 0 800 600');

  const log = (msg) => setActivityLog(prev => [msg, ...prev]);
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Improved Layout: Inorder Traversal for X, Depth for Y
  const calculateLayout = (node) => {
    if (!node) return { width: 800, height: 600, minX: 0, minY: 0 };

    let counter = 0;
    const horizontalSpacing = 60;
    const verticalSpacing = 80;
    const startY = 60;

    let minX = Infinity;
    let maxX = -Infinity;
    let maxY = 0;

    // First pass: Assign coordinates based on inorder index
    const traverse = (n, depth) => {
      if (!n) return;
      traverse(n.left, depth + 1);
      
      n.x = (counter++) * horizontalSpacing;
      n.y = startY + (depth * verticalSpacing);
      
      minX = Math.min(minX, n.x);
      maxX = Math.max(maxX, n.x);
      maxY = Math.max(maxY, n.y);

      traverse(n.right, depth + 1);
    };

    traverse(node, 0);

    // Add padding
    const paddingX = 100;
    const paddingY = 100;

    // Shift all nodes so minX aligns with padding
    // We want the leftmost node to be at paddingX
    const shiftX = paddingX - minX;

    const shiftNodes = (n) => {
      if (!n) return;
      n.x += shiftX;
      shiftNodes(n.left);
      shiftNodes(n.right);
    };
    shiftNodes(node);

    // Recalculate bounds after shift
    const finalMinX = paddingX; // By definition
    const finalMaxX = maxX + shiftX;
    const finalWidth = Math.max(800, finalMaxX + paddingX); // Ensure at least 800
    const finalHeight = Math.max(600, maxY + paddingY);

    return {
      width: finalWidth,
      height: finalHeight,
      minX: 0,
      minY: 0
    };
  };

  const cloneTree = (node) => {
    if (!node) return null;
    const newNode = { ...node };
    newNode.left = cloneTree(node.left);
    newNode.right = cloneTree(node.right);
    return newNode;
  };

  const insert = async () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || animating) return;
    setAnimating(true);
    setComplexity({ operation: 'Insert', time: 'O(log n)', space: 'O(n)' });
    log(`Inserting ${val}`);

    if (!root) {
      const newRoot = new TreeNode(val);
      // Layout calculation will position it correctly
      const layout = calculateLayout(newRoot);
      setCanvasSize({ width: layout.width, height: layout.height });
      setViewBox(`0 0 ${layout.width} ${layout.height}`);
      
      setRoot(newRoot);
      log(`Root created: ${val}`);
      setInputValue('');
      setAnimating(false);
      return;
    }

    const newRoot = cloneTree(root);

    const insertObj = (node, value) => {
      if (value === node.value) return false;
      if (value < node.value) {
         if (!node.left) {
           node.left = { 
             value, 
             left: null, 
             right: null, 
             x: node.x - 50, // Temp pos
             y: node.y + 50, // Temp pos
             id: `node-${Date.now()}-${Math.random()}` 
           };
           return true; 
         }
         return insertObj(node.left, value);
      } else {
         if (!node.right) {
           node.right = { 
             value, 
             left: null, 
             right: null, 
             x: node.x + 50, // Temp pos
             y: node.y + 50, // Temp pos
             id: `node-${Date.now()}-${Math.random()}` 
           };
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
    
    // Temporarily set root to show new node appearing at temp position (optional, skipping for speed)
    // await wait(100); 

    // Recalculate layout for perfect positioning
    await wait(300); // Small delay to visualize insertion before layout snap? Or immediate? 
    // Let's do immediate layout update for now to be safe, transition handles the move
    const layout = calculateLayout(newRoot);
    setCanvasSize({ width: layout.width, height: layout.height });
    setViewBox(`0 0 ${layout.width} ${layout.height}`);
    
    setRoot(newRoot);
    setInputValue('');
    setAnimating(false);
  };

  const reset = () => {
    setRoot(null);
    setActivityLog([]);
    setComplexity(null);
    setInputValue('');
    setCanvasSize({ width: 800, height: 600 });
    setViewBox('0 0 800 600');
  };

  // Tree Rendering Logic
  const renderTree = (node) => {
    if (!node) return null;

    // Use node.id for key to ensure stable identity and correct updates
    return (
      <g key={node.id}>
        {node.left && (
          <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="#cbd5e1" strokeWidth="2" />
        )}
        {node.right && (
          <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="#cbd5e1" strokeWidth="2" />
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
        <svg 
          width="100%" 
          height="100%" 
          viewBox={viewBox} 
          preserveAspectRatio="xMidYMid meet"
        >
           {root && renderTree(root)}
           {!root && <text x="400" y="300" textAnchor="middle" fill="#9ca3af" fontSize="18">Empty Tree</text>}
        </svg>
      </div>
    </VisualizerLayout>
  );
};
  
export default BSTVisualizer;

