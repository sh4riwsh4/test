// src/components/reports/Charts.jsx
import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  ComposedChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Card, Row, Col } from 'antd';

// Sabit renkler
const COLORS = {
  income: '#28C76F',
  expense: '#EA5455',
  profit: '#7367F0',
  balance: '#00CFE8',
  cumulative: '#FF9F43',
  pieColors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#00CFE8', '#1E1E1E', '#A8AABD', '#6610F2']
};

// Bar Chart Component
export const BarChartComponent = ({ data, customTooltip }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="dateString" axisLine={false} />
      <YAxis axisLine={false} />
      <Tooltip content={customTooltip} />
      <Legend />
      <Bar name="Gelir" dataKey="income" fill={COLORS.income} radius={[4, 4, 0, 0]} />
      <Bar name="Gider" dataKey="expenses" fill={COLORS.expense} radius={[4, 4, 0, 0]} />
      <Bar name="Kar" dataKey="profit" fill={COLORS.profit} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

// Line Chart Component
export const LineChartComponent = ({ data, customTooltip }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="dateString" />
      <YAxis />
      <Tooltip content={customTooltip} />
      <Legend />
      <Line type="monotone" name="Gelir" dataKey="income" stroke={COLORS.income} activeDot={{ r: 8 }} strokeWidth={2} />
      <Line type="monotone" name="Gider" dataKey="expenses" stroke={COLORS.expense} activeDot={{ r: 8 }} strokeWidth={2} />
      <Line type="monotone" name="Kar" dataKey="profit" stroke={COLORS.profit} activeDot={{ r: 8 }} strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

// Area Chart Component
export const AreaChartComponent = ({ data, customTooltip }) => (
  <ResponsiveContainer width="100%" height={400}>
    <AreaChart
      data={data}
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
      <Tooltip content={customTooltip} />
      <Legend />
      <Area type="monotone" name="Gelir" dataKey="income" stroke={COLORS.income} fillOpacity={1} fill="url(#colorIncome)" />
      <Area type="monotone" name="Gider" dataKey="expenses" stroke={COLORS.expense} fillOpacity={1} fill="url(#colorExpenses)" />
      <Area type="monotone" name="Kar" dataKey="profit" stroke={COLORS.profit} fillOpacity={1} fill="url(#colorProfit)" />
    </AreaChart>
  </ResponsiveContainer>
);

// Composed Chart Component
export const ComposedChartComponent = ({ data, customTooltip }) => (
  <ResponsiveContainer width="100%" height={400}>
    <ComposedChart
      data={data}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    >
      <CartesianGrid stroke="#f5f5f5" />
      <XAxis dataKey="dateString" scale="band" />
      <YAxis />
      <Tooltip content={customTooltip} />
      <Legend />
      <Bar name="Gelir" dataKey="income" barSize={20} fill={COLORS.income} radius={[4, 4, 0, 0]} />
      <Bar name="Gider" dataKey="expenses" barSize={20} fill={COLORS.expense} radius={[4, 4, 0, 0]} />
      <Line type="monotone" name="Kar" dataKey="profit" stroke={COLORS.profit} strokeWidth={3} />
      <Scatter name="Bilanço" dataKey="balance" fill={COLORS.profit} />
    </ComposedChart>
  </ResponsiveContainer>
);

// Balance Chart Component
export const BalanceChartComponent = ({ data, customTooltip }) => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart
      data={data}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="dateString" />
      <YAxis />
      <Tooltip content={customTooltip} />
      <Legend />
      <Line 
        type="monotone" 
        name="Birikimli Bakiye" 
        dataKey="cumulativeBalance" 
        stroke={COLORS.cumulative} 
        dot={{ stroke: COLORS.cumulative, strokeWidth: 2 }} 
        activeDot={{ r: 8 }} 
        strokeWidth={3}
      />
      <Line 
        type="monotone" 
        name="Günlük Bakiye" 
        dataKey="balance" 
        stroke={COLORS.balance} 
        dot={{ stroke: COLORS.balance, strokeWidth: 2 }} 
        activeDot={{ r: 8 }} 
        strokeWidth={2}
      />
    </LineChart>
  </ResponsiveContainer>
);

// Pie Charts Component
export const PieChartsComponent = ({ data, customTooltip }) => {
  // Prepare data for pie charts
  const incomePieData = data.filter(item => item.income > 0);
  const expensePieData = data.filter(item => item.expenses > 0);
  const profitPieData = data.filter(item => item.profit > 0);
  
  return (
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Card title="Gelir Dağılımı" className="modern-card">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={incomePieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                fill="#8884d8"
                dataKey="income"
                nameKey="dateString"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {incomePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.pieColors[index % COLORS.pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} TL`} />
              <Legend layout="vertical" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card title="Gider Dağılımı" className="modern-card">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={expensePieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                fill="#8884d8"
                dataKey="expenses"
                nameKey="dateString"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {expensePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.pieColors[index % COLORS.pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} TL`} />
              <Legend layout="vertical" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card title="Kar Dağılımı" className="modern-card">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={profitPieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                fill="#8884d8"
                dataKey="profit"
                nameKey="dateString"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {profitPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.pieColors[index % COLORS.pieColors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} TL`} />
              <Legend layout="vertical" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </Col>
    </Row>
  );
};

// Chart Factory - decides which chart to render based on type
export const ChartFactory = ({ type, data, customTooltip, balanceData }) => {
  switch (type) {
    case 'bar':
      return <BarChartComponent data={data} customTooltip={customTooltip} />;
    case 'line':
      return <LineChartComponent data={data} customTooltip={customTooltip} />;
    case 'area':
      return <AreaChartComponent data={data} customTooltip={customTooltip} />;
    case 'combined':
      return <ComposedChartComponent data={data} customTooltip={customTooltip} />;
    case 'balance':
      return <BalanceChartComponent data={balanceData || data} customTooltip={customTooltip} />;
    case 'pie':
      return <PieChartsComponent data={data} customTooltip={customTooltip} />;
    default:
      return <BarChartComponent data={data} customTooltip={customTooltip} />;
  }
};