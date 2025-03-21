// src/components/common/FinancialCard.jsx
import React from 'react';
import { Card, Statistic, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/formatters';

const { Title } = Typography;

const FinancialCard = ({ title, amount, increase, type }) => {
  const isPositive = increase >= 0;
  
  const getIcon = () => {
    if (type === 'income') return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
    if (type === 'expense') return <ArrowDownOutlined style={{ color: '#f5222d' }} />;
    return isPositive ? 
      <ArrowUpOutlined style={{ color: '#52c41a' }} /> : 
      <ArrowDownOutlined style={{ color: '#f5222d' }} />;
  };
  
  const getColor = () => {
    if (type === 'income') return '#52c41a';
    if (type === 'expense') return '#f5222d';
    return amount >= 0 ? '#52c41a' : '#f5222d';
  };

  return (
    <Card style={{ height: '100%' }}>
      <Title level={5}>{title}</Title>
      <Statistic
        value={amount}
        precision={2}
        valueStyle={{ color: getColor() }}
        prefix={getIcon()}
        formatter={(value) => formatCurrency(value).replace('₺', 'TL')}
      />
      {increase !== undefined && (
        <Typography.Text 
          type={isPositive ? 'success' : 'danger'}
          style={{ display: 'block', marginTop: 8 }}
        >
          {isPositive ? '+' : ''}{increase}% from yesterday
        </Typography.Text>
      )}
    </Card>
  );
};

export default FinancialCard;