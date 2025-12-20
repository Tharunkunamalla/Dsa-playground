import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import StriverSheet from './pages/StriverSheet';
import VisualizerManager from './visualizers/VisualizerManager';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Auth />} />
            <Route 
              path="striver" 
              element={
                <ProtectedRoute>
                  <StriverSheet />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="visualizer/:type" 
              element={
                <ProtectedRoute>
                  <VisualizerManager />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
