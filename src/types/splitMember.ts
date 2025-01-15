import { Person } from './person';

export type Equal = {
  type: 'equal';
};

export type Fixed = {
  type: 'fixed';
  amount: number;
};

export type Percentage = {
  type: 'percentage';
  percentage: number;
};

export interface SplitMember extends Person {
  splitMethod: Equal | Fixed | Percentage;
}
