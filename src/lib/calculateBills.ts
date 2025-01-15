import { Item } from '@types';
import { Percentage, SplitMember } from '@/types/splitMember';

export function calculateItemSplit(item: Item): {
  owes: Map<string, number>;
  gets: Map<string, number>;
} {
  const owes = new Map<string, number>();
  const gets = new Map<string, number>();

  // Calculate total item cost
  const totalItemCost = item.paidBy.reduce((sum, payer) => sum + payer.amount, 0);
  let equalAmount = totalItemCost;

  const percentageMembers: SplitMember[] = [];
  const equalMembers: SplitMember[] = [];

  // First add fixed amounts to owes
  item.splitBetween.forEach((member) => {
    if (member.splitMethod.type === 'fixed') {
      owes.set(member.name, member.splitMethod.amount);
      equalAmount -= member.splitMethod.amount;
    } else if (member.splitMethod.type === 'percentage') {
      percentageMembers.push(member);
    } else {
      equalMembers.push(member);
    }
  });

  // Add percentage amounts to owes
  percentageMembers.forEach((member) => {
    const amount = (totalItemCost * (member.splitMethod as Percentage).percentage) / 100;
    owes.set(member.name, amount);
    equalAmount -= amount;
  });

  // Add equal amounts to owes
  equalMembers.forEach((member) => {
    const amount = equalAmount / equalMembers.length;
    owes.set(member.name, amount);
  });

  // Add amounts to payers
  item.paidBy.forEach((payer) => {
    gets.set(payer.name, (gets.get(payer.name) || 0) + payer.amount);
  });

  return { owes, gets };
}

export function calculateFinalSettlement(items: Item[]): Array<{
  from: string;
  to: string;
  amount: number;
}> {
  const totalOwes = new Map<string, number>();
  const totalGets = new Map<string, number>();

  // Calculate total amounts for all items
  items.forEach((item) => {
    const itemSplit = calculateItemSplit(item);

    itemSplit.owes.forEach((amount, person) => {
      totalOwes.set(person, (totalOwes.get(person) || 0) + amount);
    });

    itemSplit.gets.forEach((amount, person) => {
      totalGets.set(person, (totalGets.get(person) || 0) + amount);
    });
  });

  // Calculate net amounts and create settlements
  const settlements: Array<{ from: string; to: string; amount: number }> = [];
  const netAmounts = new Map<string, number>();

  // Calculate net amounts (positive means gets money, negative means owes money)
  [...new Set([...totalOwes.keys(), ...totalGets.keys()])].forEach((person) => {
    const owesAmount = totalOwes.get(person) || 0;
    const getsAmount = totalGets.get(person) || 0;
    netAmounts.set(person, getsAmount - owesAmount);
  });

  // Create settlements
  while ([...netAmounts.values()].some((amount) => Math.abs(amount) > 0.01)) {
    const debtor = [...netAmounts.entries()].find(([, amount]) => amount < -0.01);
    const creditor = [...netAmounts.entries()].find(([, amount]) => amount > 0.01);

    if (debtor && creditor) {
      const amount = Math.min(Math.abs(debtor[1]), creditor[1]);
      settlements.push({
        from: debtor[0],
        to: creditor[0],
        amount: Number(amount.toFixed(2)),
      });

      netAmounts.set(debtor[0], debtor[1] + amount);
      netAmounts.set(creditor[0], creditor[1] - amount);
    }
  }

  return settlements;
}
