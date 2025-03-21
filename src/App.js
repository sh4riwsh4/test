// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import { FinancialProvider } from './contexts/FinancialContext';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';

// Layout components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';

// Import our modern theme
import './styles/modern-theme.css';

// Set dayjs locale to Turkish
dayjs.locale('tr');

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Define custom theme
  const customTheme = {
    token: {
      colorPrimary: '#3A36DB',
      colorSuccess: '#28C76F',
      colorWarning: '#FF9F43',
      colorError: '#EA5455',
      colorInfo: '#00CFE8',
      borderRadius: 8,
      wireframe: false,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
    },
    algorithm: theme.defaultAlgorithm,
  };

  return (
    <ConfigProvider theme={customTheme}>
      <FinancialProvider>
        <Router>
          <Layout className="app-layout">
            <Header collapsed={collapsed} toggleSidebar={toggleSidebar} />
            <Layout>
              <Sidebar collapsed={collapsed} />
              <Layout.Content 
                className="app-content"
                style={{ marginLeft: collapsed ? '80px' : '200px' }}
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/income" element={<Income />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/reports" element={<Reports />} />
                </Routes>
              </Layout.Content>
            </Layout>
            <Footer />
          </Layout>
        </Router>
      </FinancialProvider>
    </ConfigProvider>
  );
};

export default App;