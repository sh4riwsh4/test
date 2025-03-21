// src/pages/Dashboard.jsx
import React from 'react';
import { 
  Layout, 
  Row, 
  Col, 
  Card, 
  Typography, 
  Tabs,
  Table,
  Space,
  Statistic,
  Button,
  Dropdown,
  Badge
} from 'antd';
import { 
  RiseOutlined, 
  FallOutlined,
  WalletOutlined,
  DollarOutlined,
  MoreOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  CalendarOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useFinancial } from '../contexts/FinancialContext';
import { formatCurrency, formatDate, formatShortDate } from '../utils/formatters';
import { getLastNDays } from '../utils/helpers';
import { calculateCategoryTotals } from '../utils/calculations';
import Chart from 'react-apexcharts';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
  const { 
    selectedCompany, 
    selectedDate, 
    companies,
    getCompanyIncome,
    getCompanyExpenses,
    calculateDailyIncome,
    calculateDailyExpenses,
    calculateDailyProfit,
    income,
    expenses
  } = useFinancial();
  
  // Find selected company data
  const companyData = companies.find(c => c.id === selectedCompany) || {};
  
  // Get income and expenses for selected company and date
  const incomeData = getCompanyIncome(selectedCompany, selectedDate);
  const expensesData = getCompanyExpenses(selectedCompany, selectedDate);
  
  // Calculate totals
  const totalIncome = calculateDailyIncome(selectedCompany, selectedDate);
  const totalExpenses = calculateDailyExpenses(selectedCompany, selectedDate);
  const profit = calculateDailyProfit(selectedCompany, selectedDate);
  
  // Get yesterday's date
  const yesterday = new Date(selectedDate);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Calculate yesterday's totals
  const yesterdayIncome = calculateDailyIncome(selectedCompany, yesterday);
  const yesterdayExpenses = calculateDailyExpenses(selectedCompany, yesterday);
  const yesterdayProfit = calculateDailyProfit(selectedCompany, yesterday);
  
  // Calculate percentage changes
  const incomeChange = yesterdayIncome ? 
    ((totalIncome - yesterdayIncome) / yesterdayIncome * 100).toFixed(1) : 0;
  const expensesChange = yesterdayExpenses ? 
    ((totalExpenses - yesterdayExpenses) / yesterdayExpenses * 100).toFixed(1) : 0;
  const profitChange = yesterdayProfit ? 
    ((profit - yesterdayProfit) / Math.abs(yesterdayProfit) * 100).toFixed(1) : 0;
  
  // Get last 30 days for charts
  const last30Days = getLastNDays(30);
  const last7Days = getLastNDays(7);
  
  const trendData = last30Days.map(day => {
    const dayIncome = calculateDailyIncome(selectedCompany, day);
    const dayExpenses = calculateDailyExpenses(selectedCompany, day);
    const dayProfit = calculateDailyProfit(selectedCompany, day);
    
    return {
      date: formatShortDate(day),
      income: dayIncome,
      expenses: dayExpenses,
      profit: dayProfit
    };
  });
  
  // Prepare data for daily comparison chart (last 7 days)
  const dailyComparisonData = last7Days.map(day => {
    return {
      name: formatShortDate(day),
      income: calculateDailyIncome(selectedCompany, day),
      expenses: calculateDailyExpenses(selectedCompany, day),
      profit: calculateDailyProfit(selectedCompany, day)
    };
  });
  
  // Prepare data for the pie charts
  const incomeCategoryTotals = calculateCategoryTotals(incomeData);
  const incomeChartData = Object.keys(incomeCategoryTotals).map(category => ({
    name: category,
    value: incomeCategoryTotals[category]
  }));
  
  const expenseCategoryTotals = calculateCategoryTotals(expensesData);
  const expenseChartData = Object.keys(expenseCategoryTotals).map(category => ({
    name: category,
    value: expenseCategoryTotals[category]
  }));
  
  const INCOME_COLOR = '#28C76F';
  const EXPENSE_COLOR = '#EA5455';
  const PROFIT_COLOR = '#7367F0';
  const COLORS = ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#00CFE8', '#1E1E1E', '#A8AABD', '#6610F2'];
  
  const trendChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ['#28C76F', '#EA5455', '#7367F0'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'category',
      categories: trendData.map((item) => item.date),
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value),
      },
    },
    legend: {
      position: 'top',
    },
  };
  
  const trendChartSeries = [
    {
      name: 'Gelir',
      data: trendData.map((item) => item.income),
    },
    {
      name: 'Gider',
      data: trendData.map((item) => item.expenses),
    },
    {
      name: 'Kar',
      data: trendData.map((item) => item.profit),
    },
  ];

  const barChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ['#28C76F', '#EA5455', '#7367F0'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: dailyComparisonData.map((item) => item.name),
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
      },
    },
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value),
      },
    },
    legend: {
      position: 'top',
    },
  };
  
  const barChartSeries = [
    {
      name: 'Gelir',
      data: dailyComparisonData.map((item) => item.income),
    },
    {
      name: 'Gider',
      data: dailyComparisonData.map((item) => item.expenses),
    },
    {
      name: 'Kar',
      data: dailyComparisonData.map((item) => item.profit),
    },
  ];

  const pieChartOptions = {
    chart: {
      type: 'pie',
    },
    colors: COLORS,
    labels: incomeChartData.map((item) => item.name),
    tooltip: {
      y: {
        formatter: (value) => formatCurrency(value),
      },
    },
    legend: {
      position: 'bottom',
    },
  };
  
  const pieChartSeries = incomeChartData.map((item) => item.value);
  
  const tableData = last7Days.map(day => {
    const dayIncome = calculateDailyIncome(selectedCompany, day);
    const dayExpenses = calculateDailyExpenses(selectedCompany, day);
    const dayProfit = calculateDailyProfit(selectedCompany, day);
    
    return {
      key: day.toISOString(),
      date: day,
      income: dayIncome,
      expenses: dayExpenses,
      profit: dayProfit
    };
  });
  
  const columns = [
    {
      title: 'Tarih',
      dataIndex: 'date',
      key: 'date',
      render: (date) => formatShortDate(date),
    },
    {
      title: 'Gelir',
      dataIndex: 'income',
      key: 'income',
      render: (amount) => formatCurrency(amount),
    },
    {
      title: 'Gider',
      dataIndex: 'expenses',
      key: 'expenses',
      render: (amount) => formatCurrency(amount),
    },
    {
      title: 'Kar',
      dataIndex: 'profit',
      key: 'profit',
      render: (amount) => (
        <span style={{ color: amount >= 0 ? INCOME_COLOR : EXPENSE_COLOR, fontWeight: '500' }}>
          {formatCurrency(amount)}
        </span>
      ),
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card size="small" style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontWeight: '600' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: '4px 0', fontWeight: '500' }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </Card>
      );
    }
    return null;
  };

  const cardMenuItems = [
    {
      key: '1',
      label: 'Detaylar',
    },
    {
      key: '2',
      label: 'Filtrele',
    },
    {
      key: '3',
      label: 'İndir',
    },
  ];

  return (
    <Content>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Title level={2} style={{ margin: 0, color: '#3A36DB', fontWeight: '600' }}>
            Gösterge Paneli
          </Title>
          <Text type="secondary">
            {companyData.name} şirketi için finansal veriler - {formatDate(selectedDate)}
          </Text>
        </div>
        <Button type="primary" icon={<ReloadOutlined />} shape="round">
          Yenile
        </Button>
      </div>
      
      <Row gutter={[24, 24]}>
        {/* Financial Summary Cards */}
        <Col xs={24} sm={8}>
          <div className="financial-card income-card">
            <div className="financial-card-title">Günlük Gelir</div>
            <div className="financial-card-amount">{formatCurrency(totalIncome)}</div>
            <div className="financial-card-trend">
              {parseFloat(incomeChange) >= 0 ? (
                <>
                  <ArrowUpOutlined style={{ marginRight: 8 }} />
                  <span>{incomeChange}% artış</span>
                </>
              ) : (
                <>
                  <ArrowDownOutlined style={{ marginRight: 8 }} />
                  <span>{Math.abs(parseFloat(incomeChange))}% azalış</span>
                </>
              )}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="financial-card expense-card">
            <div className="financial-card-title">Günlük Gider</div>
            <div className="financial-card-amount">{formatCurrency(totalExpenses)}</div>
            <div className="financial-card-trend">
              {parseFloat(expensesChange) >= 0 ? (
                <>
                  <ArrowUpOutlined style={{ marginRight: 8 }} />
                  <span>{expensesChange}% artış</span>
                </>
              ) : (
                <>
                  <ArrowDownOutlined style={{ marginRight: 8 }} />
                  <span>{Math.abs(parseFloat(expensesChange))}% azalış</span>
                </>
              )}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="financial-card profit-card">
            <div className="financial-card-title">Günlük Kar</div>
            <div className="financial-card-amount">{formatCurrency(profit)}</div>
            <div className="financial-card-trend">
              {parseFloat(profitChange) >= 0 ? (
                <>
                  <ArrowUpOutlined style={{ marginRight: 8 }} />
                  <span>{profitChange}% artış</span>
                </>
              ) : (
                <>
                  <ArrowDownOutlined style={{ marginRight: 8 }} />
                  <span>{Math.abs(parseFloat(profitChange))}% azalış</span>
                </>
              )}
            </div>
          </div>
        </Col>
        
        {/* Financial Trend Chart - Area Chart */}
        <Col xs={24}>
          <Card 
            className="modern-card"
            title={
              <div className="flex justify-between items-center">
                <span>Finansal Trendler (Son 30 Gün)</span>
                <Space>
                  <Button icon={<CalendarOutlined />} size="small">
                    Dönem: Son 30 Gün
                  </Button>
                  <Dropdown menu={{ items: cardMenuItems }} placement="bottomRight">
                    <Button icon={<MoreOutlined />} size="small" />
                  </Dropdown>
                </Space>
              </div>
            }
            bodyStyle={{ padding: '12px' }}
          >


            <Chart
              options={trendChartOptions}
              series={trendChartSeries}
              type="area"
              height={350}
            />;
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            className="modern-card"
            title={
              <div className="flex justify-between items-center">
                <span>Günlük Karşılaştırma (Son 7 Gün)</span>
                <Dropdown menu={{ items: cardMenuItems }} placement="bottomRight">
                  <Button icon={<MoreOutlined />} size="small" />
                </Dropdown>
              </div>
            }
            bodyStyle={{ padding: '12px' }}
          >
            <ResponsiveContainer width="100%" height={300}>
            <Chart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height={350}
            />;
            </ResponsiveContainer>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            className="modern-card"
            title={
              <div className="flex justify-between items-center">
                <span>Kategori Dağılımı</span>
                <Tabs defaultActiveKey="1" style={{ marginBottom: 0 }}>
                  <TabPane tab="Gelir" key="1"></TabPane>
                  <TabPane tab="Gider" key="2"></TabPane>
                </Tabs>
              </div>
            }
            bodyStyle={{ padding: '12px' }}
            extra={
              <Dropdown menu={{ items: cardMenuItems }} placement="bottomRight">
                <Button icon={<MoreOutlined />} size="small" />
              </Dropdown>
            }
          >
            <div style={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {incomeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                    <Chart
                      options={pieChartOptions}
                      series={pieChartSeries}
                      type="pie"
                      height={350}
                    />;
                </ResponsiveContainer>
              ) : (
                <Text>Kategori verileri bulunamadı</Text>
              )}
            </div>
          </Card>
        </Col>
        
        {/* Last 7 Days Table */}
        <Col xs={24}>
          <Card 
            className="modern-card"
            title={
              <div className="flex justify-between items-center">
                <span>Son 7 Gün Özeti</span>
                <Button type="primary" icon={<DownloadOutlined />} size="small">
                  İndir
                </Button>
              </div>
            }
            bodyStyle={{ padding: '12px' }}
          >
            <Table 
              columns={columns} 
              dataSource={tableData} 
              pagination={false}
              className="modern-table"
              size="middle"
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Dashboard;