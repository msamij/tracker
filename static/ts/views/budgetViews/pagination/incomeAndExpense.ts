import { viewState } from 'app';
import { Model } from '@models/Model';
import { constructDate } from '@utils/helpers';
import categoryElements from '@DOMElements/category';
import { PaginationDomUpdate } from './paginationView';
import { INCOME_PAGE_URL, EXPENSE_PAGE_URL } from '@utils/config';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { IncomeAndExpensePaginationButton } from '@budgetViews/components/paginationButtons';

export class IncomePagination extends PaginationDomUpdate {
  protected data: Model;
  protected getJsonData: (url: string) => Promise<Model>;

  constructor(getJsonData: (url: string) => Promise<Model>) {
    super();
    this.getJsonData = getJsonData;
  }

  async updateDOMOnPagination(): Promise<void> {
    await this.saveData(
      `${INCOME_PAGE_URL}${viewState.state.currentIncomePage}/?month=${+constructDate(
        'month',
        categoryElements.getCategoryDate('income')
      )}&year=${+constructDate(
        'year',
        categoryElements.getCategoryDate('income')
      )}&title=${categoryElements.getCategoryTitle('income')}`
    );

    this.updateButtonsOnPageChange(
      viewState.state.currentIncomePage,
      +incomeAndExpenseElements.getFormAttributeValue('incomes'),
      incomeAndExpenseElements.getFormElement('incomes'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-income'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('prev', 'add-income')
    );
    this.updateIncomeAndExpense('income');
  }
}

export class ExpensePagination extends PaginationDomUpdate {
  protected data: Model;
  protected getJsonData: (url: string) => Promise<Model>;

  constructor(getJsonData: (url: string) => Promise<Model>) {
    super();
    this.getJsonData = getJsonData;
  }

  async updateDOMOnPagination(): Promise<void> {
    await this.saveData(
      `${EXPENSE_PAGE_URL}${viewState.state.currentExpensePage}/?month=${+constructDate(
        'month',
        categoryElements.getCategoryDate('expense')
      )}&year=${+constructDate(
        'year',
        categoryElements.getCategoryDate('expense')
      )}&title=${categoryElements.getCategoryTitle('expense')}`
    );

    this.updateButtonsOnPageChange(
      viewState.state.currentExpensePage,
      +incomeAndExpenseElements.getFormAttributeValue('expenses'),
      incomeAndExpenseElements.getFormElement('expenses'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-expense'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('prev', 'add-expense')
    );
    this.updateIncomeAndExpense('expense');
  }
}
