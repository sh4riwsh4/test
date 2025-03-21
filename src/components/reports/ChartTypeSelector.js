
// src/components/reports/ChartTypeSelector.jsx
import React from 'react';
import { Col, Typography, Radio } from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  PieChartOutlined,
  AreaChartOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const ChartTypeSelector = ({ chartType, onChartTypeChange }) => {
  return (
    <>
      <Col>
        <Text strong style={{ marginLeft: 16 }}>Grafik Tipi:</Text>
      </Col>
      <Col xs={24} md="auto">
        <Radio.Group 
          value={chartType} 
          onChange={(e) => onChartTypeChange(e.target.value)} 
          buttonStyle="solid"
        >
          <Radio.Button value="bar"><BarChartOutlined /> Çubuk</Radio.Button>
          <Radio.Button value="line"><LineChartOutlined /> Çizgi</Radio.Button>
          <Radio.Button value="area"><AreaChartOutlined /> Alan</Radio.Button>
          <Radio.Button value="combined">Birleşik</Radio.Button>
          <Radio.Button value="balance">Bakiye</Radio.Button>
          <Radio.Button value="pie"><PieChartOutlined /> Pasta</Radio.Button>
        </Radio.Group>
      </Col>
    </>
  );
};

export default ChartTypeSelector;