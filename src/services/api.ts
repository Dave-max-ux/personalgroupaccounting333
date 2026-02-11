// API Base URL - Update this to match your PHP backend location
const API_BASE_URL = 'http://localhost/first-groups-accounting/php-backend/api';

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// User API
export const userApi = {
  getProfile: () => apiFetch('user.php', { method: 'GET' }),
  
  updateProfile: (data: { name?: string; email?: string; phone?: string }) =>
    apiFetch('user.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Accounts API
export const accountsApi = {
  getAccounts: () => apiFetch('accounts.php', { method: 'GET' }),
  
  updateBalance: (data: {
    account_type: 'main' | 'stash';
    amount: number;
    operation: 'add' | 'subtract';
    category: string;
    description?: string;
  }) =>
    apiFetch('accounts.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Transactions API
export const transactionsApi = {
  getTransactions: (category?: string) => {
    const url = category ? `transactions.php?category=${category}` : 'transactions.php';
    return apiFetch(url, { method: 'GET' });
  },
  
  createTransaction: (data: {
    account_type: string;
    type: 'credit' | 'debit';
    category: string;
    amount: number;
    description?: string;
  }) =>
    apiFetch('transactions.php', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Savings Plans API
export const savingsApi = {
  getPlans: (status?: string) => {
    const url = status ? `savings.php?status=${status}` : 'savings.php';
    return apiFetch(url, { method: 'GET' });
  },
  
  createPlan: (data: {
    plan_name: string;
    target_amount: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    start_date: string;
    end_date: string;
    description?: string;
    icon?: string;
    color?: string;
    auto_save?: boolean;
  }) =>
    apiFetch('savings.php', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updatePlan: (data: {
    plan_id: number;
    transaction_type: 'deposit' | 'withdrawal';
    amount: number;
    notes?: string;
  }) =>
    apiFetch('savings.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  deletePlan: (planId: number) =>
    apiFetch(`savings.php?id=${planId}`, { method: 'DELETE' }),
};

// Circles API
export const circlesApi = {
  getCircles: (filter?: string) => {
    const url = filter ? `circles.php?filter=${filter}` : 'circles.php';
    return apiFetch(url, { method: 'GET' });
  },
  
  getCircleDetails: (circleId: number) =>
    apiFetch(`circles.php?id=${circleId}`, { method: 'GET' }),
  
  createCircle: (data: {
    circle_name: string;
    description?: string;
    target_amount: number;
    max_members?: number;
    is_public?: boolean;
    category?: string;
  }) =>
    apiFetch('circles.php', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  joinCircle: (circleId: number) =>
    apiFetch('circles.php', {
      method: 'PUT',
      body: JSON.stringify({ circle_id: circleId, action: 'join' }),
    }),
  
  contributeToCircle: (circleId: number, amount: number) =>
    apiFetch('circles.php', {
      method: 'PUT',
      body: JSON.stringify({
        circle_id: circleId,
        action: 'contribute',
        amount,
      }),
    }),
  
  leaveCircle: (circleId: number) =>
    apiFetch(`circles.php?id=${circleId}`, { method: 'DELETE' }),
};

// Investments API
export const investmentsApi = {
  getInvestments: () => apiFetch('investments.php', { method: 'GET' }),
  
  createInvestment: (data: {
    investment_name: string;
    investment_type: string;
    amount_invested: number;
    current_value: number;
    purchase_date: string;
    maturity_date?: string;
    description?: string;
  }) =>
    apiFetch('investments.php', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateInvestment: (data: {
    investment_id: number;
    current_value?: number;
    return_percentage?: number;
    status?: 'active' | 'matured' | 'sold';
  }) =>
    apiFetch('investments.php', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  liquidateInvestment: (investmentId: number) =>
    apiFetch(`investments.php?id=${investmentId}`, { method: 'DELETE' }),
};

// Bills API
export const billsApi = {
  getBills: (status?: string) => {
    const url = status ? `bills.php?status=${status}` : 'bills.php';
    return apiFetch(url, { method: 'GET' });
  },
  
  createBill: (data: {
    bill_type: string;
    biller_name: string;
    amount: number;
    due_date: string;
    is_recurring?: boolean;
    recurrence_frequency?: 'weekly' | 'monthly' | 'yearly';
    account_number?: string;
  }) =>
    apiFetch('bills.php', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  payBill: (billId: number) =>
    apiFetch('bills.php', {
      method: 'PUT',
      body: JSON.stringify({ bill_id: billId, action: 'pay' }),
    }),
  
  deleteBill: (billId: number) =>
    apiFetch(`bills.php?id=${billId}`, { method: 'DELETE' }),
};

// Settings API
export const settingsApi = {
  getSettings: () => apiFetch('settings.php', { method: 'GET' }),
  
  updateSetting: (key: string, value: any) =>
    apiFetch('settings.php', {
      method: 'PUT',
      body: JSON.stringify({ setting_key: key, setting_value: value }),
    }),
  
  resetSettings: () => apiFetch('settings.php', { method: 'DELETE' }),
};

export default {
  userApi,
  accountsApi,
  transactionsApi,
  savingsApi,
  circlesApi,
  investmentsApi,
  billsApi,
  settingsApi,
};
