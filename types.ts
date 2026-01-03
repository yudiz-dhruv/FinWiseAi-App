export enum LoanType {
  CAR = 'Car Loan',
  HOME = 'Home Loan',
  GOLD = 'Gold Loan',
  PERSONAL = 'Personal Loan',
  OTHER = 'Other Request'
}

export enum IncomeSource {
  MUTUAL_FUNDS = 'Mutual Funds',
  FD = 'Fixed Deposits',
  TURNOVER = 'Business Turnover',
}

export enum EmploymentType {
  SALARIED = 'Salaried',
  SELF_EMPLOYED = 'Self-Employed'
}

export interface OtherIncome {
  id: string;
  source: string;
  amount: number;
}

export interface LoanFormData {
  // Financials
  employmentType: EmploymentType;
  incomeSource: string;
  primaryIncome: number; // Monthly
  otherIncomes: OtherIncome[]; // Dynamic list
  
  // Loan Details
  loanType: string; // The effective loan type name
  customLoanType?: string; // Used when "Other" is selected
  loanAmount: number;
  downPayment?: number;
  durationMonths: number;
  existingEMI: number;
  
  // User Profile
  cibilScore?: number; // Optional manual input
}

export interface BankOffer {
  bankName: string;
  interestRate: number;
  processingFee: string;
  maxTenure: string;
  features: string[];
  matchScore: number; // 0-100 based on user profile
  officialWebUrl?: string; // Link to bank site
}

export interface Showroom {
  name: string;
  address: string;
  rating: string;
  user_ratings_total: number;
  sourceUri?: string;
}

export interface CarRecommendation {
  modelName: string;
  price: string;
  mileage: string;
  category: string;
  fuelType: string;
}

export interface GoldRates {
  gold22k: string;
  gold24k: string;
  silver1kg: string;
  location: string;
}

export interface AIAnalysisResult {
  offers: BankOffer[];
  advice: string;
  recommendedCars?: CarRecommendation[];
  estimatedEMI: number;
  goldRates?: GoldRates;
}