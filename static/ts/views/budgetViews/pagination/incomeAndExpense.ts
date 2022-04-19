import { IncomeAndExpensePaginationButton } from '@budgetViews/components/paginationButtons';
import { PaginationDOMUpdateAdapter } from '@budgetViews/pagination/paginationView';
import { CategoryElements } from '@DOMElements/category';
import { IncomeAndExpenseElements } from '@DOMElements/incomeAndExpense';
import { Model } from '@models/Model';
import { EXPENSE_PAGE_URL, INCOME_PAGE_URL } from '@utils/config';
import { constructDate } from '@utils/helpers';
import { viewState } from 'app';

export class IncomePagination extends PaginationDOMUpdateAdapter {
  protected data: Model;

  constructor(protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.getJsonDataAsString = getJsonDataAsString;
  }

  async updateDOMOnPagination(): Promise<void> {
    await this.saveData(
      `${INCOME_PAGE_URL}${viewState.state.currentIncomePage}/?month=${+constructDate(
        'month',
        CategoryElements.getCategoryDate('income')
      )}&year=${+constructDate(
        'year',
        CategoryElements.getCategoryDate('income')
      )}&title=${CategoryElements.getCategoryTitle('income')}`
    );

    this.updateButtonsOnPageChange(
      viewState.state.currentIncomePage,
      +IncomeAndExpenseElements.getFormAttributeValue('incomes'),
      IncomeAndExpenseElements.getFormElement('incomes'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-income'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('prev', 'add-income')
    );
    this.updateIncomeAndExpense('income');
  }
}

export class ExpensePagination extends PaginationDOMUpdateAdapter {
  protected data: Model;

  constructor(protected getJsonDataAsString: (url: string) => Promise<Model>) {
    super();
    this.getJsonDataAsString = getJsonDataAsString;
  }

  async updateDOMOnPagination(): Promise<void> {
    await this.saveData(
      `${EXPENSE_PAGE_URL}${viewState.state.currentExpensePage}/?month=${+constructDate(
        'month',
        CategoryElements.getCategoryDate('expense')
      )}&year=${+constructDate(
        'year',
        CategoryElements.getCategoryDate('expense')
      )}&title=${CategoryElements.getCategoryTitle('expense')}`
    );

    this.updateButtonsOnPageChange(
      viewState.state.currentExpensePage,
      +IncomeAndExpenseElements.getFormAttributeValue('expenses'),
      IncomeAndExpenseElements.getFormElement('expenses'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('next', 'add-expense'),
      new IncomeAndExpensePaginationButton().getComponentMarkup('prev', 'add-expense')
    );
    this.updateIncomeAndExpense('expense');
  }
}
