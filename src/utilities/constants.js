export const ENDPOINTS = {
  ACCOUNTS: 'api/Account',
  CATEGORIES: 'api/Category',
  MERCHANTS: 'api/Merchant',
  MERCHANT_SEARCH_STRING: 'api/Merchant/searchstring',
  CASHFLOW: 'api/CashFlow',
  TRANSACTION: 'api/Transaction',
  TRANSACTION_CATEGORIZE: 'api/Transaction/category',
  CATEGORY_SPENDING: 'api/CategorySpending',
  UNASSIGNED_TRANSACTION_COUNTS: 'api/UnassignedTransaction',
  FULL_TRANSACTIONS_BY_MONTH: 'api/FullTransaction/month',
  FULL_TRANSACTIONS_BY_ID: 'api/FullTransaction/id',
  SIMILAR_TRANSACTIONS: 'api/TransactionSimilarity'
}

export const TRANSACTION_CATEGORIZATION_TYPE = {
  MERCHANT: 'MERCHANT',
  USER_SELECTED_CATEGORY: 'USER_SELECTED_CATEGORY'
}