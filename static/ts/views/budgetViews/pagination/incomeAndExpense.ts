import { viewState } from 'app';
import { Model } from '@models/Model';
import { constructDate } from '@utils/helpers';
import { INCOME_PAGE_URL, EXPENSE_PAGE_URL } from '@utils/config';
import { PaginationDomUpdate } from './paginationView';
import categoryElements from '@DOMElements/category';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { IncomeAndExpensePaginationButton } from '@budgetViews/components/paginationButtons';

class IncomePaginationView extends PaginationDomUpdate {
  protected data: Model;

  async paginateIncome(): Promise<void> {
    const url = `${INCOME_PAGE_URL}${viewState.state.currentIncomePage}/?month=${+constructDate(
      'month',
      categoryElements.getCategoryDate('income')
    )}&year=${+constructDate(
      'year',
      categoryElements.getCategoryDate('income')
    )}&title=${categoryElements.getCategoryTitle('income')}`;

    this.data = await this.updateButtonsOnPageChange(
      url,
      viewState.state.currentIncomePage,
      +incomeAndExpenseElements.getFormAttributeValue('incomes'),
      incomeAndExpenseElements.getFormElement('incomes'),
      new IncomeAndExpensePaginationButton({
        pageType: 'next',
        buttonType: 'add-income',
      }).getComponentMarkup(),
      new IncomeAndExpensePaginationButton({
        pageType: 'prev',
        buttonType: 'add-income',
      }).getComponentMarkup()
    );
    this.updateIncomeAndExpense('income');
  }
}

class ExpensePaginationView extends PaginationDomUpdate {
  protected data: Model;

  async paginateExpense(): Promise<void> {
    const url = `${EXPENSE_PAGE_URL}${viewState.state.currentExpensePage}/?month=${+constructDate(
      'month',
      categoryElements.getCategoryDate('expense')
    )}&year=${+constructDate(
      'year',
      categoryElements.getCategoryDate('expense')
    )}&title=${categoryElements.getCategoryTitle('expense')}`;

    this.data = await this.updateButtonsOnPageChange(
      url,
      viewState.state.currentExpensePage,
      +incomeAndExpenseElements.getFormAttributeValue('expenses'),
      incomeAndExpenseElements.getFormElement('expenses'),
      new IncomeAndExpensePaginationButton({
        pageType: 'next',
        buttonType: 'add-expense',
      }).getComponentMarkup(),
      new IncomeAndExpensePaginationButton({
        pageType: 'prev',
        buttonType: 'add-expense',
      }).getComponentMarkup()
    );
    this.updateIncomeAndExpense('expense');
  }
}

export const incomePaginationView = new IncomePaginationView();
export const expensePaginationView = new ExpensePaginationView();
