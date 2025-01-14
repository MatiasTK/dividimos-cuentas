import { Payer } from './payer';
import { SplitMember } from './splitMember';

export interface Item {
  id: string;
  description: string;
  paidBy: Payer[];
  splitBetween: SplitMember[];
}
