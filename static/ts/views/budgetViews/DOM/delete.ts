import { Model, deleteCategory, getJsonDataAsString } from '@models/Model';
import { viewState, incomeCategoryPagination } from 'app';
import budgetElements from '@DOMElements/budget';
import categoryElements from '@DOMElements/category';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { BUDGET_MENU_URL } from '@utils/config';
import { constructDate } from '@utils/helpers';

export async function deleteIncomeCategory(): Promise<void> {
  // Case 1
  if (+categoryElements.getFormAttributeValue('incomes') === 1) {
    await deleteCategory(
      'income',
      categoryElements.getCategoryTitle('income'),
      constructDate('month', categoryElements.getCategoryDate('income')),
      constructDate('year', categoryElements.getCategoryDate('income'))
    );
    const newBudget = await getJsonDataAsString(
      `${BUDGET_MENU_URL}budget/?month=${constructDate('month', budgetElements.getDate())}&year=${constructDate(
        'year',
        budgetElements.getDate()
      )}`
    );

    if (categoryElements.getFormElement('incomes').children[0] instanceof HTMLButtonElement) {
      categoryElements.getFormElement('incomes').children[0].remove();
    }
    if (categoryElements.getFormElement('incomes').children[2] instanceof HTMLButtonElement) {
      categoryElements.getFormElement('incomes').children[2].remove();
    }

    while (categoryElements.getFormElement('incomes').firstChild) {
      categoryElements.getFormElement('incomes').firstChild.remove();
    }
    incomeAndExpenseElements.getAddButton('income').remove();
    if (+incomeAndExpenseElements.getFormAttributeValue('incomes') > 0) {
      while (incomeAndExpenseElements.getFormElement('incomes').firstChild) {
        incomeAndExpenseElements.getFormElement('incomes').firstChild.remove();
      }
    }
    budgetElements.setBudget = newBudget.budget;
    categoryElements.setFormAttributeValue('incomes', 0);
  } else if (+categoryElements.getFormAttributeValue('incomes') > 1) {
    if (viewState.state.currentIncomeCategoryPage < +categoryElements.getFormAttributeValue('incomes')) {
      categoryElements.setFormAttributeValue('incomes', +categoryElements.getFormAttributeValue('incomes') - 1);
    } else if (viewState.state.currentIncomeCategoryPage === +categoryElements.getFormAttributeValue('incomes')) {
      categoryElements.setFormAttributeValue('incomes', +categoryElements.getFormAttributeValue('incomes') - 1);
      viewState.state.currentIncomeCategoryPage = +categoryElements.getFormAttributeValue('incomes');
    }

    if (viewState.state.currentIncomeCategoryPage === +categoryElements.getFormAttributeValue('incomes')) {
      if (categoryElements.getFormElement('incomes').children[2] instanceof HTMLButtonElement) {
        categoryElements.getFormElement('incomes').children[2].remove();
      }
    }
  }
}
