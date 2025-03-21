import React, { useState } from 'react';
import { 
  Layout, 
  Typography, 
  Button, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Divider,
  Table, 
  Empty,
  Radio,
  DatePicker,
  Dropdown,
  Space,
  Segmented
} from 'antd';
import { 
  BarChartOutlined, 
  LineChartOutlined, 
  AreaChartOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
  FileExcelOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useFinancial } from '../contexts/FinancialContext';
import { formatCurrency, formatDate, formatShortDate } from '../utils/formatters';
import { generateDateRange } from '../utils/helpers';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  ScatterChart, 
  Scatter, 
  ZAxis,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Reports = () => {
  const { 
    companies,
    selectedCompany,
    income,
    expenses
  } = useFinancial();
  
  const [timeRange, setTimeRange] = useState('month');
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(1, 'month'),
    dayjs()
  ]);
  
  const [chartType, setChartType] = useState('bar');
  
  // Find selected company data
  const companyData = companies.find(c => c.id === selectedCompany) || {};
  
  const getDateRangeFromTimeRange = () => {
    const allDates = [
      ...income.map(item => new Date(item.date)),
      ...expenses.map(item => new Date(item.date))
    ];
    
    const latestDate = allDates.length > 0 
      ? new Date(Math.max(...allDates))
      : new Date();
    
    const end = dayjs(latestDate).isAfter(dayjs()) 
      ? dayjs() 
      : dayjs(latestDate);
    
    const start = end.subtract(5, 'year');
    
    switch (timeRange) {
      case 'week':
        return [end.subtract(7, 'day').toDate(), end.toDate()];
      case 'month':
        return [end.subtract(1, 'month').toDate(), end.toDate()];
      case 'quarter':
        return [end.subtract(3, 'month').toDate(), end.toDate()];
      case 'halfyear':
        return [end.subtract(6, 'month').toDate(), end.toDate()];
      case 'year':
        return [end.subtract(1, 'year').toDate(), end.toDate()];
      case 'custom':
        const customStart = dayjs(dateRange[0]).isAfter(dayjs()) 
          ? dayjs() 
          : dayjs(dateRange[0]);
        const customEnd = dayjs(dateRange[1]).isAfter(dayjs()) 
          ? dayjs() 
          : dayjs(dateRange[1]);
        return [customStart.toDate(), customEnd.toDate()];
      default:
        return [start.toDate(), end.toDate()];
    }
  };
  
  const activeDateRange = getDateRangeFromTimeRange();
  
  const datesList = generateDateRange(activeDateRange[0], activeDateRange[1]);
  
  const getGroupingMethod = () => {
    const days = Math.round((activeDateRange[1] - activeDateRange[0]) / (1000 * 60 * 60 * 24));
    
    if (days <= 31) return 'daily';
    if (days <= 90) return 'weekly';
    return 'monthly';
  };
  
  const groupingMethod = getGroupingMethod();
  
  function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }
  
  const groupData = (data, method) => {
    if (method === 'daily') {
      return data;
    } else if (method === 'weekly') {
      const weekMap = {};
      
      data.forEach(day => {
        const date = new Date(day.date);
        const weekNumber = getWeekNumber(date);
        const weekKey = `${date.getFullYear()}-W${weekNumber}`;
        
        if (!weekMap[weekKey]) {
          weekMap[weekKey] = {
            dateString: `${formatShortDate(date)} Haftası`,
            startDate: new Date(date),
            income: 0,
            expenses: 0,
            profit: 0,
            balance: 0
          };
        }
        
        weekMap[weekKey].income += day.income;
        weekMap[weekKey].expenses += day.expenses;
        weekMap[weekKey].profit += day.profit;
        weekMap[weekKey].balance += day.balance;
      });
      
      return Object.values(weekMap).sort((a, b) => a.startDate - b.startDate);
    } else {
      const monthMap = {};
      
      data.forEach(day => {
        const date = new Date(day.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        
        if (!monthMap[monthKey]) {
          monthMap[monthKey] = {
            dateString: dayjs(date).format('MMMM YYYY'),
            startDate: new Date(date),
            income: 0,
            expenses: 0,
            profit: 0,
            balance: 0
          };
        }
        
        monthMap[monthKey].income += day.income;
        monthMap[monthKey].expenses += day.expenses;
        monthMap[monthKey].profit += day.profit;
        monthMap[monthKey].balance += day.balance;
      });
      
      return Object.values(monthMap).sort((a, b) => a.startDate - b.startDate);
    }
  };
  
  const prepareReportData = () => {
    const filteredIncome = selectedCompany === 'all'
      ? income.filter(
          item => new Date(item.date) >= activeDateRange[0] && 
                  new Date(item.date) <= activeDateRange[1]
        )
      : income.filter(
          item => item.companyId === selectedCompany && 
                  new Date(item.date) >= activeDateRange[0] && 
                  new Date(item.date) <= activeDateRange[1]
        );
  
    const filteredExpenses = selectedCompany === 'all'
      ? expenses.filter(
          item => new Date(item.date) >= activeDateRange[0] && 
                  new Date(item.date) <= activeDateRange[1]
        )
      : expenses.filter(
          item => item.companyId === selectedCompany && 
                  new Date(item.date) >= activeDateRange[0] && 
                  new Date(item.date) <= activeDateRange[1]
        );
  
    const dailyData = datesList.map(date => {
      const dailyIncome = filteredIncome.filter(
        item => new Date(item.date).toDateString() === date.toDateString()
      );
      
      const dailyExpenses = filteredExpenses.filter(
        item => new Date(item.date).toDateString() === date.toDateString()
      );
      
      const totalIncome = dailyIncome.reduce((sum, item) => sum + item.amount, 0);
      const totalExpenses = dailyExpenses.reduce((sum, item) => sum + item.amount, 0);
      const profit = totalIncome - totalExpenses;
      
      return {
        date,
        dateString: formatShortDate(date),
        income: totalIncome,
        expenses: totalExpenses,
        profit,
        balance: totalIncome - totalExpenses
      };
    });
    
    return groupData(dailyData, groupingMethod);
  };
  
  const reportData = prepareReportData();
  
  const totalIncome = reportData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = reportData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalIncome - totalExpenses;
  
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
  
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };
  
  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };
  
  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };
  
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
  
  const getTimeRangeDisplayText = () => {
    if (timeRange === 'custom' && dateRange.length === 2) {
      return `${formatDate(dateRange[0].toDate())} - ${formatDate(dateRange[1].toDate())}`;
    } else if (timeRange === 'week') {
      return 'Son 7 Gün';
    } else if (timeRange === 'month') {
      return 'Son 30 Gün';
    } else if (timeRange === 'quarter') {
      return 'Son 3 Ay';
    } else if (timeRange === 'halfyear') {
      return 'Son 6 Ay';
    } else if (timeRange === 'year') {
      return 'Son 1 Yıl';
    }
    return '';
  };
  
  const renderChart = () => {
    const COLORS = {
      income: '#28C76F',
      expense: '#EA5455',
      profit: '#7367F0'
    };
    
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={reportData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="dateString" axisLine={false} />
              <YAxis axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar name="Gelir" dataKey="income" fill={COLORS.income} radius={[4, 4, 0, 0]} />
              <Bar name="Gider" dataKey="expenses" fill={COLORS.expense} radius={[4, 4, 0, 0]} />
              <Bar name="Kar" dataKey="profit" fill={COLORS.profit} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={reportData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateString" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" name="Gelir" dataKey="income" stroke={COLORS.income} activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" name="Gider" dataKey="expenses" stroke={COLORS.expense} activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" name="Kar" dataKey="profit" stroke={COLORS.profit} activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={reportData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.income} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.income} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.expense} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.expense} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.profit} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS.profit} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="dateString" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" name="Gelir" dataKey="income" stroke={COLORS.income} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" name="Gider" dataKey="expenses" stroke={COLORS.expense} fillOpacity={1} fill="url(#colorExpenses)" />
              <Area type="monotone" name="Kar" dataKey="profit" stroke={COLORS.profit} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };
  
  const exportMenuItems = [
    {
      key: '1',
      label: 'Excel Olarak İndir',
      icon: <FileExcelOutlined />,
    },
    {
      key: '2',
      label: 'PDF Olarak İndir',
      icon: <FilePdfOutlined />,
    },
  ];
  
  const renderAdditionalCharts = () => {
    const pieChartData = [
      { name: 'Gelir', value: totalIncome },
      { name: 'Gider', value: totalExpenses },
      { name: 'Kar', value: totalProfit }
    ];
    
    const cashFlow = totalIncome - totalExpenses;
    const investmentAmount = totalProfit * 0.2;
    
    const radarChartData = [
      { subject: 'Gelir', A: totalIncome, fullMark: Math.max(totalIncome, totalExpenses, totalProfit) * 1.2 },
      { subject: 'Gider', A: totalExpenses, fullMark: Math.max(totalIncome, totalExpenses, totalProfit) * 1.2 },
      { subject: 'Kar', A: totalProfit, fullMark: Math.max(totalIncome, totalExpenses, totalProfit) * 1.2 },
      { subject: 'Nakit Akışı', A: cashFlow, fullMark: Math.max(totalIncome, totalExpenses, totalProfit) * 1.2 },
      { subject: 'Yatırım', A: investmentAmount, fullMark: Math.max(totalIncome, totalExpenses, totalProfit) * 1.2 },
    ];
    
    const scatterData = reportData.map(item => ({
      x: item.income,
      y: item.expenses,
      z: item.profit
    }));
    
    const COLORS = {
      income: '#28C76F',
      expense: '#EA5455',
      profit: '#7367F0'
    };
    
    return (
      <>
          <Col xs={24} md={8}>
            <Card className="modern-card" title="Gelir-Gider-Kar Dağılımı">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value), '']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="modern-card" title="Performans Metrikleri">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Performans" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip 
                    formatter={(value) => [new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value), '']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="modern-card" title="Gelir-Gider İlişkisi">
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Gelir" unit=" TL" />
                  <YAxis type="number" dataKey="y" name="Gider" unit=" TL" />
                  <ZAxis type="number" dataKey="z" name="Kar" unit=" TL" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    formatter={(value, name) => [new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value), name]}
                  />
                  <Scatter name="Gelir-Gider İlişkisi" data={scatterData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </>
      );
    };
    
    return (
      <Content>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <Title level={2} style={{ margin: 0, color: '#7367F0', fontWeight: '600' }}>
              Finansal Raporlar
            </Title>
            <Text type="secondary">
              {companyData.name} şirketi için {getTimeRangeDisplayText()} finansal raporu
            </Text>
          </div>
          <Space>
            <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                shape="round"
              >
                Raporu İndir
              </Button>
            </Dropdown>
          </Space>
        </div>
        
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <Card className="modern-card">
              <Row gutter={16}>
                <Col span={24}>
                  <Row align="middle" gutter={[16, 16]}>
                    <Col xs={24} sm={4}>
                      <Text strong>Zaman Aralığı:</Text>
                    </Col>
                    <Col xs={24} sm={20}>
                      <Segmented
                        options={[
                          { label: '7 Gün', value: 'week' },
                          { label: '30 Gün', value: 'month' },
                          { label: '3 Ay', value: 'quarter' },
                          { label: '6 Ay', value: 'halfyear' },
                          { label: '1 Yıl', value: 'year' },
                          { label: 'Özel', value: 'custom' }
                        ]}
                        value={timeRange}
                        onChange={handleTimeRangeChange}
                        style={{ display: 'block', width: '100%' }}
                      />
                    </Col>
                  </Row>
                  {timeRange === 'custom' && (
                    <Row style={{ marginTop: 16 }}>
                      <Col xs={24} sm={{ span: 20, offset: 4 }}>
                      <RangePicker 
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                        style={{ width: '100%' }}
                      />
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
          
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
                <Text strong>{getTimeRangeDisplayText()}</Text>
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
                <Text strong>{reportData.length} Dönem</Text>
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
          
          {renderAdditionalCharts()}
          
          <Col xs={24}>
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
              extra={
                <Radio.Group onChange={handleChartTypeChange} value={chartType} buttonStyle="solid">
                  <Radio.Button value="bar"><BarChartOutlined /> Çubuk</Radio.Button>
                  <Radio.Button value="line"><LineChartOutlined /> Çizgi</Radio.Button>
                  <Radio.Button value="area"><AreaChartOutlined /> Alan</Radio.Button>
                </Radio.Group>
              }
              bodyStyle={{ padding: '12px' }}
            >
              {reportData.length > 0 ? (
                renderChart()
              ) : (
                <Empty 
                  description="Bu tarih aralığında veri bulunmamaktadır"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>
          
          {/* Data Table */}
          <Col xs={24}>
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
                dataSource={reportData.map((item, index) => ({
                  ...item,
                  key: index
                }))} 
                pagination={{ pageSize: 10 }}
                className="modern-table"
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
          </Col>
        </Row>
      </Content>
    );
  };
  
  export default Reports;