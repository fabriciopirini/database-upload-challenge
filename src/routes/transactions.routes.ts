import { Router } from 'express';
import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import Category from '../models/Category';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const createTransactionService = new CreateTransactionService();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoriesRepository = getRepository(Category);
  const transactions = await transactionsRepository.find();

  const transactionsList = await Promise.all(
    transactions.map(
      async ({
        id,
        type,
        value,
        title,
        category_id,
        created_at,
        updated_at,
      }) => {
        const category = await categoriesRepository.findOne(category_id);

        const transaction = {
          id,
          title,
          value,
          type,
          category,
          created_at,
          updated_at,
        };

        return transaction;
      },
    ),
  );

  const balance = await transactionsRepository.getBalance(transactions);

  return response.json({
    transactions: transactionsList,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  return response.json({ ok: true });
});

transactionsRouter.post('/import', async (request, response) => {
  return response.json({ ok: true });
});

export default transactionsRouter;
