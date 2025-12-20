import { useState, useRef, useEffect } from 'react';
import VisualizerLayout from '../common/VisualizerLayout';
import { FaArrowRight, FaLongArrowAltRight } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import './LinkedList.css';

const LinkedListVisualizer = () => {
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [highlightIndices, setHighlightIndices] = useState([]);
  const [animating, setAnimating] = useState(false);

  // Helper to add log
  const log = (message) => setActivityLog(prev => [message, ...prev]);

  const insertHead = async () => {
    if (!inputValue || animating) return;
    setAnimating(true);
    setComplexity({ operation: 'Insert Head', time: 'O(1)', space: 'O(1)' });
    log(`Preparing to insert ${inputValue} at Head`);

    // Animation Step 1: Create Node (virtual)
    await wait(500);
    const newNode = { id: uuidv4(), value: inputValue, next: null, isNew: true };
    
    // Animation Step 2: Update State
    log(`New node ${inputValue} points to current Head`);
    setList(prev => {
       const newList = [newNode, ...prev];
       return newList;
    });
    
    // Animation Step 3: Remove "New" status
    await wait(800);
    setList(prev => prev.map(node => ({ ...node, isNew: false })));
    log(`Inserted ${inputValue} at Head`);
    setInputValue('');
    setAnimating(false);
  };

  const insertTail = async () => {
    if (!inputValue || animating) return;
    setAnimating(true);
    setComplexity({ operation: 'Insert Tail', time: 'O(n) or O(1)', space: 'O(1)' }); // Assuming no tail pointer for O(n) vis, but usually O(1) with tail
    log(`Preparing to insert ${inputValue} at Tail`);

    await wait(500);
    const newNode = { id: uuidv4(), value: inputValue, next: null, isNew: true };

    if (list.length === 0) {
      setList([newNode]);
      log(`List empty, ${inputValue} becomes Head`);
    } else {
      // Traverse animation
      log(`Traversing to end of list...`);
      for (let i = 0; i < list.length; i++) {
        setHighlightIndices([i]);
        await wait(400);
      }
      setHighlightIndices([]);
      
      setList(prev => [...prev, newNode]);
      log(`Inserted ${inputValue} at Tail`);
    }

    await wait(800);
    setList(prev => prev.map(node => ({ ...node, isNew: false })));
    setInputValue('');
    setAnimating(false);
  };

  const deleteValue = async () => {
    if (!inputValue || animating) return;
    setAnimating(true);
    setComplexity({ operation: 'Delete Value', time: 'O(n)', space: 'O(1)' });
    log(`Searching for ${inputValue} to delete`);

    let found = false;
    let index = -1;

    for (let i = 0; i < list.length; i++) {
      setHighlightIndices([i]);
      await wait(500);
      if (list[i].value === inputValue) {
        found = true;
        index = i;
        log(`Found ${inputValue} at index ${i}`);
        break;
      }
    }

    if (found) {
      log(`Deleting node ${inputValue}`);
      setList(prev => prev.map((node, i) => i === index ? { ...node, isDeleted: true } : node));
      await wait(800);
      setList(prev => prev.filter((_, i) => i !== index));
      log(`Deleted ${inputValue}`);
    } else {
      log(`Value ${inputValue} not found`);
    }

    setHighlightIndices([]);
    setInputValue('');
    setAnimating(false);
  };

  const reset = () => {
    setList([]);
    setActivityLog([]);
    setComplexity(null);
    setHighlightIndices([]);
    setInputValue('');
  };

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <VisualizerLayout 
      title="Singly Linked List"
      complexity={complexity && (
        <div>
          <p><strong>Operation:</strong> {complexity.operation}</p>
          <p><strong>Time:</strong> <span className="badge complexity-badge">{complexity.time}</span></p>
          <p><strong>Space:</strong> <span className="badge space-badge">{complexity.space}</span></p>
        </div>
      )}
      activityLog={activityLog}
      onReset={reset}
    >
      {/* Controls */}
      <div className="controls-group">
        <input 
          type="text"
          className="control-input"
          placeholder="Value"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={animating}
        />
        <div className="button-group">
          <button onClick={insertHead} disabled={animating} className="control-btn primary">Insert Head</button>
          <button onClick={insertTail} disabled={animating} className="control-btn primary">Insert Tail</button>
          <button onClick={deleteValue} disabled={animating} className="control-btn danger">Delete</button>
        </div>
      </div>

      {/* Canvas */}
      <div className="ll-canvas">
        {list.length === 0 ? (
          <div className="empty-state">Empty List</div>
        ) : (
          <div className="ll-list">
            {list.map((node, index) => (
              <div key={node.id} className="ll-node-wrapper">
                <div className={`ll-node ${node.isNew ? 'new-node' : ''} ${node.isDeleted ? 'deleted-node' : ''} ${highlightIndices.includes(index) ? 'highlighted' : ''}`}>
                  <div className="node-value">{node.value}</div>
                  <div className="node-next-ptr"></div>
                </div>
                {index < list.length - 1 && (
                  <div className="ll-arrow">
                    <FaLongArrowAltRight size={24} />
                  </div>
                )}
                {index === list.length - 1 && (
                  <div className="ll-null">NULL</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </VisualizerLayout>
  );
};

export default LinkedListVisualizer;
