// src/contexts/FinancialContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { companies } from '../mock/companies';
import { income } from '../mock/income';
import { expenses } from '../mock/expenses';
import { incomeCategories, expenseCategories } from '../mock/categories';

// Create the context
const FinancialContext = createContext();

// Custom hook to use the context
export const useFinancial = () => useContext(FinancialContext);

// Provider component
export const FinancialProvider = ({ children }) => {
  // State for companies, income, and expenses
  const [companyList, setCompanyList] = useState(companies);
  const [incomeList, setIncomeList] = useState(income);
  const [expenseList, setExpenseList] = useState(expenses);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Initialize with the first company selected
  useEffect(() => {
    if (companyList.length > 0 && !selectedCompany) {
      setSelectedCompany(companyList[0].id);
    }
  }, [companyList, selectedCompany]);

  // Function to add a new company
  const addCompany = (company) => {
    const newCompany = {
      ...company,
      id: companyList.length + 1,
    };
    setCompanyList([...companyList, newCompany]);
  };

  // Function to add income
  const addIncome = (income) => {
    const newIncome = {
      ...income,
      id: incomeList.length + 1,
      companyId: selectedCompany,
    };
    setIncomeList([...incomeList, newIncome]);
  };

  // Function to add expense
  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: expenseList.length + 1,
      companyId: selectedCompany,
    };
    setExpenseList([...expenseList, newExpense]);
  };

  // Function to edit income
  const editIncome = (id, updatedIncome) => {
    setIncomeList(
      incomeList.map((item) => (item.id === id ? { ...item, ...updatedIncome } : item))
    );
  };

  // Function to edit expense
  const editExpense = (id, updatedExpense) => {
    setExpenseList(
      expenseList.map((item) => (item.id === id ? { ...item, ...updatedExpense } : item))
    );
  };

  // Function to delete income
  const deleteIncome = (id) => {
    setIncomeList(incomeList.filter((item) => item.id !== id));
  };

  // Function to delete expense
  const deleteExpense = (id) => {
    setExpenseList(expenseList.filter((item) => item.id !== id));
  };

  const getCompanyIncome = (companyId, date) => {
    return incomeList.filter(
      (item) => 
        item.companyId === companyId && 
        new Date(item.date).toDateString() === new Date(date).toDateString()
    );
  };

  // Get expenses for selected company and date
  const getCompanyExpenses = (companyId, date) => {
    return expenseList.filter(
      (item) => 
        item.companyId === companyId && 
        new Date(item.date).toDateString() === new Date(date).toDateString()
    );
  };

  const getCombinedData = () => {
    if (selectedCompany === 'all') {
      return {
        income: income,
        expenses: expenses,
      };
    } else {
      return {
        income: income.filter(item => item.companyId === selectedCompany),
        expenses: expenses.filter(item => item.companyId === selectedCompany),
      };
    }
  };

  // Calculate total income for a company on a specific date
  const calculateDailyIncome = (companyId, date) => {
    const filteredIncome = getCompanyIncome(companyId, date);
    return filteredIncome.reduce((sum, item) => sum + item.amount, 0);
  };

  // Calculate total expenses for a company on a specific date
  const calculateDailyExpenses = (companyId, date) => {
    const filteredExpenses = getCompanyExpenses(companyId, date);
    return filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  };

  // Calculate profit (income - expenses) for a company on a specific date
  const calculateDailyProfit = (companyId, date) => {
    return calculateDailyIncome(companyId, date) - calculateDailyExpenses(companyId, date);
  };

  return (
    <FinancialContext.Provider
      value={{
        companies: companyList,
        income: incomeList,
        expenses: expenseList,
        selectedCompany,
        selectedDate,
        incomeCategories,
        expenseCategories,
        setSelectedCompany,
        setSelectedDate,
        addCompany,
        addIncome,
        addExpense,
        editIncome,
        editExpense,
        deleteIncome,
        deleteExpense,
        getCompanyIncome,
        getCompanyExpenses,
        getCombinedData,
        calculateDailyIncome,
        calculateDailyExpenses,
        calculateDailyProfit,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export default FinancialContext;