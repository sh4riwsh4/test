
// src/components/common/CategoryPieChart.jsx
import React from 'react';
import { Card, Typography, Empty, Progress, Space, Divider } from 'antd';
import { calculateCategoryTotals } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';

const { Title, Text } = Typography;

const CategoryPieChart = ({ title, data, type }) => {
  const categoryTotals = calculateCategoryTotals(data);
  
  const total = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);
  
  const pieData = Object.keys(categoryTotals).map(category => ({
    category,
    value: categoryTotals[category],
    percentage: total > 0 ? Math.round((categoryTotals[category] / total) * 100) : 0
  }));

  // Sort by value in descending order
  pieData.sort((a, b) => b.value - a.value);

  // Get a unique color for each category
  const getColorForIndex = (index) => {
    const colors = [
      '#1890ff', '#13c2c2', '#52c41a', '#faad14', 
      '#722ed1', '#eb2f96', '#fa8c16', '#a0d911',
      '#2f54eb', '#fadb14', '#fa541c', '#391085'
    ];
    return colors[index % colors.length];
  };

  return (
    <Card>
      <Title level={5}>{title}</Title>
      {pieData.length > 0 ? (
        <div>
          {pieData.map((item, index) => (
            <div key={item.category}>
              <Space align="center" style={{ marginBottom: 8, width: '100%' }}>
                <div 
                  style={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: getColorForIndex(index),
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: 8
                  }} 
                />
                <Text style={{ width: 100, display: 'inline-block' }} ellipsis={{ tooltip: item.category }}>
                  {item.category}
                </Text>
                <Progress 
                  percent={item.percentage} 
                  strokeColor={getColorForIndex(index)}
                  style={{ width: '60%', marginRight: 8 }}
                  format={() => `${item.percentage}%`}
                />
                <Text style={{ width: 100, textAlign: 'right' }}>
                  {formatCurrency(item.value)}
                </Text>
              </Space>
              {index < pieData.length - 1 && <Divider style={{ margin: '8px 0' }} />}
            </div>
          ))}
          <Divider />
          <div style={{ textAlign: 'right' }}>
            <Text strong>Total: {formatCurrency(total)}</Text>
          </div>
        </div>
      ) : (
        <Empty description={`No ${type} data available`} />
      )}
    </Card>
  );
};

export default CategoryPieChart;