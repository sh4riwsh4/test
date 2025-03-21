import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  InputNumber, 
  DatePicker, 
  Button, 
  Select, 
  Space,
  Divider
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useFinancial } from '../../contexts/FinancialContext';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const ExpenseForm = ({ record, onFinish, onCancel }) => {
  const [form] = Form.useForm();
  const { expenseCategories } = useFinancial();
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState(expenseCategories);

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        ...record,
        date: dayjs(record.date)
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        date: dayjs()
      });
    }
  }, [record, form]);

  const handleFinish = (values) => {
    const formData = {
      ...values,
      date: values.date.format('YYYY-MM-DD')
    };
    
    onFinish(formData);
    form.resetFields();
  };

  const addNewCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        date: dayjs(),
        amount: 0,
      }}
    >
      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true, message: 'Please enter the amount' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          step={0.01}
          precision={2}
          formatter={(value) => `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value.replace(/₺\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <Select
          placeholder="Select a category"
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Input
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button type="text" icon={<PlusOutlined />} onClick={addNewCategory}>
                  Add
                </Button>
              </Space>
            </>
          )}
        >
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <TextArea rows={4} placeholder="Enter description" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            {record ? 'Update' : 'Add'} Expense
          </Button>
          {onCancel && (
            <Button onClick={onCancel}>Cancel</Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ExpenseForm;