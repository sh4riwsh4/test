// src/components/Layout/Header.jsx
import React from 'react';
import { Layout, Typography, Space, Avatar, Select, DatePicker, Badge, Button, Dropdown } from 'antd';
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  BellOutlined, 
  UserOutlined, 
  SettingOutlined,
  DownOutlined
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
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Space size={16}>
            <Select
              value={selectedCompany}
              style={{ width: 180 }}
              onChange={handleCompanyChange}
              bordered={false}
              suffixIcon={<DownOutlined style={{ color: '#3A36DB' }} />}
              dropdownStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
              {/* "Hepsi" seçeneği */}
              <Option key="all" value="all">
                <Space>
                  <Avatar 
                    size="small" 
                    style={{ backgroundColor: '#3A36DB' }}
                  >
                    H
                  </Avatar>
                  Hepsi
                </Space>
              </Option>
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
      </div>
    </AntHeader>
  );
};

export default Header;