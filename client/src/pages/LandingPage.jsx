import { Link } from 'react-router-dom';
import { FaLayerGroup, FaProjectDiagram, FaSortAmountDown, FaTree, FaStream, FaCode } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage = () => {
  const dsCards = [
    { title: 'Linked List', desc: 'Singly list: insert, delete, update', icon: <FaStream />, path: '/visualizer/linked-list', color: '#6366f1' },
    { title: 'Stack', desc: 'Push, pop, peek', icon: <FaLayerGroup />, path: '/visualizer/stack', color: '#ec4899' },
    { title: 'Queue', desc: 'Enqueue and dequeue', icon: <FaStream className="rotate-90" />, path: '/visualizer/queue', color: '#10b981' },
    { title: 'Binary Search Tree', desc: 'Insert and delete nodes', icon: <FaTree />, path: '/visualizer/binary-tree', color: '#f59e0b' },
    { title: 'Graph', desc: 'Add/remove nodes and edges', icon: <FaProjectDiagram />, path: '/visualizer/graph', color: '#8b5cf6' },
    { title: 'Recursion Call Stack', desc: 'Visualize function call stack', icon: <FaLayerGroup />, path: '/visualizer/recursion', color: '#3b82f6' },
    { title: 'Sorting Algorithms', desc: 'Bubble, Merge, Quick Sort', icon: <FaSortAmountDown />, path: '/visualizer/sorting', color: '#ef4444' },
    { title: 'Doubly Linked List', desc: 'Visualize doubly linked list', icon: <FaStream />, path: '/visualizer/dll', color: '#14b8a6' },

    { title: 'Striver DSA Sheet', desc: 'Track your progress', icon: <FaCode />, path: '/striver', color: '#6366f1' }
  ];

  return (
    <div className="landing-container animate-fade-in">
      <div className="hero-section">
        <h1 className="hero-title">Data Structures Playground</h1>
        <p className="hero-subtitle">
          Select a data structure to perform operations and visualize results live. 
          Customize your steps and learn by doing.
        </p>
      </div>

      <div className="cards-grid">
        {dsCards.map((card, index) => (
          <div key={index} className="glass-card ds-card">
            <div className="card-icon" style={{ background: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-desc">{card.desc}</p>
            <Link to={card.path} className="card-link" style={{ color: card.color }}>
              Open Visualizer ↗
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
