
import React from 'react';
import { Row, Col, Card, Statistic, Divider, Typography } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/formatters';

const { Text } = Typography;

const FinancialSummary = ({ totalIncome, totalExpenses, totalProfit, timeRangeText, recordCount }) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} md={8}>
        <Card className="modern-card" bodyStyle={{ padding: '24px' }}>
          <Statistic
            title="Toplam Gelir"
            value={totalIncome}
            precision={2}
            valueStyle={{ color: '#28C76F', fontWeight: '600', fontSize: '28px' }}
            prefix={<RiseOutlined />}
            suffix="TL"
          />
          <Divider style={{ margin: '16px 0' }} />
          <div className="flex justify-between">
            <Text type="secondary">Tarih Aralığı</Text>
            <Text strong>{timeRangeText}</Text>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} md={8}>
        <Card className="modern-card" bodyStyle={{ padding: '24px' }}>
          <Statistic
            title="Toplam Gider"
            value={totalExpenses}
            precision={2}
            valueStyle={{ color: '#EA5455', fontWeight: '600', fontSize: '28px' }}
            prefix={<FallOutlined />}
            suffix="TL"
          />
          <Divider style={{ margin: '16px 0' }} />
          <div className="flex justify-between">
            <Text type="secondary">Kayıt Sayısı</Text>
            <Text strong>{recordCount} Dönem</Text>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} md={8}>
        <Card className="modern-card" bodyStyle={{ padding: '24px' }}>
          <Statistic
            title="Net Kar"
            value={totalProfit}
            precision={2}
            valueStyle={{ 
              color: totalProfit >= 0 ? '#28C76F' : '#EA5455', 
              fontWeight: '600', 
              fontSize: '28px' 
            }}
            prefix={totalProfit >= 0 ? <RiseOutlined /> : <FallOutlined />}
            suffix="TL"
          />
          <Divider style={{ margin: '16px 0' }} />
          <div className="flex justify-between">
            <Text type="secondary">Kar Marjı</Text>
            <Text 
              strong 
              style={{ color: totalProfit >= 0 ? '#28C76F' : '#EA5455' }}
            >
              {totalIncome > 0 ? `${((totalProfit / totalIncome) * 100).toFixed(2)}%` : '0%'}
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default FinancialSummary;