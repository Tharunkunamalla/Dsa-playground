import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaHome, FaCode, FaLayerGroup, FaSignOutAlt, FaMoon, FaSun, FaUserCircle } from 'react-icons/fa';
import './Layout.css';
import AnimatedBackground from './common/AnimatedBackground';

import { useNavigate } from 'react-router-dom';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Dark Mode Logic
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <FaHome /> },
    { name: 'Striver Sheet', path: '/striver', icon: <FaCode /> },
    { name: 'Visualizer Info', path: '/visualizer/info', icon: <FaLayerGroup /> }, // Placeholder generic link
  ];

  return (
    <div className="layout-container">
      <AnimatedBackground />
      {/* Top Navbar */}
      <nav className="top-navbar glass-card">
        <div className="nav-left">
          <button onClick={toggleSidebar} className="menu-toggle">
            <FaBars />
          </button>
          <Link to="/" className="brand-logo-nav">
            DSA Play
          </Link>
        </div>

        <div className="nav-right">
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle Dark Mode">
            {isDarkMode ? <FaSun className="icon-sun" /> : <FaMoon className="icon-moon" />}
          </button>
          
          {user ? (
            <div className="user-menu">
              <span className="user-name">{user.username}</span>
              <FaUserCircle className="user-avatar" />
              <button onClick={handleLogout} className="logout-btn-nav" title="Logout">
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <Link to="/login" id="login-btn" className="login-btn-nav">Login</Link>
          )}
        </div>
      </nav>

      <div className="main-body">
        {/* Sidebar */}
        <aside className={`sidebar glass-card ${isSidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
