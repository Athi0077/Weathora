import api from './api';

const API_URL = '/reviews/';

// Create a review
const createReview = async (reviewData) => {
  const response = await api.post(API_URL, reviewData);
  return response.data;
};

// Get reviews (with pagination and sorting)
const getReviews = async (page = 1, limit = 10, sort = 'recent') => {
  const response = await api.get(`${API_URL}?page=${page}&limit=${limit}&sort=${sort}`);
  return response.data;
};

// Get review summary
const getReviewSummary = async () => {
  const response = await api.get(`${API_URL}summary`);
  return response.data;
};

// Get my review
const getMyReview = async () => {
  const response = await api.get(`${API_URL}my-review`);
  return response.data;
};

// Update review
const updateReview = async (id, reviewData) => {
  const response = await api.put(`${API_URL}${id}`, reviewData);
  return response.data;
};

// Delete review
const deleteReview = async (id) => {
  const response = await api.delete(`${API_URL}${id}`);
  return response.data;
};

// Admin: Get all reviews
const getAdminReviews = async () => {
  const response = await api.get(`${API_URL}admin/all`);
  return response.data;
};

// Admin: Update review status
const updateReviewStatus = async (id, status) => {
  const response = await api.put(`${API_URL}admin/${id}/status`, { status });
  return response.data;
};

const reviewService = {
  createReview,
  getReviews,
  getReviewSummary,
  getMyReview,
  updateReview,
  deleteReview,
  getAdminReviews,
  updateReviewStatus
};

export default reviewService;
