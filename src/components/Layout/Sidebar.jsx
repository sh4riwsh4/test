
// src/components/Layout/Sidebar.jsx
import React from 'react';
import { Layout, Menu, Typography, Avatar } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  RiseOutlined, 
  FallOutlined, 
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: '/income',
      icon: <RiseOutlined />,
      label: <Link to="/income">Gelirler</Link>,
    },
    {
      key: '/expenses',
      icon: <FallOutlined />,
      label: <Link to="/expenses">Giderler</Link>,
    },
    {
      key: '/reports',
      icon: <BarChartOutlined />,
      label: <Link to="/reports">Raporlar</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'companies',
      icon: <TeamOutlined />,
      label: 'Şirketler',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Ayarlar',
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: 'Yardım',
    }
  ];

  return (
    <Sider
      width={200}
      collapsible
      collapsed={collapsed}
      trigger={null}
      className="app-sidebar"
      style={{
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? '16px 0' : '16px', 
        borderBottom: '1px solid #f0f0f0',
        marginBottom: 16
      }}>
        <Avatar 
          shape="square" 
          size={collapsed ? 32 : 40}
          style={{ backgroundColor: '#3A36DB' }}
        >
          FT
        </Avatar>
        {!collapsed && (
          <Title level={5} style={{ margin: '0 0 0 8px', color: '#3A36DB' }}>
            FinTracker
          </Title>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ borderRight: 0 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;