import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatCurrency, formatDate } from '../../utils/formatters';

const FinancialTable = ({ 
  data, 
  type, 
  onEdit, 
  onDelete,
  loading = false 
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const getCategoryColor = (category) => {
    const colors = {
      'Sales': 'green',
      'Services': 'blue',
      'Investments': 'purple',
      'Rent': 'red',
      'Salaries': 'orange',
      'Utilities': 'cyan',
      'Marketing': 'geekblue',
      'Supplies': 'gold'
    };
    
    return colors[category] || 'default';
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => formatDate(text),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text) => (
        <Tag color={getCategoryColor(text)}>{text}</Tag>
      ),
      filters: [...new Set(data.map(item => item.category))].map(category => ({
        text: category,
        value: category,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => formatCurrency(text),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title={`Are you sure you want to delete this ${type}?`}
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data.map(item => ({ ...item, key: item.id }))}
      loading={loading}
      size="middle"
    />
  );
};

export default FinancialTable;