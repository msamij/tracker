import { processDeleteRequest, processGetRequest, processPostRequest, processUpdateRequest } from '@AJAX/Ajax';
import { BUDGET_MENU_URL } from '@utils/config';
import { constructDate } from '@utils/helpers';

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

export async function requestDeleteCategory(
  type: 'income' | 'expense',
  title: string,
  month: string,
  year: string
): Promise<void> {
  await processDeleteRequest(`${BUDGET_MENU_URL}delete-${type}-category/?month=${month}&year=${year}&title=${title}`);
}

export async function requestDeleteIncomeAndExpense(
  type: 'income' | 'expense',
  title: string,
  categoryTitle: string,
  month: string,
  year: string
): Promise<void> {
  await processDeleteRequest(
    `${BUDGET_MENU_URL}delete-${type}/?month=${month}&year=${year}&title=${title}&categoryTitle=${categoryTitle}`
  );
}

export async function requestUpdateCategory(
  type: 'income' | 'expense',
  year: string,
  month: string,
  title: string,
  newTitle: string
): Promise<void> {
  await processUpdateRequest(
    `${BUDGET_MENU_URL}update-${type}-category/?month=${month}&year=${year}&title=${title}&newTitle=${newTitle}`
  );
}

export async function requestUpdateIncomeAndExpense(
  type: 'income' | 'expense',
  year: string,
  month: string,
  title: string,
  newTitle: string,
  categoryTitle: string,
  newAmount: string
): Promise<Model> {
  const result = await processUpdateRequest(
    `${BUDGET_MENU_URL}update-${type}/?month=${month}&year=${year}&title=${title}&newTitle=${newTitle}&categoryTitle=${categoryTitle}&newAmount=${newAmount}`
  );
  return JSON.parse(result);
}

export async function getJsonDataAsString(url: string): Promise<Model> {
  const result = await processGetRequest(`${url}`);
  return JSON.parse(result);
}
