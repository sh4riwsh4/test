// src/components/Layout/Header.jsx
import React from 'react';
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

  const handleCompanyChange = (value) => {
    setSelectedCompany(value);
  };

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date.toDate());
    }
  };

  // Get selected company data (used for display or future functionality)
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

  // Menu for mobile dropdown
  const mobileMenu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Tarih Seçin',
          icon: <CalendarOutlined />,
          children: [
            {
              key: '1-1',
              label: <DatePicker 
                value={dayjs(selectedDate)}
                onChange={handleDateChange} 
                allowClear={false}
                bordered={false}
              />
            }
          ]
        },
        {
          key: '2',
          label: 'Şirket Seçin',
          icon: <AppstoreOutlined />,
          children: companies.map(company => ({
            key: `company-${company.id}`,
            label: company.name,
            onClick: () => handleCompanyChange(company.id)
          }))
        },
        ...notificationMenuItems,
        ...userMenuItems
      ]}
    />
  );

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
          <Title level={4} style={{ margin: 0, color: '#3A36DB', display: 'none', '@media (min-width: 576px)': { display: 'block' } }}>
            Financial Tracker
          </Title>
          <Title level={4} style={{ margin: 0, color: '#3A36DB', display: 'block', '@media (min-width: 576px)': { display: 'none' } }}>
            FT
          </Title>
        </div>
        
        {/* Desktop Controls - Hidden on Mobile */}
        <div className="desktop-controls" style={{ display: 'none', '@media (min-width: 768px)': { display: 'flex' } }}>
          <Space size={16}>
            <Select
              value={selectedCompany}
              style={{ width: 180 }}
              onChange={handleCompanyChange}
              bordered={false}
              suffixIcon={<DownOutlined style={{ color: '#3A36DB' }} />}
              dropdownStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
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
              style={{ boxShadow: 'none' }}
            />
            
            <Dropdown
              menu={{ items: notificationMenuItems }}
              placement="bottomRight"
              trigger={['click']}
              overlayStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
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
              overlayStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
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
        </div>
        
        {/* Mobile Menu Button - Visible only on Mobile */}
        <div className="mobile-menu" style={{ display: 'flex', '@media (min-width: 768px)': { display: 'none' } }}>
          <Dropdown overlay={mobileMenu} trigger={['click']}>
            <Button type="text" icon={<AppstoreOutlined style={{ fontSize: '20px' }} />} />
          </Dropdown>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
