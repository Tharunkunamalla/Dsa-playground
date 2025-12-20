import { useState, useEffect } from 'react';
import VisualizerLayout from '../common/VisualizerLayout';
import './Sorting.css';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubble');
  const [animating, setAnimating] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [complexity, setComplexity] = useState(null);
  const [compareIndices, setCompareIndices] = useState([]);
  const [swapIndices, setSwapIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  
  const SIZE = 15;
  const SPEED = 200;

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    // Force reset even if animating
    setAnimating(false);
    const newArr = Array.from({ length: SIZE }, () => Math.floor(Math.random() * 50) + 10);
    setArray(newArr);
    setSortedIndices([]);
    setCompareIndices([]);
    setSwapIndices([]);
    setActivityLog([]);
    setComplexity(null);
  };

  const log = (msg) => setActivityLog(prev => [msg, ...prev]);
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runSort = async () => {
    if (animating) return;
    setAnimating(true);
    
    if (algorithm === 'bubble') await bubbleSort();
    else if (algorithm === 'insertion') await insertionSort();
    else if (algorithm === 'selection') await selectionSort();
    else if (algorithm === 'merge') await mergeSort();
    else if (algorithm === 'quick') await quickSort();
    
    setAnimating(false);
  };

  const bubbleSort = async () => {
    setComplexity({ operation: 'Bubble Sort', time: 'O(n²)', space: 'O(1)' });
    log('Starting Bubble Sort...');
    let arr = [...array];
    let n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCompareIndices([j, j + 1]);
        await wait(SPEED);
        
        if (arr[j] > arr[j + 1]) {
          log(`Swapping ${arr[j]} and ${arr[j+1]}`);
          setSwapIndices([j, j + 1]);
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          await wait(SPEED);
        }
        setSwapIndices([]);
      }
      setSortedIndices(prev => [...prev, n - 1 - i]);
    }
    setSortedIndices(prev => [...prev, 0]); // Last one is sorted
    log('Bubble Sort Completed');
    setCompareIndices([]);
  };

  const insertionSort = async () => {
    setComplexity({ operation: 'Insertion Sort', time: 'O(n²)', space: 'O(1)' });
    log('Starting Insertion Sort...');
    let arr = [...array];
    let n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      log(`Inserting ${key}...`);
      
      setCompareIndices([i]);
      await wait(SPEED);

      while (j >= 0 && arr[j] > key) {
        setCompareIndices([j, j + 1]);
        setSwapIndices([j + 1]);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        await wait(SPEED);
        j = j - 1;
      }
      setSwapIndices([]);
    }
    setSortedIndices(arr.map((_, idx) => idx));
    log('Insertion Sort Completed');
    setCompareIndices([]);
  };
  const selectionSort = async () => {
    setComplexity({ operation: 'Selection Sort', time: 'O(n²)', space: 'O(1)' });
    log('Starting Selection Sort...');
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n; i++) {
      let minIdx = i;
      setCompareIndices([i]);
      for (let j = i + 1; j < n; j++) {
        setCompareIndices([minIdx, j]);
        await wait(SPEED);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        log(`Swapping ${arr[i]} and ${arr[minIdx]}`);
        setSwapIndices([i, minIdx]);
        let temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        setArray([...arr]);
        await wait(SPEED);
        setSwapIndices([]);
      }
      setSortedIndices(prev => [...prev, i]);
    }
    log('Selection Sort Completed');
    setCompareIndices([]);
  };

  /* Merge Sort */
  const mergeSort = async () => {
    setComplexity({ operation: 'Merge Sort', time: 'O(n log n)', space: 'O(n)' });
    log('Starting Merge Sort...');
    let arr = [...array];
    
    const merge = async (start, mid, end) => {
      let left = arr.slice(start, mid + 1);
      let right = arr.slice(mid + 1, end + 1);
      
      let i = 0, j = 0, k = start;
      
      while (i < left.length && j < right.length) {
        setCompareIndices([start + i, mid + 1 + j]);
        await wait(SPEED);
        
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          setSwapIndices([k]);
          setArray([...arr]);
          await wait(SPEED);
          i++;
        } else {
          arr[k] = right[j];
          setSwapIndices([k]);
          setArray([...arr]);
          await wait(SPEED);
          j++;
        }
        k++;
        setSwapIndices([]);
      }
      
      while (i < left.length) {
        setSwapIndices([k]);
        arr[k] = left[i];
        setArray([...arr]);
        await wait(SPEED);
        setSwapIndices([]);
        i++; k++;
      }
      while (j < right.length) {
        setSwapIndices([k]);
        arr[k] = right[j];
        setArray([...arr]);
        await wait(SPEED);
        setSwapIndices([]);
        j++; k++;
      }
    };

    const mergeSortHelper = async (start, end) => {
      if (start >= end) return;
      let mid = Math.floor((start + end) / 2);
      await mergeSortHelper(start, mid);
      await mergeSortHelper(mid + 1, end);
      await merge(start, mid, end);
    };

    await mergeSortHelper(0, arr.length - 1);
    setSortedIndices(arr.map((_, idx) => idx));
    log('Merge Sort Completed');
  };

  /* Quick Sort */
  const quickSort = async () => {
    setComplexity({ operation: 'Quick Sort', time: 'O(n log n)', space: 'O(log n)' });
    log('Starting Quick Sort...');
    let arr = [...array];

    const partition = async (low, high) => {
      let pivot = arr[high];
      log(`Pivot: ${pivot}`);
      setSwapIndices([high]);
      let i = low - 1;

      for (let j = low; j < high; j++) {
        setCompareIndices([j, high]);
        await wait(SPEED);
        
        if (arr[j] < pivot) {
          i++;
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          setArray([...arr]);
          await wait(SPEED);
        }
      }
      
      let temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      setArray([...arr]);
      setSwapIndices([]);
      await wait(SPEED);
      return i + 1;
    };

    const quickSortHelper = async (low, high) => {
      if (low < high) {
        let pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      }
    };

    await quickSortHelper(0, arr.length - 1);
    setSortedIndices(arr.map((_, idx) => idx));
    log('Quick Sort Completed');
  };

  return (
    <VisualizerLayout
      title="Sorting Algorithms"
      complexity={complexity && (
        <div>
          <p><strong>Algo:</strong> {complexity.operation}</p>
          <p><strong>Time:</strong> <span className="badge complexity-badge">{complexity.time}</span></p>
          <p><strong>Space:</strong> <span className="badge space-badge">{complexity.space}</span></p>
        </div>
      )}
      activityLog={activityLog}
      onReset={generateArray}
    >
      {/* Controls */}
      <div className="controls-group">
        <label className="text-sm font-semibold text-gray-500">Algorithm</label>
        <select 
          className="control-input" 
          value={algorithm} 
          onChange={(e) => setAlgorithm(e.target.value)}
          disabled={animating}
        >
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="quick">Quick Sort</option>
        </select>
        
        <div className="button-group-row">
          <button onClick={generateArray} disabled={animating} className="control-btn secondary">Generate New</button>
          <button onClick={runSort} disabled={animating} className="control-btn primary">Sort!</button>
        </div>
      </div>

      {/* Canvas */}
      <div className="sorting-canvas">
        <div className="bars-container">
          {array.map((val, idx) => (
            <div 
              key={idx}
              className={`bar-item 
                ${compareIndices.includes(idx) ? 'comparing' : ''} 
                ${swapIndices.includes(idx) ? 'swapping' : ''}
                ${sortedIndices.includes(idx) ? 'sorted' : ''}
              `}
              style={{ height: `${val * 3}px` }}
            >
              <span className="bar-val">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </VisualizerLayout>
  );
};

export default SortingVisualizer;
