import { viewState } from 'app';
import { Model } from '@models/Model';
import { constructDate } from '@utils/helpers';
import { INCOME_PAGE_URL, EXPENSE_PAGE_URL } from '@utils/config';
import { PaginationView } from './paginationView';
import categoryElements from '@budgetViews/categoryView';
import incomeAndExpenseElements from '@budgetViews/incomeAndExpenseView';
import { IncomeAndExpensePaginationButton } from '@budgetViews/components/paginationButtons';

class IncomePaginationView extends PaginationView {
  protected data: Model;

  async paginateIncome(): Promise<void> {
    const url = `${INCOME_PAGE_URL}${viewState.state.currentIncomePage}/?month=${+constructDate(
      'month',
      categoryElements.getCategoryDate('income')
    )}&year=${+constructDate(
      'year',
      categoryElements.getCategoryDate('income')
    )}&title=${categoryElements.getCategoryTitle('income')}`;

    this.data = await this.updatePaginationButtonOnUI(
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

class ExpensePaginationView extends PaginationView {
  protected data: Model;

  async paginateExpense(): Promise<void> {
    const url = `${EXPENSE_PAGE_URL}${viewState.state.currentExpensePage}/?month=${+constructDate(
      'month',
      categoryElements.getCategoryDate('expense')
    )}&year=${+constructDate(
      'year',
      categoryElements.getCategoryDate('expense')
    )}&title=${categoryElements.getCategoryTitle('expense')}`;

    this.data = await this.updatePaginationButtonOnUI(
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
