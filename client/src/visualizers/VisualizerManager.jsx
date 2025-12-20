import { useParams } from 'react-router-dom';
import LinkedListVisualizer from './LinkedList/LinkedListVisualizer';

import StackVisualizer from './Stack/StackVisualizer';
import QueueVisualizer from './Queue/QueueVisualizer';

import SortingVisualizer from './Sorting/SortingVisualizer';
import DLLVisualizer from './DLL/DLLVisualizer';
import BSTVisualizer from './Tree/BSTVisualizer';
import RecursionVisualizer from './Recursion/RecursionVisualizer';
import GraphVisualizer from './Graph/GraphVisualizer';

const VisualizerManager = () => {
  const { type } = useParams();

  switch (type) {
    case 'linked-list':
      return <LinkedListVisualizer />;
    case 'stack':
      return <StackVisualizer />;
    case 'queue':
      return <QueueVisualizer />;
    case 'sorting':
      return <SortingVisualizer />;
    case 'dll':
      return <DLLVisualizer />;
    case 'binary-tree':
      return <BSTVisualizer />;
    case 'recursion':
      return <RecursionVisualizer />;
    case 'graph':
      return <GraphVisualizer />;
    default:
      return (
        <div className="p-8 text-center text-gray-500">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p>The {type} visualizer is under development.</p>
        </div>
      );
  }
};

export default VisualizerManager;
