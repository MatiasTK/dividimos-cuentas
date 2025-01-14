import { Person } from './person';

export interface Payer extends Person {
  amount: number;
}
