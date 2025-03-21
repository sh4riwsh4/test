
// src/components/Layout/Sidebar.jsx
import React from 'react';
import { Layout, Menu, Typography, Avatar, Button, Drawer } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  RiseOutlined, 
  FallOutlined, 
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  CloseOutlined
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

  // Desktop sidebar
  const DesktopSidebar = (
    <Sider
      width={200}
      collapsible
      collapsed={collapsed}
      trigger={null}
      className="app-sidebar desktop-sidebar"
      style={{
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        display: 'none',
        '@media (min-width: 768px)': { 
          display: 'block'
        }
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

  // Mobile drawer sidebar
  const MobileSidebar = (
    <Drawer
      placement="left"
      closable={false}
      onClose={toggleSidebar}
      open={!collapsed}
      width={250}
      bodyStyle={{ padding: 0 }}
      className="mobile-sidebar"
      style={{
        '@media (min-width: 768px)': { 
          display: 'none'
        }
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            shape="square" 
            size={40}
            style={{ backgroundColor: '#3A36DB' }}
          >
            FT
          </Avatar>
          <Title level={5} style={{ margin: '0 0 0 8px', color: '#3A36DB' }}>
            FinTracker
          </Title>
        </div>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={toggleSidebar}
        />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ borderRight: 0 }}
        items={menuItems}
      />
    </Drawer>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileSidebar}
    </>
  );
};

export default Sidebar;
