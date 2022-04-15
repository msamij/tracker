import { constructDate } from '@utils/helpers';
import { BUDGET_MENU_URL } from '@utils/config';
import { processGetRequest, processPostRequest, processDeleteRequest } from '@AJAX/Ajax';

export interface Model {
  budget?: number;
  budgetDate?: string;
  incomeDate?: string;
  incomeTitle?: string;
  incomeAmount?: number;
  incomeCount?: number;
  expenseDate?: string;
  expenseTitle?: string;
  expenseAmount?: number;
  expenseCount?: number;
  incomeCategoryDate?: string;
  incomeCategoryTitle?: string;
  incomeCategoryCount?: number;
  expenseCategoryDate?: string;
  expenseCategoryTitle?: string;
  expenseCategoryCount?: number;
}

export async function saveCategory(buttonType: string, inputDate: string, inputTitle: string): Promise<string> {
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

export async function deleteCategory(
  type: 'income' | 'expense',
  title: string,
  month: string,
  year: string
): Promise<void> {
  // console.log(`${BUDGET_MENU_URL}delete-${type}-category/?month=${month}&year=${year}&title=${title}`);
  await processDeleteRequest(`${BUDGET_MENU_URL}delete-${type}-category/?month=${month}&year=${year}&title=${title}`);
}

export async function getJsonDataAsString(url: string): Promise<Model> {
  const result = await processGetRequest(`${url}`);
  return JSON.parse(result);
}
