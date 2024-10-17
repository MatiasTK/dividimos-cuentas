// types.ts
export interface Person {
  id: string;
  name: string;
  cvu: string;
  email: string;
}

export interface SplitMember {
  splitAmount: number;
  person: Person;
  splitMethod: 'equally' | 'porcentually' | 'manually';
  isIncluded: boolean;
  porcentalValue?: number;
  manuallyValue?: number;
}

export interface Payer {
  person: Person;
  amount: number;
}

export interface Item {
  id: string;
  description: string;
  price: number;
  paidBy: Payer[];
  sharedBetween: SplitMember[];
}

export interface Debt {
  id: string;
  amount: number;
  debtor: Person;
  creditor: Person;
  paid: boolean;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: Date;
  items: Item[];
  createdBy: Person | null;
  people: Person[];
  debts: Debt[];
}
