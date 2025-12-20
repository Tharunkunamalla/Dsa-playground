import { useState } from 'react';
import VisualizerLayout from '../common/VisualizerLayout';
import './Queue.css';

const QueueVisualizer = () => {
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activityLog, setActivityLog] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [message, setMessage] = useState('');
  const [animating, setAnimating] = useState(false);

  const MAX_SIZE = 7;

  const log = (msg) => setActivityLog(prev => [msg, ...prev]);
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const enqueue = async () => {
    if (!inputValue || animating) return;
    if (queue.length >= MAX_SIZE) {
      setMessage('Queue Overflow! Max size reached.');
      return;
    }
    setAnimating(true);
    setMessage('');
    setComplexity({ operation: 'Enqueue', time: 'O(1)', space: 'O(1)' });
    log(`Enqueueing ${inputValue}`);

    const newItem = { id: Date.now(), value: inputValue, isNew: true };
    setQueue(prev => [...prev, newItem]);

    await wait(500);
    setQueue(prev => prev.map(item => ({ ...item, isNew: false })));
    log(`Enqueued ${inputValue}`);
    setInputValue('');
    setAnimating(false);
  };

  const dequeue = async () => {
    if (queue.length === 0 || animating) {
      setMessage('Queue Underflow! Queue is empty.');
      return;
    }
    setAnimating(true);
    setMessage('');
    setComplexity({ operation: 'Dequeue', time: 'O(1)', space: 'O(1)' });
    const val = queue[0].value;
    log(`Dequeueing ${val}`);

    // Mark first for deletion
    setQueue(prev => prev.map((item, idx) => idx === 0 ? { ...item, isDeleted: true } : item));
    await wait(600);

    setQueue(prev => prev.slice(1));
    log(`Dequeued ${val}`);
    setAnimating(false);
  };

  const reset = () => {
    setQueue([]);
    setActivityLog([]);
    setComplexity(null);
    setMessage('');
    setInputValue('');
  };

  return (
    <VisualizerLayout 
      title="Queue Data Structure"
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
      <div className="controls-group">
        <div className="input-with-btn">
          <input 
            type="text"
            className="control-input"
            placeholder="Value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={animating}
            onKeyDown={(e) => e.key === 'Enter' && enqueue()}
            maxLength={4}
          />
          <button onClick={enqueue} disabled={animating || !inputValue} className="control-btn primary">Enqueue</button>
        </div>
        <button onClick={dequeue} disabled={animating || queue.length === 0} className="control-btn warning">Dequeue</button>
        {message && <div className="viz-message animate-fade-in">{message}</div>}
      </div>

      <div className="queue-canvas">
        <div className="queue-container">
          <div className="queue-track">
             {queue.length === 0 && <div className="empty-message horizontal">Empty Queue</div>}
             {queue.map((item, index) => (
               <div 
                key={item.id}
                className={`queue-item ${item.isNew ? 'slide-left' : ''} ${item.isDeleted ? 'fade-out' : ''}`}
               >
                 <span className="queue-val">{item.value}</span>
                 <div className="queue-indicators">
                   {index === 0 && <span className="indicator front">Front</span>}
                   {index === queue.length - 1 && <span className="indicator rear">Rear</span>}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default QueueVisualizer;
