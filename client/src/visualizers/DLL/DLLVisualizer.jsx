import { useState } from 'react';
import VisualizerLayout from '../common/VisualizerLayout';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import './DLL.css';

const DLLVisualizer = () => {
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [animating, setAnimating] = useState(false);

  const log = (msg) => setActivityLog(prev => [msg, ...prev]);
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const insertHead = async () => {
    if (!inputValue || animating) return;
    setAnimating(true);
    setComplexity({ operation: 'Insert Head', time: 'O(1)', space: 'O(1)' });
    log(`Inserting ${inputValue} at Head`);

    const newNode = { id: uuidv4(), value: inputValue, next: null, prev: null, isNew: true };
    await wait(500);

    setList(prev => {
      if (prev.length === 0) return [newNode];
      return [newNode, ...prev];
    });

    await wait(500);
    setList(prev => prev.map(node => ({ ...node, isNew: false })));
    setInputValue('');
    setAnimating(false);
  };

  const insertTail = async () => {
    if (!inputValue || animating) return;
    setAnimating(true);
    setComplexity({ operation: 'Insert Tail', time: 'O(1)', space: 'O(1)' }); // Assuming tail pointer availability logical equivalent
    log(`Inserting ${inputValue} at Tail`);

    const newNode = { id: uuidv4(), value: inputValue, next: null, prev: null, isNew: true };
    await wait(300);

    if (list.length === 0) {
      setList([newNode]);
    } else {
      setList(prev => [...prev, newNode]);
    }

    await wait(500);
    setList(prev => prev.map(node => ({ ...node, isNew: false })));
    setInputValue('');
    setAnimating(false);
  };

  const deleteHead = async () => {
    if (list.length === 0 || animating) return;
    setAnimating(true);
    setComplexity({ operation: 'Delete Head', time: 'O(1)', space: 'O(1)' });
    log(`Deleting Head`);

    setList(prev => prev.map((node, i) => i === 0 ? { ...node, isDeleted: true } : node));
    await wait(600);
    setList(prev => prev.slice(1));
    setAnimating(false);
  };

  const reset = () => {
    setList([]);
    setActivityLog([]);
    setComplexity(null);
    setInputValue('');
  };

  return (
    <VisualizerLayout 
      title="Doubly Linked List"
      complexity={complexity}
      activityLog={activityLog}
      onReset={reset}
    >
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
          <button onClick={deleteHead} disabled={animating} className="control-btn danger">Delete Head</button>
        </div>
      </div>

      <div className="dll-canvas">
        <div className="dll-list">
          <div className="dll-null">NULL</div>
          <div className="dll-arrow-wrapper"><FaLongArrowAltLeft /></div>
          
          {list.length === 0 ? <div className="empty-state">Empty</div> : (
            list.map((node, index) => (
              <div key={node.id} className="dll-node-group">
                 <div className={`dll-node ${node.isNew ? 'new-node' : ''} ${node.isDeleted ? 'deleted-node' : ''}`}>
                    <div className="node-val">{node.value}</div>
                    <div className="node-ptrs">
                      <span className="ptr prev"></span>
                      <span className="ptr next"></span>
                    </div>
                 </div>
                 {index < list.length - 1 && (
                   <div className="dll-arrows">
                     <FaLongArrowAltRight className="arrow-right"/>
                     <FaLongArrowAltLeft className="arrow-left"/>
                   </div>
                 )}
              </div>
            ))
          )}

          <div className="dll-arrow-wrapper"><FaLongArrowAltRight /></div>
          <div className="dll-null">NULL</div>
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default DLLVisualizer;
