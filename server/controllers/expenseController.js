const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

// Get expenses for a trip
exports.getTripExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    // Verify user owns the trip
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const expenses = await Expense.find({ tripId }).sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { tripId, title, amount, currency, category, date, paidBy } = req.body;

    // Verify user owns the trip
    const trip = await Trip.findOne({ _id: tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or unauthorized' });
    }

    const newExpense = new Expense({
      tripId,
      title,
      amount,
      currency,
      category,
      date: date ? new Date(date) : Date.now(),
      paidBy
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Verify user owns the associated trip
    const trip = await Trip.findOne({ _id: expense.tripId, user: req.user._id });
    if (!trip) {
      return res.status(404).json({ message: 'Unauthorized' });
    }

    await Expense.findByIdAndDelete(id);
    res.json({ message: 'Expense removed' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
