// src/components/Layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Space, Avatar, Select, DatePicker, Badge, Button, Dropdown, Menu } from 'antd';
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  BellOutlined, 
  UserOutlined, 
  SettingOutlined,
  DownOutlined,
  CalendarOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useFinancial } from '../../contexts/FinancialContext';
import dayjs from 'dayjs';

const { Header: AntHeader } = Layout;
const { Title } = Typography;
const { Option } = Select;

const Header = ({ collapsed, toggleSidebar }) => {
  const { 
    companies, 
    selectedCompany, 
    setSelectedCompany, 
    selectedDate, 
    setSelectedDate 
  } = useFinancial();
  
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = screenWidth < 768;

  const handleCompanyChange = (value) => {
    setSelectedCompany(value);
  };

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date.toDate());
    }
  };

  // Get selected company data
  const selectedCompanyData = companies.find(
    (company) => company.id === selectedCompany
  );
  const companyName = selectedCompanyData?.name || 'Company';

  const userMenuItems = [
    {
      key: '1',
      label: 'Profil',
    },
    {
      key: '2',
      label: 'Ayarlar',
    },
    {
      key: '3',
      label: 'Çıkış',
    },
  ];

  const notificationMenuItems = [
    {
      key: '1',
      label: 'Yeni gelir eklendi',
    },
    {
      key: '2',
      label: 'Yeni gider eklendi',
    },
  ];

  // Mobile menu items
  const mobileMenuItems = [
    {
      key: 'date',
      label: 'Tarih Seçin',
      icon: <CalendarOutlined />,
      children: [
        {
          key: 'datepicker',
          label: (
            <DatePicker 
              value={dayjs(selectedDate)}
              onChange={handleDateChange} 
              style={{ width: '100%' }}
            />
          )
        }
      ]
    },
    {
      key: 'company',
      label: 'Şirket Seçin',
      icon: <AppstoreOutlined />,
      children: companies.map(company => ({
        key: `company-${company.id}`,
        label: company.name,
        onClick: () => handleCompanyChange(company.id)
      }))
    },
    {
      key: 'notifications',
      label: 'Bildirimler',
      icon: <BellOutlined />,
      children: notificationMenuItems.map(item => ({
        key: item.key,
        label: item.label
      }))
    },
    {
      key: 'user',
      label: 'Kullanıcı',
      icon: <UserOutlined />,
      children: userMenuItems.map(item => ({
        key: item.key,
        label: item.label
      }))
    }
  ];

  return (
    <AntHeader className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            style={{ fontSize: '16px', marginRight: 24 }}
          />
          <Title level={4} style={{ margin: 0, color: '#3A36DB' }}>
            Financial Tracker
          </Title>
        </div>
        
        {/* Desktop Controls */}
        {!isMobile && (
          <Space size={16}>
            <Select
              value={selectedCompany}
              style={{ width: 180 }}
              onChange={handleCompanyChange}
              bordered={false}
              suffixIcon={<DownOutlined style={{ color: '#3A36DB' }} />}
            >
              {companies.map((company) => (
                <Option key={company.id} value={company.id}>
                  <Space>
                    <Avatar 
                      size="small" 
                      src={company.logo} 
                      style={{ backgroundColor: company.color }}
                    >
                      {company.name[0]}
                    </Avatar>
                    {company.name}
                  </Space>
                </Option>
              ))}
            </Select>
            
            <DatePicker 
              value={dayjs(selectedDate)}
              onChange={handleDateChange} 
              allowClear={false}
              bordered={false}
            />
            
            <Dropdown
              menu={{ items: notificationMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Badge count={2} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined style={{ fontSize: '18px' }} />} 
                  shape="circle"
                />
              </Badge>
            </Dropdown>
            
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Space>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{ backgroundColor: '#3A36DB' }}
                />
                <span>Admin</span>
                <DownOutlined style={{ fontSize: '12px' }} />
              </Space>
            </Dropdown>
          </Space>
        )}
        
        {/* Mobile Menu */}
        {isMobile && (
          <Dropdown
            menu={{ items: mobileMenuItems }}
            trigger={['click']}
          >
            <Button 
              type="text" 
              icon={<AppstoreOutlined style={{ fontSize: '20px' }} />} 
            />
          </Dropdown>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;