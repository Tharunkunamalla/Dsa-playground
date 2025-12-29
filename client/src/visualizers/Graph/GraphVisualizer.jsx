import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import VisualizerLayout from '../common/VisualizerLayout';
import './Graph.css';

const GraphVisualizer = () => {
  // Pre-defined graph structure for MVP
  const graphPresets = {
    default: {
        nodes: [
            { id: 0, x: 100, y: 100, value: 'A' },
            { id: 1, x: 300, y: 100, value: 'B' },
            { id: 2, x: 500, y: 100, value: 'C' },
            { id: 3, x: 200, y: 300, value: 'D' },
            { id: 4, x: 400, y: 300, value: 'E' },
        ],
        edges: [
            { source: 0, target: 1 }, { source: 0, target: 3 },
            { source: 1, target: 2 }, { source: 1, target: 4 }, { source: 1, target: 3 },
            { source: 2, target: 4 },
        ]
    },
    star: {
        nodes: [
            { id: 0, x: 300, y: 200, value: '0' },
            { id: 1, x: 300, y: 50, value: '1' },
            { id: 2, x: 500, y: 150, value: '2' },
            { id: 3, x: 450, y: 350, value: '3' },
            { id: 4, x: 150, y: 350, value: '4' },
            { id: 5, x: 100, y: 150, value: '5' },
        ],
        edges: [
            { source: 0, target: 1 }, { source: 0, target: 2 },
            { source: 0, target: 3 }, { source: 0, target: 4 },
            { source: 0, target: 5 },
        ]
    },
    cycle: {
        nodes: [
            { id: 0, x: 100, y: 200, value: 'A' },
            { id: 1, x: 200, y: 100, value: 'B' },
            { id: 2, x: 400, y: 100, value: 'C' },
            { id: 3, x: 500, y: 200, value: 'D' },
            { id: 4, x: 400, y: 300, value: 'E' },
            { id: 5, x: 200, y: 300, value: 'F' },
        ],
        edges: [
            { source: 0, target: 1 }, { source: 1, target: 2 },
            { source: 2, target: 3 }, { source: 3, target: 4 },
            { source: 4, target: 5 }, { source: 5, target: 0 },
            { source: 1, target: 5 }, // Cross edge
        ]
    }
  };

  const [currentGraph, setCurrentGraph] = useState('default');
  const [nodes, setNodes] = useState(graphPresets.default.nodes);
  const [edges, setEdges] = useState(graphPresets.default.edges);

  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const [visited, setVisited] = useState(new Set());
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState([]);
  const [log, setLog] = useState([]);
  const [animating, setAnimating] = useState(false);

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runBFS = async () => {
    if (animating) return;
    setAnimating(true);
    setVisited(new Set());
    setLog([]);
    setQueue([]);
    
    const startNode = 0;
    const q = [startNode];
    const seen = new Set([startNode]);
    
    setLog(prev => [`Starting BFS from Node ${nodes[startNode].value}`]);
    setVisited(new Set([startNode]));
    setQueue([startNode]);
    
    await wait(1000);

    while (q.length > 0) {
      const currId = q.shift();
      setCurrent(currId);
      setQueue([...q]);
      
      setLog(prev => [`Visiting Node ${nodes.find(n => n.id === currId)?.value}`, ...prev]);
      await wait(1000);

      // Get neighbors
      const neighbors = edges
        .filter(e => e.source === currId || e.target === currId)
        .map(e => e.source === currId ? e.target : e.source)
        .sort((a,b) => a - b); 

      for (const neighborId of neighbors) {
        if (!seen.has(neighborId)) {
          seen.add(neighborId);
          q.push(neighborId);
          setVisited(new Set(seen));
          setQueue([...q]);
          setLog(prev => [`Queueing Node ${nodes.find(n => n.id === neighborId)?.value}`, ...prev]);
          await wait(800);
        }
      }
    }
    
    setCurrent(null);
    setLog(prev => ['BFS Completed', ...prev]);
    setAnimating(false);
  };

  const runDFS = async () => {
    if (animating) return;
    setAnimating(true);
    setVisited(new Set());
    setLog([]);
    setQueue([]); // Uses queue UI for Stack visualization if needed, or we rename it
    
    const startNode = 0;
    const stack = [startNode];
    const seen = new Set(); // DFS marks as visited when POPPED usually, or pushed. 
    // Standard iterative DFS:
    
    setLog(prev => [`Starting DFS from Node ${nodes[startNode].value}`]);
    
    while (stack.length > 0) {
        const currId = stack.pop();
        
        if (!seen.has(currId)) {
            seen.add(currId);
            setVisited(new Set(seen));
            setCurrent(currId);
            setLog(prev => [`Visiting Node ${nodes.find(n => n.id === currId)?.value}`, ...prev]);
            await wait(1000);

            // Get neighbors
            const neighbors = edges
              .filter(e => e.source === currId || e.target === currId)
              .map(e => e.source === currId ? e.target : e.source)
              .sort((a,b) => b - a); // Reverse sort for stack to process smaller index first

            for (const neighborId of neighbors) {
                if (!seen.has(neighborId)) {
                    stack.push(neighborId);
                    setLog(prev => [`Pushing Node ${nodes.find(n => n.id === neighborId)?.value} to stack`, ...prev]);
                }
            }
        }
        await wait(500);
    }

    setCurrent(null);
    setLog(prev => ['DFS Completed', ...prev]);
    setAnimating(false);
  };

  const changeGraph = (type) => {
    if (animating) return;
    setCurrentGraph(type);
    setNodes(graphPresets[type].nodes);
    setEdges(graphPresets[type].edges);
    reset();
  };

  const reset = () => {
    if (animating) {
       // Ideally cancel promise, but for now just clear state
       // window.location.reload(); // naive fix
    }
    setVisited(new Set());
    setCurrent(null);
    setQueue([]);
    setLog([]);
    setAnimating(false);
  };

  return (
    <VisualizerLayout
      title="Graph Traversal (BFS)"
      complexity={{ operation: 'BFS', time: 'O(V + E)', space: 'O(V)' }}
      activityLog={log}
      onReset={reset}
    >
      <div className="controls-group">
        <div className="custom-dropdown" ref={dropdownRef}>
            <div 
                className={`dropdown-trigger ${isDropdownOpen ? 'open' : ''}`} 
                onClick={() => !animating && setIsDropdownOpen(!isDropdownOpen)}
            >
                <span>{currentGraph.charAt(0).toUpperCase() + currentGraph.slice(1)} Graph</span>
                <FaChevronDown className="dropdown-icon" />
            </div>
            {isDropdownOpen && (
                <div className="dropdown-options">
                    <div className="dropdown-item" onClick={() => { changeGraph('default'); setIsDropdownOpen(false); }}>
                        Default Graph
                    </div>
                    <div className="dropdown-item" onClick={() => { changeGraph('star'); setIsDropdownOpen(false); }}>
                        Star Graph
                    </div>
                    <div className="dropdown-item" onClick={() => { changeGraph('cycle'); setIsDropdownOpen(false); }}>
                        Cycle Graph
                    </div>
                </div>
            )}
        </div>

        <div className="btn-group">
            <button onClick={runBFS} disabled={animating} className="control-btn primary">Start BFS</button>
            <button onClick={runDFS} disabled={animating} className="control-btn secondary">Start DFS</button>
        </div>
      </div>

      <div className="graph-canvas">
        <svg width="100%" height="100%" viewBox="0 0 600 400">
           {/* Edges */}
             {edges.map((edge, idx) => {
               const start = nodes.find(n => n.id === edge.source);
               const end = nodes.find(n => n.id === edge.target);
               if (!start || !end) return null; // Safe guard
               
               const isVisited = visited.has(edge.source) && visited.has(edge.target); 
               // Simple logic: edge is 'active' if both ends visited? Or just part of structure.
               return (
               <line 
                 key={idx}
                 x1={start.x} y1={start.y}
                 x2={end.x} y2={end.y}
                 stroke={isVisited ? "#6366f1" : "#cbd5e1"}
                 strokeWidth="3"
               />
             );
           })}

           {/* Nodes */}
           {nodes.map((node) => (
             <g key={node.id}>
               <circle 
                 cx={node.x} cy={node.y} 
                 r="25" 
                 fill={current === node.id ? '#f59e0b' : visited.has(node.id) ? '#10b981' : 'white'}
                 stroke="#4b5563"
                 strokeWidth="2"
                 className="node-circle"
               />
               <text 
                 x={node.x} y={node.y} 
                 dy=".3em" 
                 textAnchor="middle" 
                 fontWeight="bold"
                 fill={visited.has(node.id) || current === node.id ? 'white' : '#1f2937'}
               >
                 {node.value}
               </text>
             </g>
           ))}
        </svg>
      </div>
    </VisualizerLayout>
  );
};

export default GraphVisualizer;
