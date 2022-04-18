import { IncomeAndExpensePaginationButton } from '@budgetViews/components/paginationButtons';
import { PaginationDOMUpdate } from '@budgetViews/pagination/paginationView';
import categoryElements from '@DOMElements/category';
import incomeAndExpenseElements from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import { EXPENSE_PAGE_URL, INCOME_PAGE_URL } from '@utils/config';
import { constructDate } from '@utils/helpers';
import { viewState } from 'app';

export class IncomePagination extends PaginationDOMUpdate {
  protected data: Model;

  constructor(protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.getJsonDataAsString = getJsonDataAsString;
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

export class ExpensePagination extends PaginationDOMUpdate {
  protected data: Model;

  constructor(protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.getJsonDataAsString = getJsonDataAsString;
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
