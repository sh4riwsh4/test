// src/components/reports/TimeRangeSelector.jsx
import React from 'react';
import { Card, Row, Col, Typography, Segmented, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const TimeRangeSelector = ({ timeRange, dateRange, onTimeRangeChange, onDateRangeChange }) => {
return (
  <>
    <Col>
      <Text strong>Zaman Aralığı:</Text>
    </Col>
    <Col xs={24} md={6}>
    <Row gutter={[8, 8]}>
  {['week', 'month', 'quarter', 'halfyear', 'year', 'custom'].map(value => (
    <Col key={value}>
      <Button 
        type={timeRange === value ? 'primary' : 'default'}
        onClick={() => onTimeRangeChange(value)}
      >
        {value === 'week' && '7 Gün'}
        {value === 'month' && '30 Gün'}
        {value === 'quarter' && '3 Ay'}
        {value === 'halfyear' && '6 Ay'}
        {value === 'year' && '1 Yıl'}
        {value === 'custom' && 'Özel'}
      </Button>
    </Col>
  ))}
</Row>
    </Col>
    {timeRange === 'custom' && (
      <Col xs={24} md={8}>
        <RangePicker 
          value={dateRange}
          onChange={onDateRangeChange}
          style={{ width: '100%' }}
        />
      </Col>
    )}
  </>
);
};

export default TimeRangeSelector;
