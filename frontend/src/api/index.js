import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const eventsApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.participant) queryParams.append('participant', params.participant);
    if (params.tradeId) queryParams.append('trade_id', params.tradeId);
    if (params.startDate) queryParams.append('start_date', params.startDate);
    if (params.endDate) queryParams.append('end_date', params.endDate);
    if (params.riskLevels) queryParams.append('risk_levels', params.riskLevels);
    if (params.channels) queryParams.append('channels', params.channels);
    if (params.tradeNumber) queryParams.append('trade_number', params.tradeNumber);
    
    return api.get(`/events?${queryParams.toString()}`);
  },
  
  getById: (id) => api.get(`/events/${id}`),
};

export const channelsApi = {
  getAll: () => api.get('/channels'),
};

export const riskLevelsApi = {
  getAll: () => api.get('/risk-levels'),
  getStats: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.participant) queryParams.append('participant', params.participant);
    if (params.tradeId) queryParams.append('trade_id', params.tradeId);
    if (params.startDate) queryParams.append('start_date', params.startDate);
    if (params.endDate) queryParams.append('end_date', params.endDate);
    if (params.riskLevels) queryParams.append('risk_levels', params.riskLevels);
    if (params.channels) queryParams.append('channels', params.channels);
    if (params.tradeNumber) queryParams.append('trade_number', params.tradeNumber);
    
    return api.get(`/risk-stats?${queryParams.toString()}`);
  },
};

export const tradesApi = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.tradeNumber) queryParams.append('trade_number', params.tradeNumber);
    
    return api.get(`/trades?${queryParams.toString()}`);
  },
};

export default api;
