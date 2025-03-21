
// src/components/reports/DataTable.jsx
import React from 'react';
import { Card, Button, Table, Typography } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/formatters';

const { Text } = Typography;

const DataTable = ({ data, totalIncome, totalExpenses, totalProfit }) => {
  const columns = [
    {
      title: 'Tarih',
      dataIndex: 'dateString',
      key: 'dateString',
    },
    {
      title: 'Gelir',
      dataIndex: 'income',
      key: 'income',
      render: (amount) => formatCurrency(amount),
      sorter: (a, b) => a.income - b.income,
    },
    {
      title: 'Gider',
      dataIndex: 'expenses',
      key: 'expenses',
      render: (amount) => formatCurrency(amount),
      sorter: (a, b) => a.expenses - b.expenses,
    },
    {
      title: 'Kar',
      dataIndex: 'profit',
      key: 'profit',
      render: (amount) => (
        <span style={{ color: amount >= 0 ? '#28C76F' : '#EA5455', fontWeight: '500' }}>
          {formatCurrency(amount)}
        </span>
      ),
      sorter: (a, b) => a.profit - b.profit,
    },
    {
      title: 'Bilanço',
      dataIndex: 'balance',
      key: 'balance',
      render: (amount) => (
        <span style={{ color: amount >= 0 ? '#28C76F' : '#EA5455', fontWeight: '500' }}>
          {formatCurrency(amount)}
        </span>
      ),
      sorter: (a, b) => a.balance - b.balance,
    },
  ];

  return (
    <Card 
      className="modern-card" 
      title={
        <div className="flex justify-between items-center">
          <span>Detaylı Finansal Veriler</span>
          <Button icon={<DownloadOutlined />} size="small">
            Tabloyu İndir
          </Button>
        </div>
      }
      bodyStyle={{ padding: '12px' }}
    >
      <Table 
        columns={columns} 
        dataSource={data.map((item, index) => ({
          ...item,
          key: index
        }))} 
        pagination={{ pageSize: 10 }}
        summary={() => (
          <Table.Summary>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <strong>Toplam</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>{formatCurrency(totalIncome)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <strong>{formatCurrency(totalExpenses)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <strong style={{ color: totalProfit >= 0 ? '#28C76F' : '#f5222d' }}>
                  {formatCurrency(totalProfit)}
                </strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <strong style={{ color: totalProfit >= 0 ? '#28C76F' : '#f5222d' }}>
                  {formatCurrency(totalProfit)}
                </strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
};

export default DataTable;