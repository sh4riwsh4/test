import React from 'react';
import { 
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

const AdditionalCharts = ({ reportData, totalIncome, totalExpenses, totalProfit }) => {
  // Pie Chart Data Preparation
  const pieChartData = [
    { name: 'Gelir', value: totalIncome },
    { name: 'Gider', value: totalExpenses },
    { name: 'Kar', value: totalProfit }
  ];

  // Hypothetical cash flow and investment amount (you'd replace with actual data)
  const cashFlow = totalIncome - totalExpenses;
  const investmentAmount = totalProfit * 0.2; // Example calculation

  // Radar Chart Data Preparation (multi-dimensional performance metrics)
  const radarChartData = [
    { subject: 'Gelir', A: totalIncome, fullMark: Math.max(totalIncome, totalExpenses, totalProfit) * 1.2 },
    { subject: 'Gider', A: totalExpenses, fullMark: Math.max(totalIncome, totalExpenses, totalProfit) * 1.2 },
    { subject: 'Kar', A: totalProfit, fullMark: Math.max(totalIncome, totalExpenses, totalProfit) * 1.2 },
    { subject: 'Nakit Akışı', A: cashFlow, fullMark: Math.max(totalIncome, totalExpenses, totalProfit) * 1.2 },
    { subject: 'Yatırım', A: investmentAmount, fullMark: Math.max(totalIncome, totalExpenses, totalProfit) * 1.2 }
  ];

  // Scatter Plot Data Preparation
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
    <div>
      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={400}>
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

      {/* Radar Chart */}
      <ResponsiveContainer width="100%" height={400}>
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

      {/* Scatter Plot */}
      <ResponsiveContainer width="100%" height={400}>
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
    </div>
  );
};

export default AdditionalCharts;