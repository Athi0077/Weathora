import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Plus, Trash2, DollarSign, Loader2 } from 'lucide-react';
import expenseService from '../../services/expenseService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];
const CATEGORIES = ['Food', 'Accommodation', 'Transport', 'Activities', 'Shopping', 'Other'];

const BudgetTracker = ({ tripId }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: 'Food',
    paidBy: 'Me'
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getTripExpenses(tripId);
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;
    
    setAdding(true);
    try {
      const savedExpense = await expenseService.addExpense({
        ...newExpense,
        tripId,
        amount: Number(newExpense.amount)
      });
      setExpenses([savedExpense, ...expenses]);
      setNewExpense({ title: '', amount: '', category: 'Food', paidBy: 'Me' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add expense', error);
      alert('Failed to add expense');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await expenseService.deleteExpense(id);
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (error) {
      console.error('Failed to delete expense', error);
      alert('Failed to delete expense');
    }
  };

  const totalBudget = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Group expenses by category for the chart
  const categoryData = CATEGORIES.map(cat => {
    const value = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return { name: cat, value };
  }).filter(data => data.value > 0);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-default shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-main flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-green-500" />
            Budget & Expenses
          </h2>
          <p className="text-sub text-sm mt-1">Track your spending for this trip</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-full transition-colors font-medium text-sm"
        >
          <Plus size={16} />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side: Summary & Chart */}
        <div>
          <div className="bg-background rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-sub uppercase tracking-wider mb-2">Total Spent</h3>
            <div className="text-4xl font-bold text-main">${totalBudget.toFixed(2)}</div>
          </div>
          
          {categoryData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-background rounded-2xl border-2 border-dashed border-default text-dim">
              No expenses yet
            </div>
          )}
        </div>

        {/* Right side: Form & List */}
        <div>
          {showAddForm && (
            <form onSubmit={handleAddExpense} className="bg-background p-5 rounded-2xl mb-6 border border-default">
              <h4 className="font-semibold text-main mb-4">New Expense</h4>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Description (e.g. Dinner at Joe's)"
                    className="w-full px-4 py-2 rounded-xl border border-default focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-2.5 text-dim">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 rounded-xl border border-default focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <select
                      className="w-full px-4 py-2 rounded-xl border border-default focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-surface"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Paid By (e.g. Me, John)"
                    className="w-full px-4 py-2 rounded-xl border border-default focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    value={newExpense.paidBy}
                    onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm font-medium text-sub hover:text-main transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-full transition-colors disabled:opacity-70"
                  >
                    {adding ? <Loader2 size={16} className="animate-spin" /> : 'Save Expense'}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div>
            <h4 className="font-semibold text-main mb-4">Recent Expenses</h4>
            {expenses.length === 0 ? (
              <p className="text-sm text-sub">No expenses recorded yet.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {expenses.map((expense) => (
                  <div key={expense._id} className="flex items-center justify-between p-4 bg-background rounded-xl border border-default hover:border-default transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium text-main text-sm">{expense.title}</span>
                      <span className="text-xs text-sub flex items-center space-x-2">
                        <span>{expense.category}</span>
                        <span>•</span>
                        <span>Paid by {expense.paidBy}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-main">${expense.amount.toFixed(2)}</span>
                      <button 
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="text-dim hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;

