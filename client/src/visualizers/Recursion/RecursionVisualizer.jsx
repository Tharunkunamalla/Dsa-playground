import { useState } from 'react';
import VisualizerLayout from '../common/VisualizerLayout';
import './Recursion.css';

const RecursionVisualizer = () => {
  const [inputValue, setInputValue] = useState('');
  const [frames, setFrames] = useState([]); // Call stack frames
  const [activityLog, setActivityLog] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [animating, setAnimating] = useState(false);

  const log = (msg) => setActivityLog(prev => [msg, ...prev]);
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runFactorial = async () => {
    let n = parseInt(inputValue);
    if (isNaN(n) || n < 0 || n > 10 || animating) return;
    setAnimating(true);
    setComplexity({ operation: 'Factorial', time: 'O(n)', space: 'O(n)' });
    setFrames([]);
    log(`Calculating Factorial(${n})`);

    await factorial(n);

    log(`Factorial Calculation Complete`);
    setAnimating(false);
  };

  const factorial = async (n) => {
    // Push Frame
    const frameId = Date.now() + Math.random();
    log(`Call: factorial(${n})`);
    setFrames(prev => [...prev, { id: frameId, func: `fact(${n})`, val: '?', active: true }]);
    await wait(800);

    let result;
    if (n === 0 || n === 1) {
      result = 1;
      log(`Base case: factorial(${n}) = 1`);
    } else {
      log(`Recurse: ${n} * fact(${n-1})`);
      const subResult = await factorial(n - 1);
      result = n * subResult;
      log(`Return: ${n} * ${subResult} = ${result}`);
    }

    // Pop Frame / Update Result
    setFrames(prev => prev.map(f => f.id === frameId ? { ...f, val: result, active: false, returning: true } : f));
    await wait(800);
    setFrames(prev => prev.filter(f => f.id !== frameId)); // Visualize pop
    return result;
  };

  const reset = () => {
    setFrames([]);
    setActivityLog([]);
    setComplexity(null);
    setInputValue('');
  };

  return (
    <VisualizerLayout 
      title="Recursion (Factorial)"
      complexity={complexity}
      activityLog={activityLog}
      onReset={reset}
    >
      <div className="controls-group">
        <input 
          type="number"
          className="control-input"
          placeholder="N (0-10)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={animating}
          max={10}
        />
        <button onClick={runFactorial} disabled={animating || !inputValue} className="control-btn primary">Run Factorial</button>
      </div>

      <div className="recursion-canvas">
        <div className="stack-visual">
          <h3 className="stack-title">Call Stack</h3>
          <div className="frames-container">
            {frames.slice().reverse().map((frame) => (
               <div key={frame.id} className={`stack-frame ${frame.returning ? 'returning' : 'active'}`}>
                 <span className="frame-func">{frame.func}</span>
                 <span className="frame-return">Return: <span className="val">{frame.val}</span></span>
               </div>
            ))}
            {frames.length === 0 && <div className="empty-stack">Stack Empty</div>}
          </div>
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default RecursionVisualizer;
