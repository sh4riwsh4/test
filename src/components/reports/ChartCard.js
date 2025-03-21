
// src/components/reports/ChartCard.jsx
import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { ChartFactory } from './Charts';

const { Text } = Typography;

const ChartCard = ({ chartType, reportData, customTooltip, balanceData, groupingMethod }) => {
  return (
    <Card 
      className="modern-card" 
      title={
        <div className="flex justify-between items-center">
          <span>Finansal Veri Görselleştirme</span>
          <Text type="secondary">
            {groupingMethod === 'daily' ? 'Günlük' : 
            groupingMethod === 'weekly' ? 'Haftalık' : 'Aylık'} Veriler
          </Text>
        </div>
      }
      bodyStyle={{ padding: '12px' }}
    >
      {reportData.length > 0 ? (
        <ChartFactory 
          type={chartType} 
          data={reportData} 
          customTooltip={customTooltip} 
          balanceData={balanceData} 
        />
      ) : (
        <Empty 
          description="Bu tarih aralığında veri bulunmamaktadır"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

export default ChartCard;