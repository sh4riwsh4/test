// src/mock/expenses.js

const categories = ['Rent', 'Utilities', 'Salaries', 'Supplies', 'Marketing', 'Services'];
const descriptions = [
  'Office rent', 'Electricity and water', 'Employee salaries', 'Office supplies', 'Online advertising', 'Internet and phone'
];

// Rastgele veri oluşturma fonksiyonu
const generateIncome = () => {
  let expenses = [];
  let id = 1;

  // 10 Mart 2025'ten başlayarak 20 gün boyunca veri oluştur
  for (let day = 10; day <= 30; day++) {
    const date = `2025-03-${day < 10 ? '0' + day : day}`; // Tarih formatı: YYYY-MM-DD

    // Her gün için 3-4 adet veri oluştur
    const itemsPerDay = Math.floor(Math.random() * 2) + 3; // 3 veya 4 adet
    for (let i = 0; i < itemsPerDay; i++) {
      const companyId = Math.floor(Math.random() * 3) + 1; // 1, 2 veya 3
      const categoryIndex = Math.floor(Math.random() * categories.length);
      const amount = Math.floor(Math.random() * 2000) + 500; // 500 ile 2500 arasında rastgele miktar

      expenses.push({
        id: id++,
        companyId: companyId,
        date: date,
        amount: amount,
        category: categories[categoryIndex],
        description: descriptions[categoryIndex]
      });
    }
  }

  return expenses;
};

export const income = generateIncome();