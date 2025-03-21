

// src/components/Layout/Footer.jsx
import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = () => {
  return (
    <AntFooter className="app-footer">
      <Text type="secondary">Financial Tracker ©{new Date().getFullYear()} | Modern Finans Çözümleri</Text>
    </AntFooter>
  );
};

export default Footer;