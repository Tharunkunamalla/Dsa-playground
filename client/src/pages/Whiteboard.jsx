import { useState, useRef, useEffect } from 'react';
import { FaPen, FaEraser, FaTrash, FaSave, FaStickyNote, FaHistory, FaTimes, FaHandPaper } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Whiteboard.css';

const Whiteboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('draw'); // 'draw' or 'write'
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const drawAreaRef = useRef(null); // Ref for scrollable container
  const clickTimeoutRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('pen'); // 'pen', 'eraser', 'pan'
  // const [isEraser, setIsEraser] = useState(false); // Removed in favor of 'tool' state
  const [notes, setNotes] = useState('');
  
  // Panning State
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [entryTitle, setEntryTitle] = useState('');

  
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Fetch history
  const fetchHistory = async () => {
    try {
      setIsHistoryLoading(true);
      if (!user) return;
      
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo ? userInfo.token : null;
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get('/api/creative/list', config);
      setSavedItems(res.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to load history');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (historyOpen) {
      fetchHistory();
    }
  }, [historyOpen, user]);

  const performSave = async (forceDefault = false) => {
    if (!user) {
      toast.error('Please login to save your work');
      return;
    }

    // Single click without title check
    if (!forceDefault && !entryTitle.trim()) {
        toast('Please enter a name.\nDouble-click to save with default name.', {
            icon: 'ℹ️',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
        return;
    }

    try {
      setIsLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo ? userInfo.token : null;
      if (!token) {
        toast.error('Authentication error. Please login again.');
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let payload = {};
      const defaultTitle = activeTab === 'draw' 
        ? `Drawing - ${new Date().toLocaleString()}`
        : `Note - ${new Date().toLocaleString()}`;

      const finalTitle = entryTitle.trim() || defaultTitle; // If forceDefault is true, entryTitle might be empty, so use default.
      
      if (activeTab === 'draw') {
        const canvas = canvasRef.current;
        if (!canvas) return;
        payload = {
          type: 'drawing',
          content: canvas.toDataURL(),
          title: finalTitle
        };
      } else {
        if (!notes.trim()) {
           toast.error('Cannot save empty note');
           setIsLoading(false);
           return;
        }
        payload = {
          type: 'note',
          content: notes,
          title: finalTitle
        };
      }

      await axios.post('/api/creative/save', payload, config);
      toast.success('Saved successfully!');
      setEntryTitle(''); // Reset title after save
      if (historyOpen) fetchHistory(); // Refresh list if open
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClick = () => {
    if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
    }

    clickTimeoutRef.current = setTimeout(() => {
        performSave(false);
    }, 250);
  };

  const handleSaveDoubleClick = () => {
    if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
    }
    performSave(true);
  };

  const loadItem = (item) => {
    if (item.type === 'drawing') {
      setActiveTab('draw');
      // We need to wait for the canvas to render if it wasn't active
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio); // Adjust for DPR if needed, or just 0,0,width,height
          };
          img.src = item.content;
        }
      }, 100);
    } else {
      setActiveTab('write');
      setNotes(item.content);
    }
    toast.success(`Loaded ${item.type}`);
  };

  const deleteItem = async (e, id) => {
    e.stopPropagation();
    if(!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;

    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo ? userInfo.token : null;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/creative/${id}`, config);
        toast.success("Deleted successfully");
        fetchHistory();
    } catch (error) {
        toast.error("Failed to delete");
    }
  };

  // Setup Canvas

  // Setup Canvas
  useEffect(() => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      // Handle high DPI displays
      const dpr = window.devicePixelRatio || 1;
      // Fixed large size
      const width = 3000;
      const height = 3000;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      contextRef.current = ctx;
      
      // Prevent scrolling when touching canvas (handled manually if needed, but we want native scroll usually)
      // canvas.style.touchAction = "none"; 
    }
  }, [activeTab]);

  useEffect(() => {
    if (contextRef.current) {
        if (tool === 'eraser') {
            contextRef.current.globalCompositeOperation = 'destination-out';
            contextRef.current.lineWidth = brushSize * 2; // Eraser is bigger
        } else {
            contextRef.current.globalCompositeOperation = 'source-over';
            contextRef.current.strokeStyle = color;
            contextRef.current.lineWidth = brushSize;
        }
    }
  }, [color, brushSize, tool]);

  const getCoordinates = (event) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Calculate position relative to canvas
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    
    // If using dpr scaling at context level, we might need to adjust logic. 
    // However, since we stored the context with scale(dpr,dpr), logical coordinates (0 to rect.width) mapped to Physical (0 to rect.width*dpr).
    // The event.clientX - rect.left gives logical coordinates relative to viewport.
    // So simple logical coordinates are enough if context is scaled.
    
    // BUT we manually set width/height with dpr. 
    // width = rect.width * dpr.
    // context.scale(dpr, dpr).
    // So if we draw at (10, 10), it draws at physical (10*dpr, 10*dpr).
    // event.clientX - rect.left = 10. 
    
    return { 
        x: (event.clientX - rect.left), // Logical coordinates 
        y: (event.clientY - rect.top) 
    };
  };

  const startDrawing = (e) => {
    if (tool === 'pan') {
        setIsPanning(true);
        setLastMousePosition({ x: e.clientX, y: e.clientY });
        return;
    }

    const { x, y } = getCoordinates(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    if (tool === 'pan') {
        setIsPanning(false);
        return;
    }

    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (tool === 'pan') {
        if (!isPanning) return;
        const dx = e.clientX - lastMousePosition.x;
        const dy = e.clientY - lastMousePosition.y;
        
        if (drawAreaRef.current) {
            drawAreaRef.current.scrollLeft -= dx;
            drawAreaRef.current.scrollTop -= dy;
        }
        setLastMousePosition({ x: e.clientX, y: e.clientY });
        return;
    }

    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="whiteboard-container animate-fade-in">
      <div className="whiteboard-header">
        <h1>Creative Space</h1>
        <div className="tab-controls">
          <button 
            className={`tab-btn ${activeTab === 'draw' ? 'active' : ''}`}
            onClick={() => setActiveTab('draw')}
          >
            <FaPen /> Drawing
          </button>
          <button 
            className={`tab-btn ${activeTab === 'write' ? 'active' : ''}`}
            onClick={() => setActiveTab('write')}
          >
            <FaStickyNote /> Notes
          </button>
        </div>
        <div className="action-controls">
            <div className="title-input-wrapper">
                <input 
                    type="text" 
                    placeholder="Enter file name..." 
                    value={entryTitle}
                    onChange={(e) => setEntryTitle(e.target.value)}
                    className="title-input"
                />
            </div>
            <button 
                className="action-btn save-btn" 
                onClick={handleSaveClick}
                onDoubleClick={handleSaveDoubleClick}
                disabled={isLoading}
                title="Click to save with name, Double-click to auto-name"
            >
                <FaSave /> {isLoading ? 'Saving...' : 'Save'}
            </button>
            <button className={`action-btn history-btn ${historyOpen ? 'active' : ''}`} onClick={() => setHistoryOpen(!historyOpen)}>
                <FaHistory /> History
            </button>
        </div>
      </div>

      <div className="main-content-wrapper">
         {/* History Sidebar */}
         <div className={`history-sidebar glass-card ${historyOpen ? 'open' : ''}`}>
            <div className="history-header">
                <h3>Saved Work</h3>
                <button onClick={() => setHistoryOpen(false)}><FaTimes /></button>
            </div>
            <div className="history-list">
                {isHistoryLoading ? (
                  <div className="loading-spinner-container">
                    <div className="spinner"></div>
                    <p>Loading saved work...</p>
                  </div>
                ) : savedItems.length === 0 ? (
                    <p className="empty-msg">No saved items found.</p>
                ) : (
                    savedItems.map(item => (
                        <div key={item._id} className="history-item" onClick={() => loadItem(item)}>
                            <div className="item-icon">
                                {item.type === 'drawing' ? <FaPen /> : <FaStickyNote />}
                            </div>
                            <div className="item-info">
                                <span className="item-title">{item.title}</span>
                                <span className="item-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button className="delete-btn" onClick={(e) => deleteItem(e, item._id)}>
                                <FaTrash />
                            </button>
                        </div>
                    ))
                )}
            </div>
         </div>

      <div className="whiteboard-content glass-card">
        {activeTab === 'draw' ? (
          <div className="draw-area">
            <div className="toolbar">
              <input 
                type="color" 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                title="Color Picker"
              />
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={brushSize} 
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                title="Brush Size"
              />
              <button 
                onClick={() => setTool('pen')} 
                title="Pen Tool"
                className={tool === 'pen' ? 'active-tool' : ''}
                style={{ 
                  background: tool === 'pen' ? 'rgba(99, 102, 241, 0.5)' : '',
                  color: color
                }}
              >
                <FaPen />
              </button>
              <button 
                onClick={() => setTool(tool === 'eraser' ? 'pen' : 'eraser')} 
                title="Eraser"
                className={tool === 'eraser' ? 'active-tool' : ''}
                style={{ background: tool === 'eraser' ? 'rgba(99, 102, 241, 0.5)' : '' }}
              >
                <FaEraser />
              </button>
              <button 
                onClick={() => setTool(tool === 'pan' ? 'pen' : 'pan')} 
                title="Pan Tool (Click to toggle)"
                className={tool === 'pan' ? 'active-tool' : ''}
                style={{ background: tool === 'pan' ? 'rgba(99, 102, 241, 0.5)' : '' }}
              >
                <FaHandPaper />
              </button>
              <button onClick={clearCanvas} title="Clear All">
                <FaTrash />
              </button>
            </div>
            <div className="canvas-container" ref={drawAreaRef}>
             <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={draw}
              onMouseLeave={finishDrawing}
              className="drawing-canvas"
              style={{
                cursor: tool === 'pan' ? (isPanning ? 'grabbing' : 'grab') : 'crosshair'
              }}
            />
            </div>
          </div>
        ) : (
          <div className="write-area">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Start typing your ideas here..."
              className="notes-textarea"
            />
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Whiteboard;
