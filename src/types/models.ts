export type TransactionType = "income" | "expense"; // e.g., "income" for salary, "expense" for groceries

export type Transaction = {
  id: string; // e.g., "txn_001"
  date: string; // ISO date string, e.g., "2025-12-01"
  description: string; // e.g., "Grocery shopping at Walmart"
  amount: number; // positive number in account currency, e.g., 49.99
  category: string; // category id or name, e.g., "groceries"
  type: TransactionType; // "income" or "expense"
  accountId: string; // e.g., "acc_checking_001"
  currencyId: string; // e.g., "USD"
  isProjected: false; // actual/posted transaction
};

export type ProjectedTransaction = {
  id: string; // e.g., "ptxn_2026_01_rent"
  date: string; // next occurrence date, e.g., "2026-01-01"
  description: string; // e.g., "Monthly rent"
  amount: number; // e.g., 1200
  category: string; // e.g., "rent"
  type: TransactionType; // often "expense" but can be "income" for expected salary
  accountId: string; // target account, e.g., "acc_checking_001"
  currencyId: string; // e.g., "USD"
  isProjected: true; // indicates this is a forecasted transaction
  frequency?: "once" | "monthly" | "quarterly" | "yearly"; // e.g., "monthly"
};

export type AnyTransaction = Transaction | ProjectedTransaction; // union of actual and projected

export type Currency = {
  id: string; // e.g., "USD"
  code: string; // ISO 4217 code, e.g., "USD"
  symbol: string; // e.g., "$"
  name: string; // e.g., "United States Dollar"
};

export type Institution = {
  id: string; // e.g., "inst_chase_001"
  name: string; // e.g., "Chase Bank"
  type: string; // e.g., "bank", "broker", "crypto_exchange"
};

export type AccountType =
  | "savings"
  | "checking"
  | "credit_card"
  | "investment"
  | "loan"
  | "cash"
  | "wallet";

export type AccountSubType =
  /* Savings */
  | "savings_emergency"
  | "savings_goal"

  /* Checking */
  | "checking_personal"
  | "checking_business"

  /* Credit Cards */
  | "credit_card_personal"
  | "credit_card_corporate"

  /* Investments */
  | "investment_stocks"
  | "investment_crypto"
  | "investment_mutual_funds"

  /* Loans */
  | "loan_personal"
  | "loan_education"

  /* Cash & Wallet */
  | "cash_wallet"
  | "wallet_upi";

export type Account = {
  id: string; // e.g., "acc_checking_001"
  name: string; // e.g., "Personal Checking"
  type: AccountType; // e.g., "checking"
  subType: AccountSubType; // e.g., "checking_personal"
  institutionId: string; // link to institution, e.g., "inst_chase_001"
  currencyId: string; // e.g., "USD"
  balance?: number; // current balance, e.g., 2450.75 (optional)
  createdAt: string; // ISO timestamp, e.g., "2025-11-15T09:30:00Z"
};

export type AccountSummary = {
  accountId: string; // reference to Account.id
  accountName: string; // display name, e.g., "Personal Checking"
  currencyId: string; // e.g., "USD"
  balance: number; // ending balance for period, e.g., 2450.75
  totalIncome: number; // sum of income transactions, e.g., 3000
  totalExpense: number; // sum of expense transactions, e.g., 550
  net: number; // totalIncome - totalExpense, e.g., 2450
};

export type Category = {
  id: string; // e.g., "cat_groceries"
  name: string; // e.g., "Groceries"
  type: TransactionType; // categories scoped to "income" or "expense"
  parentId?: string; // optional parent category id, e.g., "cat_living_expenses"
  description?: string; // e.g., "Food and household supplies"
  keywords?: string[]; // matching hints, e.g., ["supermarket", "walmart", "food"]
  icon?: string; // UI icon key, e.g., "shopping-cart"
  color?: string; // hex or CSS color, e.g., "#34D399"
};

export type CategoryPattern = {
  id: string; // e.g., "pat_walmart_groceries"
  categoryId: string; // link to Category.id, e.g., "cat_groceries"
  pattern: string; // text or regex, e.g., "walmart|costco"
  matchType: "regex" | "contains"; // matching strategy
  confidence?: number; // 0-1 score for auto-categorization, e.g., 0.9
};

export type CategoryAggregate = {
  category: string; // category id or name, e.g., "Groceries"
  actualAmount: number; // sum of actual transactions for category, e.g., 320.45
  projectedAmount: number; // sum of projected transactions for category, e.g., 350
  percentage?: number; // share of total, e.g., 0.18 for 18% (optional)
};

export type Goal = {
  id: string; // e.g., "goal_vacation_2026"
  name: string; // e.g., "Vacation Fund"
  targetAmount: number; // e.g., 2000
  currentAmount?: number; // current progress, e.g., 450 (optional)
  targetDate?: string; // target completion date, e.g., "2026-06-01" (optional)
  accountId?: string; // linked savings account id (optional)
  createdAt: string; // ISO timestamp, e.g., "2025-10-01T12:00:00Z"
};

export type MonthlyAggregate = {
  month: string; // YYYY-MM, e.g., "2025-12"
  actualIncome: number; // sum of posted income, e.g., 3200
  projectedIncome: number; // expected income, e.g., 3200
  actualExpense: number; // sum of posted expenses, e.g., 1800
  projectedExpense: number; // expected expenses, e.g., 1600
};
