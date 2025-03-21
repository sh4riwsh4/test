// src/components/Layout/Sidebar.jsx
import React from 'react';
import { Layout, Menu, Typography, Avatar, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  RiseOutlined, 
  FallOutlined, 
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ collapsed, toggleSidebar }) => {
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
        boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
        height: '100vh',
        position: 'fixed',
        left: collapsed ? -200 : 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
        transition: 'left 0.3s'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
        
        <Button 
          type="text" 
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{ fontSize: '16px' }}
        />
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