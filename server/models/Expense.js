const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  category: {
    type: String,
    enum: ['Food', 'Accommodation', 'Transport', 'Activities', 'Shopping', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    default: Date.now
  },
  paidBy: {
    type: String,
    default: 'Me'
  }
}, {
  timestamps: true
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;
