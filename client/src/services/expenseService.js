import api from './api';

const expenseService = {
  // Get expenses for a trip
  getTripExpenses: async (tripId) => {
    const response = await api.get(`/expenses/trip/${tripId}`);
    return response.data;
  },

  // Add an expense
  addExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },

  // Delete an expense
  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  }
};

export default expenseService;

