import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaYoutube, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import './StriverSheet.css';

const striverData = [
  {
    topic: 'Arrays',
    problems: [
      { id: 'arr1', title: 'Set Matrix Zeroes', link: 'https://takeuforward.org/' },
      { id: 'arr2', title: 'Pascal\'s Triangle', link: 'https://takeuforward.org/' },
      { id: 'arr3', title: 'Next Permutation', link: 'https://takeuforward.org/' },
    ]
  },
  {
    topic: 'Linked List',
    problems: [
      { id: 'll1', title: 'Reverse Linked List', link: 'https://takeuforward.org/' },
      { id: 'll2', title: 'Middle of Linked List', link: 'https://takeuforward.org/' },
      { id: 'll3', title: 'Merge Two Sorted Lists', link: 'https://takeuforward.org/' },
    ]

  },
  {
    topic: 'Recursion',
    problems: [
      { id: 'rec1', title: 'Subset Sums', link: 'https://takeuforward.org/data-structure/subset-sum-sum-of-all-subsets/' },
      { id: 'rec2', title: 'Combination Sum', link: 'https://takeuforward.org/data-structure/combination-sum-ii-find-all-unique-combinations/' },
      { id: 'rec3', title: 'N-Queens', link: 'https://takeuforward.org/data-structure/n-queens-problems-approach-backtracking/' },
    ]
  },
  {
    topic: 'Graphs',
    problems: [
      { id: 'graph1', title: 'BFS of Graph', link: 'https://takeuforward.org/graph/breadth-first-search-bfs-level-order-traversal/' },
      { id: 'graph2', title: 'DFS of Graph', link: 'https://takeuforward.org/graph/depth-first-search-dfs-traversal-graph/' },
      { id: 'graph3', title: 'Detect Cycle in Undirected Graph', link: 'https://takeuforward.org/data-structure/detect-cycle-in-an-undirected-graph-using-bfs/' },
    ]
  },
  {
    topic: 'Dynamic Programming',
    problems: [
      { id: 'dp1', title: 'Fibonacci Number', link: 'https://takeuforward.org/data-structure/dynamic-programming-introduction-introduction-to-dp/' },
      { id: 'dp2', title: 'Climbing Stairs', link: 'https://takeuforward.org/data-structure/grid-unique-paths-dp-on-grids-dp-8/' },
      { id: 'dp3', title: 'Longest Increasing Subsequence', link: 'https://takeuforward.org/data-structure/longest-increasing-subsequence-dp-41/' },
    ]
  },
  {
    topic: 'Heaps',
    problems: [
      { id: 'heap1', title: 'Kth Largest Element', link: 'https://takeuforward.org/data-structure/kth-largest-element-in-an-array/' },
      { id: 'heap2', title: 'Top K Frequent Elements', link: 'https://takeuforward.org/data-structure/top-k-frequent-elements-in-array/' },
    ]
  }
];

const StriverSheet = () => {
  const [expandedTopic, setExpandedTopic] = useState('Arrays');
  const [completed, setCompleted] = useState({});

  const toggleTopic = (topic) => {
    setExpandedTopic(expandedTopic === topic ? null : topic);
  };

  const toggleComplete = (id) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="striver-container animate-fade-in">
      <div className="sheet-header">
        <h1>Striver's DSA Sheet</h1>
        <p>Master DSA concepts effectively.</p>
      </div>

      <div className="topics-list">
        {striverData.map((section, idx) => (
          <div key={idx} className="glass-card topic-card">
            <div 
              className={`topic-header ${expandedTopic === section.topic ? 'active' : ''}`}
              onClick={() => toggleTopic(section.topic)}
            >
              <h3>{section.topic}</h3>
              <span className="topic-icon">
                {expandedTopic === section.topic ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>
            
            {expandedTopic === section.topic && (
              <div className="problems-list">
                {section.problems.map((prob) => (
                  <div key={prob.id} className={`problem-item ${completed[prob.id] ? 'completed' : ''}`}>
                    <div className="problem-info">
                      <a href={prob.link} target="_blank" rel="noopener noreferrer" className="yt-link">
                      <span className="problem-title">{prob.title}</span>
                        {/* <FaYoutube /> Watch */}
                      </a>
                    </div>
                    <button onClick={() => toggleComplete(prob.id)} className="check-btn">
                      {completed[prob.id] ? <FaCheckCircle className="text-green" /> : <FaRegCircle />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StriverSheet;
