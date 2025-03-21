  // src/utils/calculations.js
  export const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };
  
  export const calculateCategoryTotals = (items) => {
    const categoryTotals = {};
    
    items.forEach(item => {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = 0;
      }
      categoryTotals[item.category] += item.amount;
    });
    
    return categoryTotals;
  };
  
  export const calculateDailyTotals = (items, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dailyTotals = {};
    
    // Initialize each date with 0
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      dailyTotals[dateString] = 0;
    }
    
    // Sum up amounts for each date
    items.forEach(item => {
      const itemDate = item.date;
      if (itemDate in dailyTotals) {
        dailyTotals[itemDate] += item.amount;
      }
    });
    
    return dailyTotals;
  };
  
