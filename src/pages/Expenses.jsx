// src/pages/Expenses.jsx
import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Card, 
  Button, 
  Modal,
  Space,
  Empty,
  Row,
  Col,
  Statistic,
  Badge,
  Avatar,
  Tag,
  Divider,
  Dropdown,
  DatePicker,
  Radio,
  Segmented
} from 'antd';
import { 
  PlusOutlined, 
  DownloadOutlined, 
  FilterOutlined, 
  SearchOutlined,
  MoreOutlined,
  ArrowDownOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useFinancial } from '../contexts/FinancialContext';
import FinancialTable from '../components/common/FinancialTable';
import ExpenseForm from '../components/forms/ExpenseForm';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { calculateCategoryTotals } from '../utils/calculations';
import dayjs from 'dayjs';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Expenses = () => {
  const { 
    selectedCompany, 
    selectedDate, 
    companies,
    getCompanyExpenses,
    addExpense,
    editExpense,
    deleteExpense,
    expenses
  } = useFinancial();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [timeRange, setTimeRange] = useState('day');
  const [dateRange, setDateRange] = useState([
    dayjs(selectedDate).subtract(30, 'day'), 
    dayjs(selectedDate)
  ]);
  
  // Find selected company data
  const companyData = companies.find(c => c.id === selectedCompany) || {};
  
  // Filter expenses based on time range
  const getFilteredExpenses = () => {
    if (timeRange === 'day') {
      return getCompanyExpenses(selectedCompany, selectedDate);
    } else {
      const startDate = dateRange[0]?.toDate() || new Date();
      const endDate = dateRange[1]?.toDate() || new Date();
      
      return expenses.filter(item => 
        item.companyId === selectedCompany && 
        new Date(item.date) >= startDate.setHours(0, 0, 0, 0) && 
        new Date(item.date) <= endDate.setHours(23, 59, 59, 999)
      );
    }
  };
  
  const expensesData = getFilteredExpenses();
  
  // Calculate total expenses
  const totalExpenses = expensesData.reduce((sum, item) => sum + item.amount, 0);
  
  // Get category totals
  const categoryTotals = calculateCategoryTotals(expensesData);
  
  // Prepare pie chart data
  const pieData = Object.keys(categoryTotals).map(category => ({
    name: category,
    value: categoryTotals[category]
  }));
  
  // Colors for charts
  const COLORS = ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#00CFE8', '#1E1E1E', '#A8AABD', '#6610F2'];

  const showAddModal = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleFormFinish = (values) => {
    if (editingRecord) {
      editExpense(editingRecord.id, values);
    } else {
      addExpense(values);
    }
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleDelete = (id) => {
    deleteExpense(id);
  };

  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  const cardMenuItems = [
    {
      key: '1',
      label: 'Filtrele',
    },
    {
      key: '2',
      label: 'Excel Olarak İndir',
    },
    {
      key: '3',
      label: 'PDF Olarak İndir',
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card size="small" style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontWeight: '600' }}>{payload[0].name}</p>
          <p style={{ color: payload[0].color, margin: '4px 0', fontWeight: '500' }}>
            {formatCurrency(payload[0].value)} ({((payload[0].value / totalExpenses) * 100).toFixed(1)}%)
          </p>
        </Card>
      );
    }
    return null;
  };

  // Get time range display text
  const getTimeRangeText = () => {
    if (timeRange === 'day') {
      return `${formatDate(selectedDate)} tarihli`;
    } else if (timeRange === 'custom' && dateRange.length === 2) {
      return `${formatDate(dateRange[0].toDate())} - ${formatDate(dateRange[1].toDate())} aralığındaki`;
    } else if (timeRange === 'month') {
      return `${dayjs(selectedDate).format('MMMM YYYY')} ayındaki`;
    } else if (timeRange === 'year') {
      return `${dayjs(selectedDate).format('YYYY')} yılındaki`;
    }
    return '';
  };

  return (
    <Content>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Title level={2} style={{ margin: 0, color: '#EA5455', fontWeight: '600' }}>
            Gider Yönetimi
          </Title>
          <Text type="secondary">
            {companyData.name} şirketi için {getTimeRangeText()} gider kayıtları
          </Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showAddModal}
          shape="round"
          size="large"
          style={{ background: '#EA5455', borderColor: '#EA5455' }}
        >
          Gider Ekle
        </Button>
      </div>
      
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card className="modern-card">
            <Row gutter={16} align="middle">
              <Col>
                <Text strong>Zaman Aralığı:</Text>
              </Col>
              <Col>
                <Segmented
                  options={[
                    { label: 'Günlük', value: 'day' },
                    { label: 'Aylık', value: 'month' },
                    { label: 'Yıllık', value: 'year' },
                    { label: 'Özel', value: 'custom' }
                  ]}
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                />
              </Col>
              {timeRange === 'custom' && (
                <Col flex="auto">
                  <RangePicker 
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    style={{ width: '100%' }}
                  />
                </Col>
              )}
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Card 
            className="modern-card" 
            title={
              <div className="flex justify-between items-center">
                <span>Gider Kayıtları</span>
                <Space>
                  <Button icon={<SearchOutlined />} shape="round" size="small">
                    Ara
                  </Button>
                  <Button icon={<FilterOutlined />} shape="round" size="small">
                    Filtrele
                  </Button>
                  <Dropdown menu={{ items: cardMenuItems }} placement="bottomRight">
                    <Button icon={<MoreOutlined />} shape="round" size="small" />
                  </Dropdown>
                </Space>
              </div>
            }
            bodyStyle={{ padding: '12px' }}
          >
            {expensesData.length > 0 ? (
              <FinancialTable 
                data={expensesData} 
                type="expense"
                onEdit={showEditModal}
                onDelete={handleDelete}
              />
            ) : (
              <Empty 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{ height: 60 }}
                description={
                  <Text>
                    Seçilen tarih aralığında gider kaydı bulunmamaktadır
                  </Text>
                }
              >
                <Button type="primary" onClick={showAddModal} icon={<PlusOutlined />} style={{ background: '#EA5455', borderColor: '#EA5455' }}>
                  Gider Ekle
                </Button>
              </Empty>
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Row gutter={[0, 24]}>
            <Col xs={24}>
              <Card className="modern-card" bodyStyle={{ padding: '24px' }}>
                <Statistic
                  title="Toplam Gider"
                  value={totalExpenses}
                  precision={2}
                  valueStyle={{ color: '#EA5455', fontWeight: '600', fontSize: '28px' }}
                  prefix={<ArrowDownOutlined />}
                  suffix="TL"
                />
                <Divider style={{ margin: '16px 0' }} />
                <Paragraph>
                  <Text type="secondary">
                    {expensesData.length} adet gider kaydı {getTimeRangeText()} oluşturuldu.
                  </Text>
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24}>
              <Card 
                className="modern-card" 
                title="Kategori Bazında Giderler"
                bodyStyle={{ padding: '12px' }}
              >
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#EA5455"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend layout="vertical" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Kategori verisi bulunmamaktadır"
                  />
                )}
              </Card>
            </Col>
            
            <Col xs={24}>
              <Card 
                className="modern-card" 
                title="Son Gider Kayıtları"
                bodyStyle={{ padding: '12px' }}
                extra={<a href="#">Tümünü Gör</a>}
              >
                {expensesData.slice(0, 3).map((item, index) => (
                  <div key={item.id} style={{ marginBottom: index < expensesData.length - 1 ? '16px' : 0 }}>
                    <div className="flex justify-between items-center">
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          style={{ 
                            backgroundColor: COLORS[index % COLORS.length],
                            marginRight: '12px'
                          }}
                        >
                          {item.category[0]}
                        </Avatar>
                        <div>
                          <Text strong>{item.category}</Text>
                          <div>
                            <Text type="secondary">{item.description}</Text>
                          </div>
                        </div>
                      </div>
                      <Text strong style={{ color: '#EA5455' }}>
                        {formatCurrency(item.amount)}
                      </Text>
                    </div>
                    {index < Math.min(expensesData.length, 3) - 1 && <Divider style={{ margin: '16px 0 0 0' }} />}
                  </div>
                ))}
                {expensesData.length === 0 && (
                  <Empty 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Kayıt bulunmamaktadır"
                  />
                )}
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        title={editingRecord ? 'Gider Düzenle' : 'Gider Ekle'}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        destroyOnClose
        width={600}
        bodyStyle={{ padding: '24px' }}
        style={{ top: 20 }}
      >
        <ExpenseForm
          record={editingRecord}
          onFinish={handleFormFinish}
          onCancel={handleModalCancel}
        />
      </Modal>
    </Content>
  );
};

export default Expenses;