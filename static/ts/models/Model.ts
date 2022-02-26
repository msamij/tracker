import { BUDGET_MENU_URL } from '@utils/config';
import { processPostRequest, processGetRequest, constructDate } from '@utils/helpers';

export interface Model {
  budget?: number;
  budgetDate?: string;
  incomeCategoryDate?: string;
  incomeCategoryTitle?: string;
  incomeCategoryCount?: number;
  expenseCategoryDate?: string;
  expenseCategoryTitle?: string;
  expenseCategoryCount?: number;
  incomeDate?: string;
  incomeTitle?: string;
  incomeAmount?: number;
  incomeCount?: number;
  expenseDate?: string;
  expenseTitle?: string;
  expenseAmount?: number;
  expenseCount?: number;
}

export async function saveCategory(
  buttonType: string,
  inputDate: string,
  inputTitle: string
): Promise<string> {
  return await processPostRequest(
    {
      category: inputTitle,
      date: inputDate,
      month: constructDate('month', inputDate),
      year: constructDate('year', inputDate),
    },
    `${BUDGET_MENU_URL}${buttonType}/`
  );
}

export async function saveIncomeAndExpense(
  buttonType: string,
  inputDate: string,
  inputTitle: string,
  inputAmount: string,
  categoryTitle: string
): Promise<string> {
  return await processPostRequest(
    {
      title: inputTitle,
      amount: inputAmount,
      date: inputDate,
      month: constructDate('month', inputDate),
      year: constructDate('year', inputDate),
      categoryTitle,
    },
    `${BUDGET_MENU_URL}${buttonType}/`
  );
}

export async function getJsonData(url: string): Promise<Model> {
  const result = await processGetRequest(`${url}`);
  return JSON.parse(result);
}
