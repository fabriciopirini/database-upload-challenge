import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    const { income, outcome } = transactions.reduce(
      (accumulator: Omit<Balance, 'total'>, { type, value }: Transaction) => {
        if (type === 'income')
          return {
            ...accumulator,
            income: accumulator.income + Number(value),
          };
        if (type === 'outcome')
          return {
            ...accumulator,
            outcome: accumulator.outcome + Number(value),
          };
        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
      },
    );

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
