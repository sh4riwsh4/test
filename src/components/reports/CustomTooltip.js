
// src/components/reports/CustomTooltip.jsx
import React from 'react';
import { Card } from 'antd';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card size="small" style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: '8px' }}>
        <p className="label" style={{ margin: 0, fontWeight: '600' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, margin: '5px 0', fontWeight: '500' }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </Card>
    );
  }
  return null;
};

export default CustomTooltip;