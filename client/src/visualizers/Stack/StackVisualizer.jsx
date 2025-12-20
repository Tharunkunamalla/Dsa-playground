import { useState } from 'react';
import VisualizerLayout from '../common/VisualizerLayout';
import './Stack.css';

const StackVisualizer = () => {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [message, setMessage] = useState('');
  const [animating, setAnimating] = useState(false);

  // Constants
  const MAX_SIZE = 8;

  const log = (msg) => setActivityLog(prev => [msg, ...prev]);

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const push = async () => {
    if (!inputValue || animating) return;
    if (stack.length >= MAX_SIZE) {
      setMessage('Stack Overflow! Cannot push more items.');
      return;
    }
    setAnimating(true);
    setMessage('');
    setComplexity({ operation: 'Push', time: 'O(1)', space: 'O(1)' });
    log(`Pushing ${inputValue} onto stack`);

    // Animation: Step 1 - Add phantom
    const newItem = { id: Date.now(), value: inputValue, isNew: true };
    setStack(prev => [...prev, newItem]);
    
    await wait(500);
    // Remove new tag
    setStack(prev => prev.map(item => ({ ...item, isNew: false })));
    log(`Pushed ${inputValue}`);
    setInputValue('');
    setAnimating(false);
  };

  const pop = async () => {
    if (stack.length === 0 || animating) {
      setMessage('Stack Underflow! Stack is empty.');
      return;
    }
    setAnimating(true);
    setMessage('');
    setComplexity({ operation: 'Pop', time: 'O(1)', space: 'O(1)' });
    const poppedVal = stack[stack.length - 1].value;
    log(`Popping ${poppedVal} from stack`);

    // Animation: Mark for deletion
    setStack(prev => prev.map((item, idx) => idx === prev.length - 1 ? { ...item, isDeleted: true } : item));
    await wait(600);
    
    // Remove
    setStack(prev => prev.slice(0, -1));
    log(`Popped ${poppedVal}`);
    setAnimating(false);
  };

  const peek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty');
      return;
    }
    setComplexity({ operation: 'Peek', time: 'O(1)', space: 'O(1)' });
    const topVal = stack[stack.length - 1].value;
    log(`Top element is ${topVal}`);
    setMessage(`Top Element: ${topVal}`);
    // Highlight top animation
    setStack(prev => prev.map((item, idx) => idx === prev.length - 1 ? { ...item, isHighlighted: true } : item));
    setTimeout(() => {
      setStack(prev => prev.map(item => ({ ...item, isHighlighted: false })));
    }, 1000);
  };

  const reset = () => {
    setStack([]);
    setActivityLog([]);
    setComplexity(null);
    setMessage('');
    setInputValue('');
  };

  return (
    <VisualizerLayout 
      title="Stack Data Structure"
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
        <div className="input-with-btn">
          <input 
            type="text"
            className="control-input"
            placeholder="Value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={animating}
            onKeyDown={(e) => e.key === 'Enter' && push()}
            maxLength={4}
          />
          <button onClick={push} disabled={animating || !inputValue} className="control-btn primary">Push</button>
        </div>
        <div className="button-group-row">
          <button onClick={pop} disabled={animating || stack.length === 0} className="control-btn warning">Pop</button>
          <button onClick={peek} disabled={animating || stack.length === 0} className="control-btn secondary">Peek</button>
        </div>
        {message && <div className="viz-message animate-fade-in">{message}</div>}
        <div className="viz-info-note">Max Size: {MAX_SIZE}</div>
      </div>

      {/* Canvas */}
      <div className="stack-canvas">
        <div className="stack-container">
          {stack.length === 0 && <div className="empty-message">Empty Stack</div>}
          {stack.slice().reverse().map((item, index) => ( // Reverse for visual stack (top at top)
            <div 
              key={item.id} 
              className={`stack-item ${item.isNew ? 'slide-in' : ''} ${item.isDeleted ? 'slide-out' : ''} ${item.isHighlighted ? 'highlight' : ''}`}
            >
              <span className="item-value">{item.value}</span>
              <span className="item-index">Index: {stack.length - 1 - index}</span> 
            </div>
          ))}
        </div>
        <div className="stack-base"></div>
      </div>
    </VisualizerLayout>
  );
};

export default StackVisualizer;
