
export interface CollateralInfo {
  id: string;
  description: string;
}

export interface ChurchFormData {
  churchName: string;
  denomination: string;
  location: string;
  memberCount: string;
  currentLoanAmount: string;
  bankName: string;
  currentInterestRate: string;
  collaterals: CollateralInfo[];
  photo: File | null;
  managerName: string;
  position: string;
  phoneNumber: string;
  email: string;
  applicantName: string;
  agreement: boolean;
}

export enum Step {
  START = 0,
  CHURCH_INFO = 1,
  LOAN_STATUS = 2,
  COLLATERAL = 3,
  ATTACHMENT = 4,
  SUBMISSION = 5
}
