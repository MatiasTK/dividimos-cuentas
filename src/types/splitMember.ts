import { Person } from './person';

type Equal = {
  type: 'equal';
};

type Fixed = {
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
