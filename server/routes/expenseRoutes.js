const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All expense routes require authentication

// Get expenses for a specific trip
router.get('/trip/:tripId', expenseController.getTripExpenses);

// Add a new expense
router.post('/', expenseController.addExpense);

// Delete an expense
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
